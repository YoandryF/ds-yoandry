/// Utilidades de sombras y feedback (port de platform.ts).
///
/// En React Native el binding aplicaba `Platform.select()`. En Flutter estos
/// valores se consumen directamente y la capa de theming los convierte a
/// [BoxShadow] / [InkWell] cuando corresponde.
library;

import 'converters.dart';
import 'types.dart';

ShadowStyle _shadow(
  double opacity,
  double radius,
  double offsetY,
  String color,
) {
  return ShadowStyle(
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffsetX: 0,
    shadowOffsetY: offsetY,
    shadowColor: color,
    // Elevación equivalente a Material (coincide con el binding Android original).
    elevation: offsetY == 0 && opacity == 0 ? 0 : radius,
  );
}

/// Genera las sombras predefinidas (none/sm/md/lg/xl) con [shadowColor].
PlatformShadows generatePlatformShadows(String shadowColor) {
  return PlatformShadows(
    none: ShadowStyle(
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: shadowColor,
      elevation: 0,
    ),
    sm: _shadow(0.1, 2, 1, shadowColor),
    md: _shadow(0.15, 4, 2, shadowColor),
    lg: _shadow(0.2, 8, 4, shadowColor),
    xl: _shadow(0.25, 16, 8, shadowColor),
  );
}

/// Genera configuración de feedback táctil (ripple/highlight) para un color.
PlatformFeedback generatePlatformFeedback(String color) {
  return PlatformFeedback(
    ripple: RippleConfig(
      color: hexToRgba(color, 0.2),
      borderless: false,
    ),
    highlight: HighlightConfig(
      underlayColor: hexToRgba(color, 0.1),
    ),
  );
}
