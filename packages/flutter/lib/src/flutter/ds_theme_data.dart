/// API plana de colores resueltos para el modo actual (equivalente a `useTheme()`).
library;

import 'package:ds_yoandry_core/ds_yoandry_core.dart';
import 'package:flutter/material.dart';

import 'color_utils.dart';

/// Datos de tema resueltos: expone los colores más usados directamente como
/// [Color] nativos de Flutter, ya adaptados al modo claro u oscuro.
///
/// Equivalente al objeto que retorna `useTheme()` en la versión React.
///
/// ```dart
/// final theme = DsTheme.of(context);
/// Container(color: theme.bg, child: Text('Hola', style: TextStyle(color: theme.text)));
/// ```
class DsThemeData {
  DsThemeData({required this.designSystem, required this.isDark})
      : _c = designSystem.colors;

  /// El [DesignSystem] completo generado por `createDesignSystem`.
  final DesignSystem designSystem;

  /// `true` si el modo activo es oscuro.
  final bool isDark;

  final DesignSystemColors _c;

  // ---------------------------------------------------------------------------
  // FONDOS
  // ---------------------------------------------------------------------------

  /// Fondo principal de la app.
  Color get bg => hexToColor(isDark ? _c.dark.background : _c.surface.background);

  /// Surface para cards y modales.
  Color get surface => hexToColor(isDark ? _c.dark.surface : _c.surface.surface);

  /// Surface elevada (dropdowns, tooltips).
  Color get surfaceElevated =>
      hexToColor(isDark ? _c.dark.elevated : _c.surface.elevated);

  /// Surface en estado hover.
  Color get surfaceHover =>
      hexToColor(isDark ? _c.dark.surfaceHover : _c.surface.surfaceHover);

  // ---------------------------------------------------------------------------
  // TEXTO
  // ---------------------------------------------------------------------------

  /// Texto principal.
  Color get text => hexToColor(isDark ? _c.dark.textPrimary : _c.text.primary);

  /// Texto secundario.
  Color get textSecondary =>
      hexToColor(isDark ? _c.dark.textSecondary : _c.text.secondary);

  /// Texto terciario / placeholder.
  Color get textMuted =>
      hexToColor(isDark ? _c.dark.textTertiary : _c.text.tertiary);

  /// Texto deshabilitado.
  Color get textDisabled => hexToColor(_c.text.disabled);

  // ---------------------------------------------------------------------------
  // COLORES DE MARCA
  // ---------------------------------------------------------------------------

  Color get primary => hexToColor(_c.variants.primary.main);
  Color get primaryLight => hexToColor(_c.variants.primary.light);
  Color get primaryDark => hexToColor(_c.variants.primary.dark);

  Color get secondary => hexToColor(_c.variants.secondary.main);
  Color get secondaryLight => hexToColor(_c.variants.secondary.light);

  Color get danger => hexToColor(_c.variants.danger.main);
  Color get dangerLight => hexToColor(_c.variants.danger.light);

  Color get success => hexToColor(_c.variants.success.main);
  Color get successLight => hexToColor(_c.variants.success.light);

  Color get warning => hexToColor(_c.variants.warning.main);
  Color get warningLight => hexToColor(_c.variants.warning.light);

  // ---------------------------------------------------------------------------
  // TEXTO SOBRE COLORES (para botones)
  // ---------------------------------------------------------------------------

  Color get onPrimary => hexToColor(_c.text.onPrimary);
  Color get onSecondary => hexToColor(_c.text.onSecondary);
  Color get onDanger => hexToColor(_c.text.onDanger);
  Color get onSuccess => hexToColor(_c.text.onSuccess);
  Color get onWarning => hexToColor(_c.text.onWarning);

  // ---------------------------------------------------------------------------
  // UTILIDADES
  // ---------------------------------------------------------------------------

  /// Escala de grises como [Color]. Usa `theme.gray(500)`.
  Color gray(int shade) => hexToColor(_c.gray[shade]);

  /// Color para bordes sutiles.
  Color get border => hexToColor(_c.gray[200]);

  /// Color para bordes más pronunciados.
  Color get borderDark => hexToColor(_c.gray[300]);

  /// Color para líneas divisoras (adapta a dark/light).
  Color get divider => hexToColor(isDark ? _c.gray[700] : _c.gray[200]);

  // ---------------------------------------------------------------------------
  // SOMBRAS (listas para usar en BoxDecoration)
  // ---------------------------------------------------------------------------

  /// Sombra pequeña como lista de [BoxShadow].
  List<BoxShadow> get shadowSm => _boxShadow(designSystem.platform.shadow.sm);

  /// Sombra media.
  List<BoxShadow> get shadowMd => _boxShadow(designSystem.platform.shadow.md);

  /// Sombra grande.
  List<BoxShadow> get shadowLg => _boxShadow(designSystem.platform.shadow.lg);

  /// Sombra extra grande.
  List<BoxShadow> get shadowXl => _boxShadow(designSystem.platform.shadow.xl);

  List<BoxShadow> _boxShadow(ShadowStyle s) {
    final opacity = s.shadowOpacity ?? 0;
    if (opacity == 0) return const <BoxShadow>[];
    final color = hexToColor(s.shadowColor ?? '#000000').withOpacity(opacity);
    return <BoxShadow>[
      BoxShadow(
        color: color,
        blurRadius: s.shadowRadius ?? 0,
        offset: Offset(s.shadowOffsetX ?? 0, s.shadowOffsetY ?? 0),
      ),
    ];
  }

  // ---------------------------------------------------------------------------
  // INTEROP CON MATERIAL
  // ---------------------------------------------------------------------------

  /// Genera un [ThemeData] de Material listo para `MaterialApp(theme: ...)`.
  ThemeData toMaterialTheme() {
    final brightness = isDark ? Brightness.dark : Brightness.light;
    return ThemeData(
      brightness: brightness,
      useMaterial3: true,
      scaffoldBackgroundColor: bg,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        brightness: brightness,
        primary: primary,
        secondary: secondary,
        error: danger,
        surface: surface,
      ),
      dividerColor: divider,
    );
  }
}
