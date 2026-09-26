/// Controller de tema con persistencia (equivalente al estado de ThemeProvider).
library;

import 'package:ds_yoandry_core/ds_yoandry_core.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'ds_theme_data.dart';
import 'palettes.dart';

/// Modo de tema: claro, oscuro o siguiendo el sistema.
enum DsThemeMode { light, dark, system }

/// Controla el estado del tema (modo + paleta) y notifica a los widgets.
///
/// Persiste las preferencias en [SharedPreferences]. Detecta la preferencia
/// del sistema vía [WidgetsBinding.platformDispatcher].
///
/// Normalmente no se instancia directo: se usa a través de [DsThemeProvider].
class DsThemeController extends ChangeNotifier with WidgetsBindingObserver {
  DsThemeController({
    DsThemeMode initialMode = DsThemeMode.system,
    PaletteName initialPalette = PaletteName.defaultPalette,
    BrandPalette? customPalette,
    this.storageKey = 'ds_theme',
    this.paletteStorageKey = 'ds_palette',
    bool persist = true,
  })  : _mode = initialMode,
        _paletteName = initialPalette,
        _customPalette = customPalette,
        _persist = persist {
    WidgetsBinding.instance.addObserver(this);
    _rebuild();
    if (_persist) _loadPreferences();
  }

  final String storageKey;
  final String paletteStorageKey;
  final bool _persist;

  DsThemeMode _mode;
  PaletteName _paletteName;
  final BrandPalette? _customPalette;

  late DesignSystem _designSystem;
  SharedPreferences? _prefs;

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  /// Modo actual: light / dark / system.
  DsThemeMode get mode => _mode;

  /// Nombre de la paleta activa.
  PaletteName get paletteName => _paletteName;

  /// El [DesignSystem] completo de la paleta activa.
  DesignSystem get designSystem => _designSystem;

  /// `true` si el modo resuelto es oscuro.
  bool get isDark {
    if (_mode == DsThemeMode.system) {
      final brightness =
          WidgetsBinding.instance.platformDispatcher.platformBrightness;
      return brightness == Brightness.dark;
    }
    return _mode == DsThemeMode.dark;
  }

  /// Datos de tema resueltos (API plana con [Color] nativos).
  DsThemeData get theme => DsThemeData(designSystem: _designSystem, isDark: isDark);

  /// Lista de paletas disponibles con metadatos.
  List<PaletteInfo> get availablePalettes => kAvailablePalettes;

  // ---------------------------------------------------------------------------
  // ACCIONES
  // ---------------------------------------------------------------------------

  /// Cambia el modo de tema y persiste la preferencia.
  Future<void> setMode(DsThemeMode mode) async {
    if (_mode == mode) return;
    _mode = mode;
    notifyListeners();
    await _save(storageKey, mode.name);
  }

  /// Alterna entre claro y oscuro (respecto al estado resuelto actual).
  Future<void> toggleTheme() =>
      setMode(isDark ? DsThemeMode.light : DsThemeMode.dark);

  /// Cambia la paleta activa por nombre y persiste la preferencia.
  ///
  /// Ignorado si se está usando una paleta personalizada ([customPalette]).
  Future<void> setPalette(PaletteName name) async {
    if (_customPalette != null || _paletteName == name) return;
    _paletteName = name;
    _rebuild();
    notifyListeners();
    await _save(paletteStorageKey, name.name);
  }

  // ---------------------------------------------------------------------------
  // INTERNO
  // ---------------------------------------------------------------------------

  void _rebuild() {
    final palette = _customPalette ?? kPalettes[_paletteName]!;
    _designSystem = createDesignSystem(palette);
  }

  Future<void> _loadPreferences() async {
    try {
      _prefs = await SharedPreferences.getInstance();
      final savedMode = _prefs?.getString(storageKey);
      final savedPalette = _prefs?.getString(paletteStorageKey);

      var changed = false;
      if (savedMode != null) {
        for (final m in DsThemeMode.values) {
          if (m.name == savedMode) {
            _mode = m;
            changed = true;
            break;
          }
        }
      }
      if (_customPalette == null && savedPalette != null) {
        final parsed = paletteNameFromString(savedPalette);
        if (parsed != null) {
          _paletteName = parsed;
          _rebuild();
          changed = true;
        }
      }
      if (changed) notifyListeners();
    } catch (_) {
      // Continuar con valores por defecto.
    }
  }

  Future<void> _save(String key, String value) async {
    if (!_persist) return;
    try {
      _prefs ??= await SharedPreferences.getInstance();
      await _prefs?.setString(key, value);
    } catch (_) {
      // Silent — no bloquear la UI por fallo de persistencia.
    }
  }

  // Redibuja si cambia el brightness del sistema (modo 'system').
  @override
  void didChangePlatformBrightness() {
    if (_mode == DsThemeMode.system) notifyListeners();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }
}
