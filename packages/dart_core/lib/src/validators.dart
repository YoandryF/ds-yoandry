/// Funciones de validación y normalización de colores (port de validators.ts).
library;

final RegExp _validHexRegExp =
    RegExp(r'^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$', caseSensitive: false);

/// Valida que un string sea un color hexadecimal válido de 6 dígitos.
///
/// ```dart
/// isValidHex('#4357AD'); // true
/// isValidHex('4357AD');  // true
/// isValidHex('#435');    // false (formato corto no soportado)
/// ```
bool isValidHex(String? hex) {
  if (hex == null || hex.isEmpty) return false;
  return _validHexRegExp.hasMatch(hex);
}

/// Normaliza un color hexadecimal al formato `#RRGGBB` (asegura el `#`).
///
/// ```dart
/// normalizeHex('4357AD');  // '#4357AD'
/// normalizeHex('#4357AD'); // '#4357AD'
/// ```
String normalizeHex(String hex) {
  if (hex.isEmpty) return hex;
  return hex.startsWith('#') ? hex : '#$hex';
}
