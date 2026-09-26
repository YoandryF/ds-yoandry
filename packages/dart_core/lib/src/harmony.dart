/// Generador de paletas armónicas con colores bloqueados (port de harmony.ts).
///
/// Genera paletas de colores cromáticamente armónicas respetando
/// colores "bloqueados" (colores de marca que no deben cambiar).
///
/// ```dart
/// final suggestions = suggestHarmonicPalette(
///   locked: LockedColors(primary: '#4357AD'),
///   strategy: HarmonyStrategy.analogous,
/// );
/// // suggestions[0] = paleta completa con el primary bloqueado
/// ```
library;

import 'types.dart';
import 'converters.dart';
import 'manipulators.dart';
import 'accessibility.dart';

// =============================================================================
// TIPOS
// =============================================================================

/// Estrategias de armonía cromática basadas en la rueda de colores.
enum HarmonyStrategy {
  /// Colores adyacentes (±30°) — paletas suaves y coherentes
  analogous,

  /// Colores opuestos (180°) — alto contraste visual
  complementary,

  /// Tres colores equidistantes (120°) — balance vibrante
  triadic,

  /// Complementario dividido (150° + 210°) — menos agresivo
  splitComplementary,

  /// Cuatro colores en cuadrado (90°) — paletas complejas
  tetradic,

  /// Detecta la mejor estrategia según los colores bloqueados
  auto,
}

/// Colores que el usuario quiere mantener fijos (de marca).
class LockedColors {
  final String? primary;
  final String? secondary;
  final String? background;
  final String? warning;
  final String? danger;
  final String? success;

  const LockedColors({
    this.primary,
    this.secondary,
    this.background,
    this.warning,
    this.danger,
    this.success,
  });

  /// Retorna true si al menos un color está bloqueado.
  bool get hasAny =>
      primary != null ||
      secondary != null ||
      background != null ||
      warning != null ||
      danger != null ||
      success != null;

  /// Lista de todos los colores bloqueados (no nulos).
  List<String> get allColors =>
      [primary, secondary, background, warning, danger, success]
          .whereType<String>()
          .toList();
}

/// Una sugerencia de paleta armónica con métricas de calidad.
class HarmonicSuggestion {
  final String primary;
  final String secondary;
  final String background;
  final String warning;
  final String danger;
  final String success;

  /// Puntuación de armonía (0-100). Mayor = más armónico
  final int harmonyScore;

  /// Puntuación de contraste (0-100). Mayor = mejor accesibilidad
  final int contrastScore;

  /// Puntuación combinada (0-100)
  final int score;

  /// ¿Todos los colores de texto pasan WCAG AA?
  final bool accessibilityPass;

  /// Estrategia usada para generar esta sugerencia
  final HarmonyStrategy strategy;

  const HarmonicSuggestion({
    required this.primary,
    required this.secondary,
    required this.background,
    required this.warning,
    required this.danger,
    required this.success,
    required this.harmonyScore,
    required this.contrastScore,
    required this.score,
    required this.accessibilityPass,
    required this.strategy,
  });
}

/// Opciones para el generador de paletas armónicas.
class SuggestHarmonicPaletteOptions {
  /// Colores bloqueados (al menos 1 requerido)
  final LockedColors locked;

  /// Estrategia de armonía. Default: auto
  final HarmonyStrategy strategy;

  /// Número de sugerencias a generar. Default: 3
  final int count;

  /// Filtrar solo paletas que pasen WCAG AA. Default: true
  final bool ensureAccessibility;

  /// Luminosidad objetivo para el background (0-100). Default: 90
  final double backgroundLightness;

  const SuggestHarmonicPaletteOptions({
    required this.locked,
    this.strategy = HarmonyStrategy.auto,
    this.count = 3,
    this.ensureAccessibility = true,
    this.backgroundLightness = 90,
  });
}

// =============================================================================
// CONSTANTES
// =============================================================================

/// Ángulos de la rueda cromática para cada estrategia.
const Map<HarmonyStrategy, List<int>> _harmonyAngles = {
  HarmonyStrategy.analogous: [-30, 30],
  HarmonyStrategy.complementary: [180],
  HarmonyStrategy.triadic: [120, 240],
  HarmonyStrategy.splitComplementary: [150, 210],
  HarmonyStrategy.tetradic: [90, 180, 270],
};

/// Hue ranges para colores semánticos (aproximados).
const Map<String, Map<String, int>> _semanticHueRanges = {
  'warning': {'min': 30, 'max': 60},
  'danger': {'min': 0, 'max': 30},
  'success': {'min': 90, 'max': 160},
};

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

/// Obtiene el HSL de un color hex.
HSL? _getHsl(String hex) {
  final rgb = hexToRgb(hex);
  if (rgb == null) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

/// Convierte HSL a hex.
String _hslToHex(double h, double s, double l) {
  final rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/// Normaliza el hue a rango 0-360.
double _normalizeHue(double h) => ((h % 360) + 360) % 360;

/// Calcula la distancia angular entre dos hues (0-180).
double _hueDistance(double h1, double h2) {
  final diff = (_normalizeHue(h1) - _normalizeHue(h2)).abs();
  return diff < 180 ? diff : 360 - diff;
}

/// Genera un color con un hue específico.
String _generateColorAtHue(
  double targetHue,
  double baseSaturation,
  double baseLightness,
) {
  final h = _normalizeHue(targetHue);
  final s = baseSaturation.clamp(40.0, 75.0);
  final l = baseLightness.clamp(35.0, 55.0);
  return _hslToHex(h, s, l);
}

/// Genera un color de background a partir de un color base.
String _generateBackground(String baseColor, double targetLightness) {
  final hsl = _getHsl(baseColor);
  if (hsl == null) return '#E4DFDA';

  final s = (hsl.s * 0.3).clamp(0.0, 20.0);
  return _hslToHex(hsl.h, s, targetLightness);
}

/// Genera un color semántico (warning/danger/success).
String _generateSemanticColor(
  String type,
  double baseHue,
  double baseSaturation,
) {
  final range = _semanticHueRanges[type]!;

  double targetHue;
  if (type == 'danger') {
    final distToLow = _hueDistance(baseHue, 15);
    final distToHigh = _hueDistance(baseHue, 345);
    targetHue = distToLow < distToHigh ? 15 : 350;
  } else {
    targetHue = (range['min']! + range['max']!) / 2;
  }

  final saturation = baseSaturation.clamp(50.0, 70.0);
  final lightness = type == 'warning' ? 55.0 : 45.0;

  return _hslToHex(targetHue, saturation, lightness);
}

/// Ajusta un color para mejorar su contraste si es necesario.
String _adjustForContrast(String color, String background) {
  final ratio = getContrastRatio(color, background);
  if (ratio >= 3) return color;

  final hsl = _getHsl(color);
  if (hsl == null) return color;

  final bgHsl = _getHsl(background);
  if (bgHsl == null) return color;

  final targetLightness = bgHsl.l > 50
      ? (hsl.l - 15).clamp(25.0, 100.0)
      : (hsl.l + 15).clamp(0.0, 75.0);

  return _hslToHex(hsl.h, hsl.s, targetLightness);
}

/// Calcula el score de armonía de una paleta (0-100).
int _calculateHarmonyScore(String primary, String secondary) {
  final hues = <double>[];

  for (final color in [primary, secondary]) {
    final hsl = _getHsl(color);
    if (hsl != null) hues.add(hsl.h);
  }

  if (hues.length < 2) return 50;

  final distance = _hueDistance(hues[0], hues[1]);
  const harmonicAngles = [30.0, 60.0, 90.0, 120.0, 150.0, 180.0];

  var minDeviation = 180.0;
  for (final angle in harmonicAngles) {
    final deviation = (distance - angle).abs();
    if (deviation < minDeviation) minDeviation = deviation;
  }

  return (100 - (minDeviation * 2)).clamp(0, 100).round();
}

/// Calcula el score de contraste/accesibilidad de una paleta (0-100).
int _calculateContrastScore({
  required String primary,
  required String secondary,
  required String background,
  required String danger,
  required String warning,
  required String success,
}) {
  var totalScore = 0.0;
  var checks = 0;

  for (final color in [primary, secondary, danger, warning, success]) {
    final ratio = getContrastRatio(color, background);
    totalScore += (ratio / 7 * 100).clamp(0.0, 100.0);
    checks++;
  }

  for (final color in [primary, secondary, danger]) {
    final whiteRatio = getContrastRatio('#FFFFFF', color);
    final blackRatio = getContrastRatio('#1A1A1A', color);
    final bestRatio = whiteRatio > blackRatio ? whiteRatio : blackRatio;
    totalScore += (bestRatio / 7 * 100).clamp(0.0, 100.0);
    checks++;
  }

  return (totalScore / checks).round();
}

/// Verifica si todos los colores de texto pasan WCAG AA.
bool _checkAccessibility({
  required String primary,
  required String secondary,
  required String danger,
}) {
  for (final color in [primary, secondary, danger]) {
    final whiteRatio = getContrastRatio('#FFFFFF', color);
    final blackRatio = getContrastRatio('#1A1A1A', color);
    final best = whiteRatio > blackRatio ? whiteRatio : blackRatio;
    if (best < 4.5) return false;
  }
  return true;
}

/// Deriva el color base de cualquier color bloqueado disponible.
({String color, HSL hsl})? _deriveBaseColor(LockedColors locked) {
  if (locked.primary != null) {
    final hsl = _getHsl(locked.primary!);
    if (hsl != null) return (color: locked.primary!, hsl: hsl);
  }

  if (locked.secondary != null) {
    final hsl = _getHsl(locked.secondary!);
    if (hsl != null) return (color: locked.secondary!, hsl: hsl);
  }

  if (locked.background != null) {
    final bgHsl = _getHsl(locked.background!);
    if (bgHsl != null) {
      final h = bgHsl.h;
      final s = (bgHsl.s + 30).clamp(50.0, 100.0);
      const l = 45.0;
      final color = _hslToHex(h, s, l);
      return (color: color, hsl: HSL(h: h, s: s, l: l));
    }
  }

  final anyColor = locked.warning ?? locked.danger ?? locked.success;
  if (anyColor != null) {
    final hsl = _getHsl(anyColor);
    if (hsl != null) return (color: anyColor, hsl: hsl);
  }

  return null;
}

/// Genera paletas usando una estrategia específica.
List<_RawPalette> _generateWithStrategy(
  LockedColors locked,
  HarmonyStrategy strategy,
  double backgroundLightness,
  int variations,
) {
  final results = <_RawPalette>[];

  final baseInfo = _deriveBaseColor(locked);
  if (baseInfo == null) return results;

  final baseHsl = baseInfo.hsl;
  final angles = _harmonyAngles[strategy]!;

  for (var v = 0; v < variations; v++) {
    final rotationOffset = v * 12.0;

    // Primary
    String primary;
    if (locked.primary != null) {
      primary = locked.primary!;
    } else {
      primary = _generateColorAtHue(
        baseHsl.h + rotationOffset,
        baseHsl.s,
        baseHsl.l,
      );
    }

    // Secondary
    final primaryHsl = _getHsl(primary) ?? baseHsl;
    String secondary;
    if (locked.secondary != null) {
      secondary = locked.secondary!;
    } else {
      secondary = _generateColorAtHue(
        primaryHsl.h + angles[0] + rotationOffset,
        primaryHsl.s,
        primaryHsl.l,
      );
    }

    // Background
    final background =
        locked.background ?? _generateBackground(primary, backgroundLightness);

    // Semantic colors
    final warning =
        locked.warning ?? _generateSemanticColor('warning', primaryHsl.h, primaryHsl.s);
    final danger =
        locked.danger ?? _generateSemanticColor('danger', primaryHsl.h, primaryHsl.s);
    final success =
        locked.success ?? _generateSemanticColor('success', primaryHsl.h, primaryHsl.s);

    // Adjust for contrast
    final adjustedPrimary =
        locked.primary != null ? primary : _adjustForContrast(primary, background);
    final adjustedSecondary =
        locked.secondary != null ? secondary : _adjustForContrast(secondary, background);

    results.add(_RawPalette(
      primary: adjustedPrimary,
      secondary: adjustedSecondary,
      background: background,
      warning: warning,
      danger: danger,
      success: success,
    ));
  }

  return results;
}

/// Paleta interna sin scoring.
class _RawPalette {
  final String primary;
  final String secondary;
  final String background;
  final String warning;
  final String danger;
  final String success;

  const _RawPalette({
    required this.primary,
    required this.secondary,
    required this.background,
    required this.warning,
    required this.danger,
    required this.success,
  });
}

// =============================================================================
// FUNCIONES PÚBLICAS
// =============================================================================

/// Genera sugerencias de paletas armónicas respetando colores bloqueados.
///
/// Lanza [ArgumentError] si no hay al menos un color bloqueado.
/// Lanza [ArgumentError] si algún color bloqueado no es un hexadecimal válido.
///
/// ```dart
/// // Con un solo color bloqueado
/// final suggestions = suggestHarmonicPalette(
///   locked: LockedColors(primary: '#4357AD'),
/// );
///
/// // Con estrategia específica
/// final suggestions = suggestHarmonicPalette(
///   locked: LockedColors(primary: '#4357AD', secondary: '#48A9A6'),
///   strategy: HarmonyStrategy.complementary,
///   count: 5,
/// );
/// ```
List<HarmonicSuggestion> suggestHarmonicPalette({
  required LockedColors locked,
  HarmonyStrategy strategy = HarmonyStrategy.auto,
  int count = 3,
  bool ensureAccessibility = true,
  double backgroundLightness = 90,
}) {
  // Validar que hay al menos un color bloqueado
  if (!locked.hasAny) {
    throw ArgumentError(
      '[Harmony] Se requiere al menos un color bloqueado. '
      'Proporciona primary, secondary, background, warning, danger o success.',
    );
  }

  // Validar formato de colores bloqueados
  final colorMap = {
    'primary': locked.primary,
    'secondary': locked.secondary,
    'background': locked.background,
    'warning': locked.warning,
    'danger': locked.danger,
    'success': locked.success,
  };

  for (final entry in colorMap.entries) {
    if (entry.value != null && _getHsl(entry.value!) == null) {
      throw ArgumentError(
        "[Harmony] Color bloqueado inválido: ${entry.key}='${entry.value}'. "
        "Usa formato hexadecimal de 6 dígitos (ej: '#4357AD').",
      );
    }
  }

  // Determinar estrategia(s) a usar
  final strategiesToTry = strategy == HarmonyStrategy.auto
      ? [
          HarmonyStrategy.analogous,
          HarmonyStrategy.complementary,
          HarmonyStrategy.triadic,
          HarmonyStrategy.splitComplementary,
          HarmonyStrategy.tetradic,
        ]
      : [strategy];

  // Generar paletas candidatas
  final candidates = <HarmonicSuggestion>[];

  for (final strat in strategiesToTry) {
    final variations =
        strategy == HarmonyStrategy.auto ? 2 : (count / strategiesToTry.length).ceil() + 1;

    final palettes =
        _generateWithStrategy(locked, strat, backgroundLightness, variations);

    for (final palette in palettes) {
      final harmonyScore = _calculateHarmonyScore(palette.primary, palette.secondary);
      final contrastScore = _calculateContrastScore(
        primary: palette.primary,
        secondary: palette.secondary,
        background: palette.background,
        danger: palette.danger,
        warning: palette.warning,
        success: palette.success,
      );
      final accessibilityPass = _checkAccessibility(
        primary: palette.primary,
        secondary: palette.secondary,
        danger: palette.danger,
      );

      if (ensureAccessibility && !accessibilityPass) continue;

      final score = (harmonyScore * 0.6 + contrastScore * 0.4).round();

      candidates.add(HarmonicSuggestion(
        primary: palette.primary,
        secondary: palette.secondary,
        background: palette.background,
        warning: palette.warning,
        danger: palette.danger,
        success: palette.success,
        harmonyScore: harmonyScore,
        contrastScore: contrastScore,
        score: score,
        accessibilityPass: accessibilityPass,
        strategy: strat,
      ));
    }
  }

  // Ordenar por score descendente
  candidates.sort((a, b) => b.score.compareTo(a.score));

  // Eliminar duplicados
  final unique = <HarmonicSuggestion>[];
  final seen = <String>{};

  for (final candidate in candidates) {
    final key = '${candidate.primary}-${candidate.secondary}';
    if (!seen.contains(key)) {
      seen.add(key);
      unique.add(candidate);
    }
    if (unique.length >= count) break;
  }

  return unique;
}

/// Genera colores armónicos a partir de un color base usando una estrategia específica.
///
/// ```dart
/// final colors = getHarmonicColors('#4357AD', HarmonyStrategy.triadic);
/// // ['#4357AD', '#57AD43', '#AD4357'] (aproximado)
/// ```
List<String> getHarmonicColors(String baseColor, HarmonyStrategy strategy) {
  if (strategy == HarmonyStrategy.auto) {
    throw ArgumentError('getHarmonicColors no soporta strategy=auto');
  }

  final hsl = _getHsl(baseColor);
  if (hsl == null) return [baseColor];

  final angles = _harmonyAngles[strategy]!;
  final colors = [baseColor];

  for (final angle in angles) {
    colors.add(adjustHue(baseColor, angle.toDouble()));
  }

  return colors;
}

/// Detecta qué estrategia de armonía se aproxima más a un conjunto de colores existente.
///
/// ```dart
/// final result = detectHarmonyStrategy(['#4357AD', '#AD5743']);
/// // (strategy: HarmonyStrategy.complementary, confidence: 92)
/// ```
({HarmonyStrategy strategy, int confidence}) detectHarmonyStrategy(
    List<String> colors) {
  if (colors.length < 2) {
    return (strategy: HarmonyStrategy.analogous, confidence: 0);
  }

  final hues = <double>[];
  for (final color in colors) {
    final hsl = _getHsl(color);
    if (hsl != null) hues.add(hsl.h);
  }

  if (hues.length < 2) {
    return (strategy: HarmonyStrategy.analogous, confidence: 0);
  }

  final angle = _hueDistance(hues[0], hues[1]);

  final strategyAngles = <(HarmonyStrategy, double)>[
    (HarmonyStrategy.analogous, 30),
    (HarmonyStrategy.complementary, 180),
    (HarmonyStrategy.triadic, 120),
    (HarmonyStrategy.splitComplementary, 150),
    (HarmonyStrategy.tetradic, 90),
  ];

  var bestStrategy = HarmonyStrategy.analogous;
  var bestDeviation = 180.0;

  for (final (strat, targetAngle) in strategyAngles) {
    final deviation = (angle - targetAngle).abs();
    if (deviation < bestDeviation) {
      bestDeviation = deviation;
      bestStrategy = strat;
    }
  }

  final confidence = (100 - (bestDeviation * 2)).clamp(0, 100).round();

  return (strategy: bestStrategy, confidence: confidence);
}
