/// Función principal para crear el sistema de diseño (port de createDesignSystem.ts).
library;

import 'accessibility.dart';
import 'cache.dart';
import 'generators.dart';
import 'platform.dart';
import 'types.dart';
import 'validators.dart';

/// Genera un sistema de diseño completo a partir de una paleta de 5-6 colores.
///
/// Genera automáticamente:
/// - Escala de grises uniforme (50-900)
/// - Variantes de cada color (light, main, dark, disabled)
/// - Colores de texto con contraste WCAG AA garantizado
/// - Colores de superficie para modo claro y oscuro
/// - Escalas de opacidad para overlays
/// - Color success automático si no se provee
/// - Utilidades de sombras y feedback
///
/// Los resultados se cachean por paleta. Usa [skipCache] para forzar la
/// regeneración.
///
/// Lanza [ArgumentError] si faltan colores requeridos o alguno es inválido.
///
/// ```dart
/// final system = createDesignSystem(BrandPalette(
///   primary: '#4357AD',
///   secondary: '#48A9A6',
///   background: '#E4DFDA',
///   warning: '#D4B483',
///   danger: '#C1666B',
/// ));
/// ```
DesignSystem createDesignSystem(
  BrandPalette palette, {
  bool skipCache = false,
}) {
  // Normalizar colores (solo entradas no nulas).
  final normalized = <String, String>{};
  palette.toMap().forEach((key, value) {
    if (value.isNotEmpty) normalized[key] = normalizeHex(value);
  });

  // Verificar caché.
  final cacheKey = generateCacheKey(normalized);
  if (!skipCache && designSystemCache.containsKey(cacheKey)) {
    return designSystemCache[cacheKey]!;
  }

  // Validar colores requeridos.
  const requiredColors = ['primary', 'secondary', 'background', 'warning', 'danger'];
  final missing = requiredColors.where((c) => !normalized.containsKey(c)).toList();
  if (missing.isNotEmpty) {
    throw ArgumentError(
      '[DesignSystem] Faltan colores requeridos: ${missing.join(', ')}. '
      'La paleta debe incluir: ${requiredColors.join(', ')}.',
    );
  }

  // Validar formato hex.
  final allKeys = [...requiredColors, 'success'].where(normalized.containsKey);
  final invalid = allKeys.where((c) => !isValidHex(normalized[c])).toList();
  if (invalid.isNotEmpty) {
    throw ArgumentError(
      '[DesignSystem] Colores con formato inválido: ${invalid.join(', ')}. '
      "Usa formato hexadecimal de 6 dígitos (ej: '#4357AD').",
    );
  }

  final primary = normalized['primary']!;
  final secondary = normalized['secondary']!;
  final background = normalized['background']!;
  final warning = normalized['warning']!;
  final danger = normalized['danger']!;

  // Generar success si no se provee.
  final successColor = normalized['success'] ?? generateSuccessColor(secondary);

  // Escala de grises.
  final gray = generateGrayScale(background);

  // Helper de texto accesible.
  String textOnColor(String bgColor) =>
      ensureContrast(getContrastColor(bgColor), bgColor, 4.5);

  final designSystem = DesignSystem(
    colors: DesignSystemColors(
      brand: FullPalette(
        primary: primary,
        secondary: secondary,
        background: background,
        warning: warning,
        danger: danger,
        success: successColor,
      ),
      gray: gray,
      variants: BrandVariants(
        primary: generateColorVariants(primary, background),
        secondary: generateColorVariants(secondary, background),
        danger: generateColorVariants(danger, background),
        warning: generateColorVariants(warning, background),
        success: generateColorVariants(successColor, background),
      ),
      text: TextColors(
        primary: gray[900],
        secondary: gray[700],
        tertiary: gray[600],
        disabled: gray[500],
        onPrimary: textOnColor(primary),
        onSecondary: textOnColor(secondary),
        onDanger: textOnColor(danger),
        onWarning: textOnColor(warning),
        onSuccess: textOnColor(successColor),
      ),
      surface: SurfaceColors(
        background: background,
        surface: gray[50],
        surfaceHover: gray[100],
        surfaceActive: gray[200],
        elevated: '#FFFFFF',
      ),
      dark: DarkModeColors(
        background: gray[900],
        surface: gray[800],
        surfaceHover: gray[700],
        surfaceActive: gray[600],
        elevated: gray[700],
        textPrimary: gray[50],
        textSecondary: gray[300],
        textTertiary: gray[400],
        divider: gray[700],
      ),
      alpha: AlphaColors(
        black: generateAlphaScale('#000000'),
        white: generateAlphaScale('#FFFFFF'),
        primary: generateAlphaScale(primary),
      ),
    ),
    platform: PlatformSpecific(
      shadow: generatePlatformShadows('#000000'),
      feedback: FeedbackColors(
        primary: generatePlatformFeedback(primary),
        secondary: generatePlatformFeedback(secondary),
        danger: generatePlatformFeedback(danger),
      ),
    ),
  );

  designSystemCache[cacheKey] = designSystem;
  return designSystem;
}
