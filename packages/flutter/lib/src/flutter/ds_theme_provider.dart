/// Provider de tema para Flutter (equivalente a ThemeProvider + useTheme).
library;

import 'package:ds_yoandry_core/ds_yoandry_core.dart';
import 'package:flutter/material.dart';

import 'ds_theme_controller.dart';
import 'ds_theme_data.dart';
import 'palettes.dart';

/// Envuelve la app y expone el tema a todo el árbol de widgets.
///
/// Crea y gestiona un [DsThemeController] internamente. Los widgets
/// descendientes acceden al tema con [DsTheme.of] o [DsTheme.watch].
///
/// ```dart
/// void main() {
///   runApp(
///     DsThemeProvider(
///       defaultMode: DsThemeMode.system,
///       defaultPalette: PaletteName.ocean,
///       child: const MyApp(),
///     ),
///   );
/// }
/// ```
class DsThemeProvider extends StatefulWidget {
  const DsThemeProvider({
    super.key,
    required this.child,
    this.defaultMode = DsThemeMode.system,
    this.defaultPalette = PaletteName.defaultPalette,
    this.palette,
    this.storageKey = 'ds_theme',
    this.paletteStorageKey = 'ds_palette',
    this.persist = true,
    this.controller,
  });

  final Widget child;

  /// Modo inicial (ignorado si se provee [controller]).
  final DsThemeMode defaultMode;

  /// Paleta inicial por nombre (ignorada si se provee [palette] o [controller]).
  final PaletteName defaultPalette;

  /// Paleta personalizada. Si se provee, ignora [defaultPalette] y el selector.
  final BrandPalette? palette;

  final String storageKey;
  final String paletteStorageKey;

  /// Si `false`, no persiste preferencias en SharedPreferences.
  final bool persist;

  /// Controller externo opcional (para casos avanzados / testing).
  final DsThemeController? controller;

  @override
  State<DsThemeProvider> createState() => _DsThemeProviderState();
}

class _DsThemeProviderState extends State<DsThemeProvider> {
  late final DsThemeController _controller;
  late final bool _ownsController;

  @override
  void initState() {
    super.initState();
    _ownsController = widget.controller == null;
    _controller = widget.controller ??
        DsThemeController(
          initialMode: widget.defaultMode,
          initialPalette: widget.defaultPalette,
          customPalette: widget.palette,
          storageKey: widget.storageKey,
          paletteStorageKey: widget.paletteStorageKey,
          persist: widget.persist,
        );
  }

  @override
  void dispose() {
    if (_ownsController) _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _DsThemeScope(
      controller: _controller,
      child: widget.child,
    );
  }
}

/// InheritedNotifier interno que propaga los cambios del controller.
class _DsThemeScope extends InheritedNotifier<DsThemeController> {
  const _DsThemeScope({
    required DsThemeController controller,
    required super.child,
  }) : super(notifier: controller);
}

/// Punto de acceso al tema desde cualquier widget descendiente.
///
/// - [DsTheme.of] → datos resueltos ([DsThemeData]), se re-construye al cambiar.
/// - [DsTheme.controller] → el [DsThemeController] para acciones (toggle, etc.).
/// - [DsTheme.watch] → alias de [of].
///
/// ```dart
/// final theme = DsTheme.of(context);
/// final controller = DsTheme.controller(context);
///
/// ElevatedButton(
///   onPressed: controller.toggleTheme,
///   style: ElevatedButton.styleFrom(backgroundColor: theme.primary),
///   child: Text('Cambiar', style: TextStyle(color: theme.onPrimary)),
/// );
/// ```
abstract final class DsTheme {
  /// Obtiene los datos de tema resueltos y suscribe el widget a los cambios.
  static DsThemeData of(BuildContext context) {
    return controller(context).theme;
  }

  /// Alias de [of].
  static DsThemeData watch(BuildContext context) => of(context);

  /// Obtiene el [DsThemeController] y suscribe el widget a los cambios.
  static DsThemeController controller(BuildContext context) {
    final scope =
        context.dependOnInheritedWidgetOfExactType<_DsThemeScope>();
    assert(scope?.notifier != null, _noProviderError);
    return scope!.notifier!;
  }

  /// Obtiene el controller sin suscribirse (para llamar acciones en callbacks).
  static DsThemeController read(BuildContext context) {
    final scope = context
        .getElementForInheritedWidgetOfExactType<_DsThemeScope>()
        ?.widget as _DsThemeScope?;
    assert(scope?.notifier != null, _noProviderError);
    return scope!.notifier!;
  }

  static const String _noProviderError =
      '[DsTheme] No se encontró un DsThemeProvider en el árbol.\n\n'
      'Envuelve tu app:\n\n'
      'runApp(DsThemeProvider(child: MyApp()));';
}
