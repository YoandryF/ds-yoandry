/// Funciones de conversión entre formatos de color (port de converters.ts).
library;

import 'types.dart';

final RegExp _hexRegExp =
    RegExp(r'^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$', caseSensitive: false);

/// Convierte un color hexadecimal a objeto [RGB].
///
/// Retorna `null` si el formato es inválido.
///
/// ```dart
/// hexToRgb('#4357AD'); // RGB(r: 67, g: 87, b: 173)
/// hexToRgb('invalid'); // null
/// ```
RGB? hexToRgb(String hex) {
  final match = _hexRegExp.firstMatch(hex);
  if (match == null) return null;
  return RGB(
    r: int.parse(match.group(1)!, radix: 16).toDouble(),
    g: int.parse(match.group(2)!, radix: 16).toDouble(),
    b: int.parse(match.group(3)!, radix: 16).toDouble(),
  );
}

/// Convierte valores RGB a color hexadecimal (con # al inicio).
///
/// Los valores se recortan al rango 0-255 y se redondean.
///
/// ```dart
/// rgbToHex(67, 87, 173); // '#4357ad'
/// ```
String rgbToHex(double r, double g, double b) {
  final buffer = StringBuffer('#');
  for (final x in <double>[r, g, b]) {
    final clamped = x.clamp(0.0, 255.0).round();
    final hex = clamped.toRadixString(16);
    buffer.write(hex.length == 1 ? '0$hex' : hex);
  }
  return buffer.toString();
}

/// Convierte un color hexadecimal a formato `rgba()` con opacidad.
///
/// ```dart
/// hexToRgba('#4357AD', 0.5); // 'rgba(67, 87, 173, 0.5)'
/// ```
String hexToRgba(String hex, double alpha) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return 'rgba(0, 0, 0, ${_num(alpha)})';
  return 'rgba(${_num(rgb.r)}, ${_num(rgb.g)}, ${_num(rgb.b)}, ${_num(alpha)})';
}

/// Convierte valores RGB a [HSL] con H(0-360), S(0-100), L(0-100).
///
/// ```dart
/// rgbToHsl(255, 0, 0); // HSL(h: 0, s: 100, l: 50)
/// ```
HSL rgbToHsl(double r, double g, double b) {
  r /= 255;
  g /= 255;
  b /= 255;
  final max = [r, g, b].reduce((a, v) => a > v ? a : v);
  final min = [r, g, b].reduce((a, v) => a < v ? a : v);
  double h = 0;
  double s = 0;
  final l = (max + min) / 2;

  if (max != min) {
    final d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max == r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max == g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  }

  return HSL(h: h * 360, s: s * 100, l: l * 100);
}

/// Convierte valores HSL a [RGB] (valores 0-255, sin redondear).
///
/// ```dart
/// hslToRgb(0, 100, 50); // RGB(r: 255, g: 0, b: 0)
/// ```
RGB hslToRgb(double h, double s, double l) {
  h /= 360;
  s /= 100;
  l /= 100;
  double r;
  double g;
  double b;

  if (s == 0) {
    r = g = b = l;
  } else {
    double hue2rgb(double p, double q, double t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    final q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    final p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return RGB(r: r * 255, g: g * 255, b: b * 255);
}

/// Formatea un número como lo haría JS: entero sin decimales, decimal con ellos.
String _num(double value) {
  if (value == value.roundToDouble()) return value.toInt().toString();
  return value.toString();
}
