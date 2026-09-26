/// Generadores de escalas y variantes de colores (port de generators.ts).
library;

import 'dart:math' as math;

import 'converters.dart';
import 'manipulators.dart';
import 'types.dart';

/// Genera una escala completa de grises a partir de un color base.
///
/// Sigue la convención Tailwind (50-900) con luminosidades absolutas uniformes.
GrayScale generateGrayScale(String baseColor) {
  return GrayScale(
    shade50: setLightness(baseColor, 97), // Casi blanco - fondos sutiles
    shade100: setLightness(baseColor, 94), // Muy claro - fondos hover
    shade200: setLightness(baseColor, 86), // Claro - bordes sutiles
    shade300: setLightness(baseColor, 77), // Claro medio - bordes
    shade400: setLightness(baseColor, 64), // Medio claro - placeholder
    shade500: setLightness(baseColor, 50), // Medio - deshabilitado
    shade600: setLightness(baseColor, 40), // Medio oscuro - texto terciario
    shade700: setLightness(baseColor, 30), // Oscuro - texto secundario
    shade800: setLightness(baseColor, 20), // Muy oscuro - superficies dark
    shade900: setLightness(baseColor, 10), // Casi negro - texto principal
  );
}

/// Genera variantes de un color para estados de UI.
///
/// - light: 15% más claro (hover)
/// - main: color original (normal)
/// - dark: 12% más oscuro (pressed)
/// - disabled: mezclado con [background]
ColorVariants generateColorVariants(String color, String background) {
  return ColorVariants(
    light: lighten(color, 15),
    main: color,
    dark: darken(color, 12),
    disabled: mix(color, background, 0.6),
  );
}

/// Genera una escala de opacidades (5%-90%) en formato rgba().
AlphaScale generateAlphaScale(String hex) {
  return AlphaScale(
    a5: hexToRgba(hex, 0.05),
    a10: hexToRgba(hex, 0.1),
    a20: hexToRgba(hex, 0.2),
    a30: hexToRgba(hex, 0.3),
    a40: hexToRgba(hex, 0.4),
    a50: hexToRgba(hex, 0.5),
    a60: hexToRgba(hex, 0.6),
    a70: hexToRgba(hex, 0.7),
    a80: hexToRgba(hex, 0.8),
    a90: hexToRgba(hex, 0.9),
  );
}

/// Genera un color success complementario basado en el secondary de la paleta.
///
/// Garantiza saturación mínima 50%, luminosidad entre 35-50%.
/// Si el secundario ya es verdoso (hue 80-160), usa Emerald (`#22C55E`).
String generateSuccessColor(String secondary) {
  final rgb = hexToRgb(secondary);
  if (rgb == null) return '#22C55E';

  final hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  if (hsl.h >= 80 && hsl.h <= 160) return '#22C55E';

  const successH = 142.0;
  final successS = math.max(50.0, math.min(80.0, hsl.s + 15));
  final successL = math.max(35.0, math.min(50.0, hsl.l));

  final successRgb = hslToRgb(successH, successS, successL);
  var successColor = rgbToHex(successRgb.r, successRgb.g, successRgb.b);

  final finalHsl = rgbToHsl(successRgb.r, successRgb.g, successRgb.b);
  if (finalHsl.s < 50) {
    successColor = setSaturation(successColor, 55);
  }

  return successColor;
}
