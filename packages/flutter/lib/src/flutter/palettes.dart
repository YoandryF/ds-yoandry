/// Paletas predefinidas y metadatos (port de PALETTES/AVAILABLE_PALETTES).
library;

import 'package:ds_yoandry_core/ds_yoandry_core.dart';

/// Nombres de las paletas incluidas.
enum PaletteName { defaultPalette, ocean, forest, sunset }

/// Paletas de colores incluidas en el paquete.
const Map<PaletteName, BrandPalette> kPalettes = <PaletteName, BrandPalette>{
  PaletteName.defaultPalette: BrandPalette(
    primary: '#4357AD',
    secondary: '#48A9A6',
    background: '#E4DFDA',
    warning: '#D4B483',
    danger: '#C1666B',
    success: '#22C55E',
  ),
  PaletteName.ocean: BrandPalette(
    primary: '#0077B6',
    secondary: '#00B4D8',
    background: '#CAF0F8',
    warning: '#FFB703',
    danger: '#E63946',
    success: '#06D6A0',
  ),
  PaletteName.forest: BrandPalette(
    primary: '#2D6A4F',
    secondary: '#40916C',
    background: '#F0F4F0',
    warning: '#E9C46A',
    danger: '#BC4749',
    success: '#52B788',
  ),
  PaletteName.sunset: BrandPalette(
    primary: '#FF6B35',
    secondary: '#F7C59F',
    background: '#FFFAF5',
    warning: '#FFD166',
    danger: '#EF476F',
    success: '#06D6A0',
  ),
};

/// Metadatos de una paleta para construir selectores en la UI.
class PaletteInfo {
  const PaletteInfo({
    required this.name,
    required this.label,
    required this.swatch,
  });

  /// Identificador de la paleta.
  final PaletteName name;

  /// Etiqueta legible para mostrar al usuario.
  final String label;

  /// Color representativo (el primary) en formato hex.
  final String swatch;
}

/// Lista de paletas disponibles con metadatos.
const List<PaletteInfo> kAvailablePalettes = <PaletteInfo>[
  PaletteInfo(name: PaletteName.defaultPalette, label: 'Clásico', swatch: '#4357AD'),
  PaletteInfo(name: PaletteName.ocean, label: 'Océano', swatch: '#0077B6'),
  PaletteInfo(name: PaletteName.forest, label: 'Bosque', swatch: '#2D6A4F'),
  PaletteInfo(name: PaletteName.sunset, label: 'Atardecer', swatch: '#FF6B35'),
];

/// Convierte un [PaletteName] a su clave string (para persistencia).
String paletteNameToString(PaletteName name) => name.name;

/// Parsea una clave string a [PaletteName], o null si no existe.
PaletteName? paletteNameFromString(String value) {
  for (final n in PaletteName.values) {
    if (n.name == value) return n;
  }
  return null;
}
