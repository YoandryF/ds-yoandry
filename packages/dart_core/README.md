# ds_yoandry_core 🎨

> Motor del Design System de Yoandry — **Dart puro, sin dependencias**. Genera colores, escalas, variantes y accesibilidad **WCAG AA** a partir de una paleta de 5-6 colores.

Port del core de [`@yoandryf/core`](../core/README.md). Es agnóstico de framework: funciona en **Flutter**, backends Dart (**Shelf, Dart Frog, Serverpod**), **CLIs** o cualquier proyecto Dart. No arrastra el SDK de Flutter, por lo que ninguna funcionalidad queda atada a una versión específica de Flutter.

> ¿Usas Flutter? Instala [`ds_yoandry_flutter`](../flutter/README.md), que incluye este core + theming, Provider y colores nativos.

---

## Instalación

Elige según cómo distribuyas el paquete:

### Desde Git

```yaml
dependencies:
  ds_yoandry_core:
    git:
      url: https://github.com/YoandryF/ds-yoandry.git
      path: packages/dart_core
```

### Path local

```yaml
dependencies:
  ds_yoandry_core:
    path: ../ruta/a/packages/dart_core
```

### pub.dev

```yaml
dependencies:
  ds_yoandry_core: ^4.4.0
```

Sin dependencias externas. Requiere Dart SDK >= 3.0. Funciona en Flutter,
backends Dart y CLIs por igual.

---

## Uso

```dart
import 'package:ds_yoandry_core/ds_yoandry_core.dart';

final system = createDesignSystem(const BrandPalette(
  primary: '#4357AD',
  secondary: '#48A9A6',
  background: '#E4DFDA',
  warning: '#D4B483',
  danger: '#C1666B',
  // success es opcional — se genera automáticamente
));

system.colors.variants.primary.main; // '#4357ad'
system.colors.text.onPrimary;         // '#FFFFFF' (WCAG AA garantizado)
system.colors.gray[500];              // Gris medio
system.colors.dark.background;        // Fondo modo oscuro
```

---

## Qué genera `createDesignSystem`

| Sección | Contenido |
|---------|-----------|
| `colors.brand` | La paleta original + `success` |
| `colors.gray` | Escala 50-900 (Tailwind-like) |
| `colors.variants` | `light` / `main` / `dark` / `disabled` por color |
| `colors.text` | Colores de texto con contraste WCAG AA |
| `colors.surface` | Superficies modo claro |
| `colors.dark` | Superficies modo oscuro |
| `colors.alpha` | Escalas de opacidad (rgba) |
| `platform.shadow` | Sombras none/sm/md/lg/xl |
| `platform.feedback` | Ripple / highlight por color |

---

## Utilidades de color

```dart
// Conversión
hexToRgb('#4357AD');       // RGB(r: 67, g: 87, b: 173)
rgbToHex(67, 87, 173);     // '#4357ad'
hexToRgba('#4357AD', 0.5); // 'rgba(67, 87, 173, 0.5)'
rgbToHsl(67, 87, 173);     // HSL(h: ~228, s: ~44, l: ~47)
hslToRgb(228, 44, 47);     // RGB(...)

// Manipulación
lighten('#4357AD', 20);
darken('#4357AD', 15);
saturate('#4357AD', 20);
desaturate('#4357AD', 30);
mix('#4357AD', '#FFFFFF', 0.3);
adjustHue('#FF0000', 120);
complement('#4357AD');
invert('#4357AD');

// Accesibilidad WCAG 2.1
getRelativeLuminance('#4357AD');
getContrastRatio('#4357AD', '#FFFFFF');    // ~5.5
meetsContrastAA('#4357AD', '#FFFFFF');      // true
meetsContrastAAA('#4357AD', '#FFFFFF');     // false
getContrastColor('#4357AD');                // '#FFFFFF'
ensureContrast('#888888', '#FFFFFF');       // Gris ajustado a 4.5:1
findBestContrast('#4357AD', ['#FFF', '#000']);

// Generadores
generateGrayScale('#E4DFDA');
generateColorVariants('#4357AD', '#E4DFDA');
generateAlphaScale('#000000');
generateSuccessColor('#48A9A6');

// Validación
isValidHex('#4357AD');   // true
normalizeHex('4357AD');  // '#4357AD'
```

---

## Armonía de colores 🎨

Genera paletas completas a partir de colores "bloqueados" (colores de marca que no deben cambiar).

```dart
// Con un solo color bloqueado
final suggestions = suggestHarmonicPalette(
  locked: LockedColors(primary: '#4357AD'),
);
// suggestions[0] = HarmonicSuggestion(
//     primary: '#4357AD',    // bloqueado
//     secondary: '#...',     // generado
//     background: '#...',
//     harmonyScore: 85,
//     contrastScore: 78,
//     score: 82,
//     accessibilityPass: true,
//     strategy: HarmonyStrategy.analogous,
// )

// Con estrategia específica
final vibrant = suggestHarmonicPalette(
  locked: LockedColors(primary: '#4357AD'),
  strategy: HarmonyStrategy.triadic,
  count: 5,
  ensureAccessibility: false,
  backgroundLightness: 95,
);

// Colores armónicos simples
final colors = getHarmonicColors('#4357AD', HarmonyStrategy.triadic);
// ['#4357AD', '#57AD43', '#AD4357']

// Detectar estrategia de una paleta existente
final result = detectHarmonyStrategy(['#4357AD', '#AD5743']);
// (strategy: HarmonyStrategy.complementary, confidence: 92)
```

### Estrategias disponibles

| Estrategia | Ángulos | Descripción |
|------------|---------|-------------|
| `analogous` | ±30° | Paletas suaves, coherentes |
| `complementary` | 180° | Alto contraste visual |
| `triadic` | 120° | Balance vibrante |
| `splitComplementary` | 150°, 210° | Complementario menos agresivo |
| `tetradic` | 90° cada | Paletas complejas |
| `auto` (default) | — | Prueba todas, devuelve las mejores |

---

## Caché

Los sistemas se memorizan por paleta. Llamar `createDesignSystem` con la misma paleta retorna el mismo objeto.

```dart
getCacheStats();          // CacheStats(size: 2, keys: [...])
clearDesignSystemCache(); // Limpia la caché
createDesignSystem(palette, skipCache: true); // Fuerza regeneración
```

---

## Tests

```bash
cd packages/dart_core
dart test   # 74 tests — converters, accessibility, createDesignSystem
```

---

## Licencia

MIT © [Yoandry](https://github.com/YoandryF)
