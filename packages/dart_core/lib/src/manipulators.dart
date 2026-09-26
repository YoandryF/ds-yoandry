/// Funciones de manipulación de colores (port de manipulators.ts).
///
/// Nota: se omiten `supportsColorMix` y `mixWithNative` del original porque
/// dependen de `CSS.supports()` del navegador y no aplican a Flutter.
library;

import 'converters.dart';

/// Ajusta la luminosidad de un color a un valor absoluto en HSL (0-100).
///
/// ```dart
/// setLightness('#4357AD', 90); // Versión muy clara
/// ```
String setLightness(String hex, double targetLightness) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return hex;
  final hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = targetLightness.clamp(0.0, 100.0);
  final newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/// Ajusta la saturación de un color a un valor absoluto en HSL (0-100).
String setSaturation(String hex, double targetSaturation) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return hex;
  final hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = targetSaturation.clamp(0.0, 100.0);
  final newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/// Aclara un color aumentando su luminosidad en [percent] (0-100).
String lighten(String hex, double percent) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return hex;
  final hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = (hsl.l + percent).clamp(0.0, 100.0);
  final newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/// Oscurece un color reduciendo su luminosidad en [percent] (0-100).
String darken(String hex, double percent) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return hex;
  final hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = (hsl.l - percent).clamp(0.0, 100.0);
  final newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/// Aumenta la saturación de un color en [percent] (0-100).
String saturate(String hex, double percent) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return hex;
  final hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = (hsl.s + percent).clamp(0.0, 100.0);
  final newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/// Reduce la saturación de un color en [percent] (0-100).
String desaturate(String hex, double percent) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return hex;
  final hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = (hsl.s - percent).clamp(0.0, 100.0);
  final newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/// Rota el tono (hue) del color en [degrees] (-360 a 360).
String adjustHue(String hex, double degrees) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return hex;
  final hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = ((hsl.h + degrees) % 360 + 360) % 360;
  final newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/// Mezcla dos colores. [weight] = peso del segundo color (0 = solo hex1).
///
/// ```dart
/// mix('#4357AD', '#FFFFFF', 0.3); // Azul con 30% blanco
/// ```
String mix(String hex1, String hex2, [double weight = 0.5]) {
  final rgb1 = hexToRgb(hex1);
  final rgb2 = hexToRgb(hex2);
  if (rgb1 == null || rgb2 == null) return hex1;
  final r = rgb1.r * (1 - weight) + rgb2.r * weight;
  final g = rgb1.g * (1 - weight) + rgb2.g * weight;
  final b = rgb1.b * (1 - weight) + rgb2.b * weight;
  return rgbToHex(r, g, b);
}

/// Obtiene el color complementario (opuesto en la rueda cromática, 180°).
String complement(String hex) => adjustHue(hex, 180);

/// Invierte un color (negativo fotográfico).
///
/// ```dart
/// invert('#000000'); // '#ffffff'
/// ```
String invert(String hex) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return hex;
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}
