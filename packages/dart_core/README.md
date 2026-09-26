# ds_yoandry_core 🎨

> Motor del Design System — **Dart puro, sin dependencias**. Genera colores, escalas, variantes y accesibilidad **WCAG AA** a partir de una paleta de 5-6 colores.

[![pub.dev](https://img.shields.io/pub/v/ds_yoandry_core?color=4357AD)](https://pub.dev/packages/ds_yoandry_core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)

Port 1:1 de [`@ds-yoandry/core`](../core/README.md) (JS/TS). Es agnóstico de framework: funciona en **Flutter**, backends Dart (**Shelf, Dart Frog, Serverpod**), **CLIs** o cualquier proyecto Dart. No arrastra el SDK de Flutter.

> ¿Usas Flutter? Instala [`ds_yoandry_flutter`](../flutter/README.md), que incluye este core + theming, Provider y colores nativos `Color`.

---

## Instalación

```yaml
# pubspec.yaml
dependencies:
  ds_yoandry_core: ^4.4.0

# o desde Git
dependencies:
  ds_yoandry_core:
    git:
      url: https://github.com/YoandryF/ds-yoandry.git
      path: packages/dart_core
```

Requiere Dart SDK >= 3.0. Sin dependencias externas.

---

## Uso básico

```dart
import 'package:ds_yoandry_core/ds_yoandry_core.dart';

final system = createDesignSystem(const BrandPalette(
  primary: '#4357AD',
  secondary: '#48A9A6',
  background: '#E4DFDA',
  warning: '#D4B483',
  danger: '#C1666B',
  // success es opcional — se genera como #22C55E si no se provee
));

// Usar los colores generados
system.colors.variants.primary.main;      // '#4357ad'
system.colors.variants.primary.light;     // para hover
system.colors.text.onPrimary;             // '#FFFFFF' (WCAG AA)
system.colors.gray[500];                  // gris medio
system.colors.dark.background;            // fondo modo oscuro
```

---

## Qué genera `createDesignSystem`

| Sección | Contenido |
|---------|-----------|
| `colors.brand` | La paleta original + `success` |
| `colors.gray` | Escala 50-900 (estilo Tailwind) |
| `colors.variants` | `light` / `main` / `dark` / `disabled` por color |
| `colors.text` | Colores de texto con contraste WCAG AA |
| `colors.surface` | Superficies modo claro |
| `colors.dark` | Superficies modo oscuro |
| `colors.alpha` | Escalas de opacidad (rgba strings) |
| `platform.shadow` | Sombras none/sm/md/lg/xl |
| `platform.feedback` | Ripple / highlight por color |

### Variantes de color

```dart
system.colors.variants.primary.light     // +15% luminosidad — hover
system.colors.variants.primary.main      // Color original — normal
system.colors.variants.primary.dark      // -12% luminosidad — pressed
system.colors.variants.primary.disabled  // Mezclado con bg — disabled
```

### Escala de grises

```dart
system.colors.gray[50]   // L=97% — casi blanco
system.colors.gray[100]  // L=94% — fondos hover
system.colors.gray[500]  // L=50% — disabled
system.colors.gray[900]  // L=10% — texto principal
```

### Colores de texto (WCAG AA)

```dart
system.colors.text.primary      // gray[900]
system.colors.text.secondary    // gray[700]
system.colors.text.onPrimary    // Blanco o negro según contraste
system.colors.text.onDanger     // Automático
```

---

## 🎨 Armonía de colores

Genera paletas completas a partir de uno o más colores "bloqueados" (colores de marca que no deben cambiar).

### `suggestHarmonicPalette()`

```dart
import 'package:ds_yoandry_core/ds_yoandry_core.dart';

// Caso básico: tienes tu color de marca, necesitas el resto
final suggestions = suggestHarmonicPalette(
  locked: LockedColors(primary: '#4357AD'),
);

// suggestions[0] = HarmonicSuggestion(
//   primary: '#4357AD',        // bloqueado
//   secondary: '#AD9143',      // generado armónicamente
//   background: '#E8E6F0',     // generado
//   warning: '#B38B4D',
//   danger: '#B34D5A',
//   success: '#4DAD57',
//   score: 85,                 // puntuación combinada
//   harmonyScore: 88,          // qué tan armónica es
//   contrastScore: 80,         // qué tan accesible
//   accessibilityPass: true,   // ✓ pasa WCAG AA
//   strategy: HarmonyStrategy.analogous,
// )

// Usa la sugerencia directamente
final system = createDesignSystem(suggestions[0].toBrandPalette());
```

### Opciones de configuración

```dart
final suggestions = suggestHarmonicPalette(
  // Colores que ya tienes y no quieres cambiar
  locked: LockedColors(
    primary: '#4357AD',
    secondary: '#48A9A6',  // puedes bloquear múltiples
  ),
  
  // Estrategia de armonía (default: auto)
  strategy: HarmonyStrategy.triadic,
  
  // Cuántas sugerencias devolver (default: 3)
  count: 5,
  
  // Filtrar las que no pasan WCAG AA (default: true)
  ensureAccessibility: true,
  
  // Luminosidad del background generado (default: 90)
  backgroundLightness: 95,
);
```

### Estrategias de armonía

| Estrategia | Ángulos | Cuándo usarla |
|------------|---------|---------------|
| `analogous` | ±30° | Paletas suaves y cohesivas |
| `complementary` | 180° | Alto contraste visual |
| `triadic` | 120° | Balance vibrante |
| `splitComplementary` | 150° + 210° | Complementario menos agresivo |
| `tetradic` | 90° | Paletas complejas |
| `auto` | — | Prueba todas y elige las mejores (default) |

### `getHarmonicColors()`

Versión simple para obtener solo los colores:

```dart
final colors = getHarmonicColors('#4357AD', HarmonyStrategy.triadic);
// ['#4357AD', '#57AD43', '#AD4357']

final pair = getHarmonicColors('#FF0000', HarmonyStrategy.complementary);
// ['#FF0000', '#00FFFF']
```

### `detectHarmonyStrategy()`

Detecta qué estrategia usa una paleta existente:

```dart
final result = detectHarmonyStrategy(['#4357AD', '#AD5743']);
// (strategy: HarmonyStrategy.complementary, confidence: 92)
```

---

## Utilidades de color

### Conversiones

```dart
hexToRgb('#4357AD');       // RGB(r: 67, g: 87, b: 173)
rgbToHex(67, 87, 173);     // '#4357ad'
hexToRgba('#4357AD', 0.5); // 'rgba(67, 87, 173, 0.5)'
rgbToHsl(67, 87, 173);     // HSL(h: ~228, s: ~44, l: ~47)
hslToRgb(228, 44, 47);     // RGB(...)
```

### Manipulación

```dart
lighten('#4357AD', 20);              // 20% más claro
darken('#4357AD', 15);               // 15% más oscuro
saturate('#4357AD', 20);             // 20% más vibrante
desaturate('#4357AD', 30);           // 30% más apagado
mix('#4357AD', '#FFFFFF', 0.3);      // 70% azul, 30% blanco
complement('#4357AD');               // Color opuesto (180°)
invert('#4357AD');                   // '#bca852'
adjustHue('#4357AD', 60);            // Rotar 60° en la rueda
```

### Accesibilidad WCAG 2.1

```dart
getContrastRatio('#4357AD', '#FFFFFF');        // ~5.5
meetsContrastAA('#4357AD', '#FFFFFF');         // true  (>= 4.5)
meetsContrastAAA('#4357AD', '#FFFFFF');        // false (< 7)
getContrastColor('#4357AD');                   // '#FFFFFF'
ensureContrast('#888888', '#FFFFFF');          // Gris ajustado a 4.5:1
findBestContrast('#4357AD', ['#FFF', '#000']); // BestContrast(color: '#FFF', ratio: 5.5)
```

### Generadores

```dart
generateGrayScale('#E4DFDA');                  // {50: '...', ..., 900: '...'}
generateColorVariants('#4357AD', '#E4DFDA');   // ColorVariants(light, main, dark, disabled)
generateAlphaScale('#000000');                 // {5: 'rgba(...)', ..., 90: 'rgba(...)'}
```

### Validación

```dart
isValidHex('#4357AD');   // true
isValidHex('4357AD');    // true (acepta sin #)
isValidHex('#GGG');      // false
normalizeHex('4357AD');  // '#4357AD'
```

---

## Paleta por defecto

```dart
import 'package:ds_yoandry_core/ds_yoandry_core.dart';

// kDefaultPalette = BrandPalette(
//   primary:    '#4357AD',  — Ocean Twilight
//   secondary:  '#48A9A6',  — Tropical Teal
//   background: '#E4DFDA',  — Dust Grey
//   warning:    '#D4B483',  — Soft Fawn
//   danger:     '#C1666B',  — Lobster Pink
//   success:    '#22C55E',  — Emerald
// )

final system = createDesignSystem(kDefaultPalette.copyWith(
  primary: '#FF6B35',  // solo cambia lo que necesites
));
```

---

## Caché

Los sistemas se memorizan automáticamente por paleta:

```dart
getCacheStats();           // CacheStats(size: 2, keys: [...])
clearDesignSystemCache();  // Limpia toda la caché

// Forzar regeneración
createDesignSystem(palette, skipCache: true);
```

---

## Paridad con JS

Este paquete mantiene **paridad exacta** con `@ds-yoandry/core`. El test `test/parity_test.dart` verifica que las salidas sean idénticas usando fixtures generados desde el build de producción de JS.

```bash
# Regenerar fixtures (desde la raíz del monorepo)
pnpm parity

# O manualmente
cd packages/dart_core
node tool/generate_parity_fixtures.js
dart test test/parity_test.dart
```

---

## Tests

```bash
cd packages/dart_core
dart test

# 74 tests:
# - converters
# - manipulators  
# - accessibility
# - generators
# - createDesignSystem
# - harmony
# - parity (37 tests vs JS)
```

---

## Ver también

- **[@ds-yoandry/core](../core/README.md)** — Motor original en JS/TS
- **[ds_yoandry_flutter](../flutter/README.md)** — Provider + `Color` nativos para Flutter

---

## Licencia

MIT © [Yoandry](https://github.com/YoandryF)
