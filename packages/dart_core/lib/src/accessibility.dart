/// Funciones de contraste y accesibilidad WCAG 2.1 (port de accessibility.ts).
///
/// @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
library;

import 'dart:math' as math;

import 'converters.dart';
import 'manipulators.dart';

/// Calcula la luminancia relativa de un color según WCAG 2.1 (0-1).
///
/// ```dart
/// getRelativeLuminance('#FFFFFF'); // 1
/// getRelativeLuminance('#000000'); // 0
/// ```
double getRelativeLuminance(String hex) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return 0;

  final channels = <double>[rgb.r, rgb.g, rgb.b].map((channel) {
    final sRGB = channel / 255;
    return sRGB <= 0.03928
        ? sRGB / 12.92
        : math.pow((sRGB + 0.055) / 1.055, 2.4).toDouble();
  }).toList();

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/// Calcula el ratio de contraste entre dos colores según WCAG 2.1 (1-21).
///
/// AA normal >= 4.5:1, AA grande >= 3:1, AAA normal >= 7:1.
double getContrastRatio(String hex1, String hex2) {
  final l1 = getRelativeLuminance(hex1);
  final l2 = getRelativeLuminance(hex2);
  final lighter = math.max(l1, l2);
  final darker = math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/// Verifica si el contraste cumple WCAG AA.
///
/// Texto normal: >= 4.5:1 | Texto grande: >= 3:1.
bool meetsContrastAA(
  String foreground,
  String background, [
  bool isLargeText = false,
]) {
  final ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/// Verifica si el contraste cumple WCAG AAA.
///
/// Texto normal: >= 7:1 | Texto grande: >= 4.5:1.
bool meetsContrastAAA(
  String foreground,
  String background, [
  bool isLargeText = false,
]) {
  final ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/// Calcula el color de texto óptimo (claro u oscuro) para un fondo dado.
///
/// ```dart
/// getContrastColor('#4357AD'); // '#FFFFFF'
/// ```
String getContrastColor(
  String backgroundColor, [
  String lightColor = '#FFFFFF',
  String darkColor = '#1A1A1A',
]) {
  final lightContrast = getContrastRatio(lightColor, backgroundColor);
  final darkContrast = getContrastRatio(darkColor, backgroundColor);
  return lightContrast > darkContrast ? lightColor : darkColor;
}

/// Ajusta un color de texto para garantizar contraste WCAG AA.
///
/// Usa búsqueda binaria O(log n) para encontrar la luminosidad óptima.
///
/// ```dart
/// ensureContrast('#888888', '#FFFFFF'); // Gris más oscuro que cumple 4.5:1
/// ```
String ensureContrast(
  String textColor,
  String backgroundColor, [
  double minRatio = 4.5,
]) {
  final currentRatio = getContrastRatio(textColor, backgroundColor);
  if (currentRatio >= minRatio) return textColor;

  final bgLuminance = getRelativeLuminance(backgroundColor);
  final shouldDarken = bgLuminance > 0.5;

  double low = shouldDarken ? 0 : 50;
  double high = shouldDarken ? 50 : 100;
  var bestColor = textColor;
  var bestRatio = currentRatio;

  for (var i = 0; i < 15; i++) {
    final mid = (low + high) / 2;
    final testColor = setLightness(textColor, mid);
    final testRatio = getContrastRatio(testColor, backgroundColor);

    if (testRatio >= minRatio) {
      bestColor = testColor;
      bestRatio = testRatio;
      if (shouldDarken) {
        low = mid;
      } else {
        high = mid;
      }
    } else {
      if (shouldDarken) {
        high = mid;
      } else {
        low = mid;
      }
    }

    if (high - low < 0.5) break;
  }

  if (bestRatio < minRatio) {
    final fallback = shouldDarken ? '#1A1A1A' : '#FFFFFF';
    if (getContrastRatio(fallback, backgroundColor) > bestRatio) return fallback;
  }

  return bestColor;
}

/// Resultado de [findBestContrast].
class BestContrast {
  const BestContrast({required this.color, required this.ratio});
  final String color;
  final double ratio;
}

/// Encuentra el color de [candidates] con mejor contraste sobre el fondo.
///
/// ```dart
/// findBestContrast('#4357AD', ['#FFFFFF', '#000000']);
/// // BestContrast(color: '#FFFFFF', ratio: 5.5)
/// ```
BestContrast findBestContrast(String backgroundColor, List<String> candidates) {
  var best = BestContrast(color: candidates.first, ratio: 0);

  for (final color in candidates) {
    final ratio = getContrastRatio(color, backgroundColor);
    if (ratio > best.ratio) best = BestContrast(color: color, ratio: ratio);
  }

  return best;
}
