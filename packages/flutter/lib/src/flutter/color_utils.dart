/// Utilidades para convertir los colores hex del core a [Color] de Flutter.
library;

import 'package:flutter/painting.dart';

/// Convierte un color hexadecimal (`#RRGGBB` o `RRGGBB`) a [Color].
///
/// ```dart
/// hexToColor('#4357AD'); // Color(0xFF4357AD)
/// ```
Color hexToColor(String hex) {
  var value = hex.replaceFirst('#', '').trim();
  if (value.length == 6) value = 'FF$value'; // Alpha opaco por defecto.
  final parsed = int.tryParse(value, radix: 16);
  if (parsed == null) return const Color(0xFF000000);
  return Color(parsed);
}

/// Convierte un string `rgba(r, g, b, a)` (formato del core) a [Color].
///
/// Útil para las escalas de opacidad (`alpha.black[50]`, etc.).
///
/// ```dart
/// rgbaToColor('rgba(0, 0, 0, 0.5)'); // Color con 50% de opacidad
/// ```
Color rgbaToColor(String rgba) {
  final match = RegExp(
    r'rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)',
  ).firstMatch(rgba);
  if (match == null) return const Color(0x00000000);
  final r = int.parse(match.group(1)!);
  final g = int.parse(match.group(2)!);
  final b = int.parse(match.group(3)!);
  final a = double.parse(match.group(4)!);
  return Color.fromRGBO(r, g, b, a);
}
