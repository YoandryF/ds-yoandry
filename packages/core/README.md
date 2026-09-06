# @ds-yoandry/core

[![npm](https://img.shields.io/npm/v/@ds-yoandry/core?color=4357AD)](https://www.npmjs.com/package/@ds-yoandry/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)

> Motor del Design System — agnóstico de framework, sin dependencias externas.

---

## Instalación

```bash
npm install @ds-yoandry/core
# o
pnpm add @ds-yoandry/core
# o
yarn add @ds-yoandry/core
```

---

## Uso básico

```typescript
import { createDesignSystem } from '@ds-yoandry/core';

const system = createDesignSystem({
    primary:    '#4357AD',
    secondary:  '#48A9A6',
    background: '#E4DFDA',
    warning:    '#D4B483',
    danger:     '#C1666B',
    // success es opcional — se genera automáticamente
});
```

---

## API de `createDesignSystem()`

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `palette` | `BrandPalette` | ✅ | Paleta de 5-6 colores |
| `options.skipCache` | `boolean` | — | Forzar regeneración sin caché |

### Retorno — `DesignSystem`

```typescript
system.colors.brand          // Los colores originales + success
system.colors.gray           // Escala 50-900
system.colors.variants       // Estados de UI por color
system.colors.text           // Colores semánticos de texto
system.colors.surface        // Superficies modo claro
system.colors.dark           // Superficies modo oscuro
system.colors.alpha          // Escalas de opacidad
system.platform.shadow       // Sombras none/sm/md/lg/xl
system.platform.feedback     // Ripple/highlight por plataforma
```

---

## Colores generados

### `colors.variants`

Para cada color de la paleta (primary, secondary, danger, warning, success):

```typescript
system.colors.variants.primary.light     // 15% más claro — hover
system.colors.variants.primary.main      // Color original — normal
system.colors.variants.primary.dark      // 12% más oscuro — pressed
system.colors.variants.primary.disabled  // Mezclado con bg — disabled
```

### `colors.gray`

Escala uniforme derivada del color `background` de la paleta:

```typescript
system.colors.gray[50]   // L=97% — casi blanco, fondos sutiles
system.colors.gray[100]  // L=94% — fondos hover
system.colors.gray[200]  // L=86% — bordes sutiles
system.colors.gray[300]  // L=77% — bordes
system.colors.gray[400]  // L=64% — placeholder
system.colors.gray[500]  // L=50% — disabled
system.colors.gray[600]  // L=40% — texto terciario
system.colors.gray[700]  // L=30% — texto secundario
system.colors.gray[800]  // L=20% — superficies dark
system.colors.gray[900]  // L=10% — texto principal
```

### `colors.text`

Todos garantizan contraste **WCAG AA** (4.5:1 mínimo):

```typescript
system.colors.text.primary      // gray[900] — texto principal
system.colors.text.secondary    // gray[700] — descripciones
system.colors.text.tertiary     // gray[600] — placeholders
system.colors.text.disabled     // gray[500] — deshabilitado
system.colors.text.onPrimary    // Blanco o negro — sobre primary
system.colors.text.onSecondary  // Blanco o negro — sobre secondary
system.colors.text.onDanger     // Blanco o negro — sobre danger
system.colors.text.onWarning    // Blanco o negro — sobre warning
system.colors.text.onSuccess    // Blanco o negro — sobre success
```

### `colors.surface` (modo claro)

```typescript
system.colors.surface.background   // El background de tu paleta
system.colors.surface.surface      // gray[50] — cards, modales
system.colors.surface.surfaceHover // gray[100] — hover
system.colors.surface.surfaceActive// gray[200] — pressed
system.colors.surface.elevated     // #FFFFFF — dropdowns, tooltips
```

### `colors.dark` (modo oscuro)

```typescript
system.colors.dark.background    // gray[900]
system.colors.dark.surface       // gray[800]
system.colors.dark.surfaceHover  // gray[700]
system.colors.dark.surfaceActive // gray[600]
system.colors.dark.elevated      // gray[700]
system.colors.dark.textPrimary   // gray[50]
system.colors.dark.textSecondary // gray[300]
system.colors.dark.textTertiary  // gray[400]
system.colors.dark.divider       // gray[700]
```

### `colors.alpha`

Escalas de opacidad para overlays:

```typescript
system.colors.alpha.black[50]    // 'rgba(0, 0, 0, 0.5)'
system.colors.alpha.white[20]    // 'rgba(255, 255, 255, 0.2)'
system.colors.alpha.primary[10]  // 'rgba(67, 87, 173, 0.1)'
// Disponibles: 5, 10, 20, 30, 40, 50, 60, 70, 80, 90
```

---

## Utilidades de color

### Conversiones

```typescript
import { hexToRgb, rgbToHex, hexToRgba, rgbToHsl, hslToRgb } from '@ds-yoandry/core';

hexToRgb('#4357AD')           // { r: 67, g: 87, b: 173 }
rgbToHex(67, 87, 173)         // '#4357ad'
hexToRgba('#4357AD', 0.5)     // 'rgba(67, 87, 173, 0.5)'
rgbToHsl(67, 87, 173)         // { h: 228.67, s: 44.16, l: 47.06 }
hslToRgb(228, 44, 47)         // { r: 67, g: 87, b: 172 }
```

### Manipulación

```typescript
import { lighten, darken, saturate, desaturate, mix, complement, invert } from '@ds-yoandry/core';

lighten('#4357AD', 20)              // Más claro
darken('#4357AD', 15)               // Más oscuro
saturate('#4357AD', 20)             // Más vibrante
desaturate('#4357AD', 30)           // Más apagado
mix('#4357AD', '#FFFFFF', 0.3)      // 70% azul, 30% blanco
complement('#4357AD')               // Color opuesto en la rueda
invert('#4357AD')                   // '#bca852'
```

### Accesibilidad WCAG 2.1

```typescript
import {
    getContrastRatio,
    meetsContrastAA,
    meetsContrastAAA,
    getContrastColor,
    ensureContrast,
    findBestContrast,
} from '@ds-yoandry/core';

getContrastRatio('#4357AD', '#FFFFFF')        // ~5.5
meetsContrastAA('#4357AD', '#FFFFFF')         // true  (>= 4.5)
meetsContrastAAA('#4357AD', '#FFFFFF')        // false (< 7)
getContrastColor('#4357AD')                   // '#FFFFFF'
ensureContrast('#888888', '#FFFFFF')          // Gris ajustado para cumplir 4.5:1
findBestContrast('#4357AD', ['#FFF', '#000']) // { color: '#FFF', ratio: 5.5 }
```

### Generadores

```typescript
import { generateGrayScale, generateColorVariants, generateAlphaScale } from '@ds-yoandry/core';

generateGrayScale('#E4DFDA')                    // { 50: '...', ..., 900: '...' }
generateColorVariants('#4357AD', '#E4DFDA')     // { light, main, dark, disabled }
generateAlphaScale('#000000')                   // { 5: 'rgba(...)', ..., 90: 'rgba(...)' }
```

### Validación

```typescript
import { isValidHex, normalizeHex } from '@ds-yoandry/core';

isValidHex('#4357AD')   // true
isValidHex('4357AD')    // true
isValidHex('#GGG')      // false
normalizeHex('4357AD')  // '#4357AD'
```

---

## Paleta por defecto

```typescript
import { DEFAULT_PALETTE } from '@ds-yoandry/core';

// {
//     primary:    '#4357AD'  — Ocean Twilight
//     secondary:  '#48A9A6'  — Tropical Teal
//     background: '#E4DFDA'  — Dust Grey
//     warning:    '#D4B483'  — Soft Fawn
//     danger:     '#C1666B'  — Lobster Pink
//     success:    '#22C55E'  — Emerald
// }

const system = createDesignSystem({
    ...DEFAULT_PALETTE,
    primary: '#FF6B35',  // Solo cambia lo que necesites
});
```

---

## Caché

Los sistemas de diseño se memorizan automáticamente por paleta. Llamar `createDesignSystem` con la misma paleta retorna el mismo objeto sin recalcular.

```typescript
import { getCacheStats, clearDesignSystemCache } from '@ds-yoandry/core';

getCacheStats()           // { size: 2, keys: ['...', '...'] }
clearDesignSystemCache()  // Limpia toda la caché
```

---

## TypeScript

Todos los tipos están incluidos sin instalación adicional:

```typescript
import type {
    BrandPalette,
    DesignSystem,
    ColorVariants,
    GrayScale,
    TextColors,
    SurfaceColors,
    PlatformShadows,
} from '@ds-yoandry/core';
```

---

## Tests

```bash
cd packages/core
pnpm test
# 83 tests — converters, accessibility, createDesignSystem
```
