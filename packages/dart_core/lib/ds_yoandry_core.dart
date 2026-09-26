/// Motor del Design System de Yoandry — Dart puro, sin dependencias.
///
/// Genera colores, escalas, variantes y accesibilidad WCAG AA a partir de una
/// paleta de 5-6 colores. Agnóstico de framework: puede usarse en Flutter,
/// backends Dart (Shelf, Dart Frog, Serverpod), CLIs o cualquier proyecto Dart.
///
/// ```dart
/// import 'package:ds_yoandry_core/ds_yoandry_core.dart';
///
/// final system = createDesignSystem(const BrandPalette(
///   primary: '#4357AD',
///   secondary: '#48A9A6',
///   background: '#E4DFDA',
///   warning: '#D4B483',
///   danger: '#C1666B',
/// ));
///
/// system.colors.variants.primary.main; // '#4357ad'
/// system.colors.text.onPrimary;        // '#FFFFFF' (WCAG AA)
/// system.colors.gray[500];             // Gris medio
/// ```
library ds_yoandry_core;

export 'src/types.dart';
export 'src/converters.dart';
export 'src/manipulators.dart';
export 'src/accessibility.dart';
export 'src/generators.dart';
export 'src/validators.dart';
export 'src/platform.dart';
export 'src/palette.dart';
export 'src/cache.dart';
export 'src/create_design_system.dart';
