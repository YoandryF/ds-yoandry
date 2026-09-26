/// Design System de Yoandry para Flutter.
///
/// Capa de theming (Provider, modo claro/oscuro, persistencia) construida sobre
/// [`ds_yoandry_core`](https://pub.dev/packages/ds_yoandry_core), el motor de
/// colores en Dart puro. Este paquete re-exporta todo el core, así que con un
/// solo import tienes el motor + los widgets de Flutter.
///
/// ```dart
/// import 'package:ds_yoandry_flutter/ds_yoandry_flutter.dart';
///
/// void main() {
///   runApp(DsThemeProvider(child: const MyApp()));
/// }
///
/// class MyCard extends StatelessWidget {
///   @override
///   Widget build(BuildContext context) {
///     final t = DsTheme.of(context);
///     return Container(
///       decoration: BoxDecoration(color: t.surface, boxShadow: t.shadowMd),
///       child: Text('Hola', style: TextStyle(color: t.text)),
///     );
///   }
/// }
/// ```
library ds_yoandry_flutter;

// =============================================================================
// CORE — re-exportado desde el paquete Dart puro
// =============================================================================

export 'package:ds_yoandry_core/ds_yoandry_core.dart';

// =============================================================================
// FLUTTER — capa de theming (Color nativo, Provider, persistencia)
// =============================================================================

export 'src/flutter/color_utils.dart';
export 'src/flutter/palettes.dart';
export 'src/flutter/ds_theme_data.dart';
export 'src/flutter/ds_theme_controller.dart';
export 'src/flutter/ds_theme_provider.dart';
export 'src/flutter/palette_selector.dart';
