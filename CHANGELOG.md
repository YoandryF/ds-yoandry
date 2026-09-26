# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).
Versiones siguiendo [Semantic Versioning](https://semver.org/lang/es/).

---

## [4.4.0] — 2026-09-25

### 🎯 Soporte para Flutter / Dart

Se añaden dos paquetes que llevan el Design System al ecosistema Dart,
manteniendo **paridad exacta** con el motor JS de producción.

### Agregado

#### `ds_yoandry_core` (Dart puro)
- Port 1:1 del motor de `@ds-yoandry/core` a Dart, **sin dependencia de Flutter**
- Usable en Flutter, backends Dart (Shelf / Dart Frog / Serverpod), CLIs, etc.
- `createDesignSystem(palette, {skipCache})` y `DEFAULT_PALETTE` (`kDefaultPalette`)
- Todas las utilidades: conversores, manipuladores, accesibilidad, generadores,
  validadores, caché
- **Test de paridad** (`test/parity_test.dart`) que compara las salidas contra
  fixtures generados desde el build de producción del core JS
  (`tool/generate_parity_fixtures.js`) — cero divergencias
- 108 tests (unitarios + paridad)

#### `ds_yoandry_flutter`
- Capa de theming idiomática construida sobre `ds_yoandry_core`
- `DsThemeProvider` (InheritedNotifier) + `DsTheme.of(context)` — equivalente a
  `ThemeProvider` / `useTheme()` de React
- `DsThemeController` (ChangeNotifier) con modo claro/oscuro/sistema
- `DsThemeData` con API plana que expone `Color` nativos ya resueltos por modo,
  `List<BoxShadow>` para sombras y `toMaterialTheme()` para integrar con Material
- Persistencia con `shared_preferences` (equivalente a AsyncStorage)
- 4 paletas predefinidas + `DsPaletteSelector`
- Re-exporta todo `ds_yoandry_core`

### Notas
- Se omitieron `supportsColorMix` / `mixWithNative` del core (son específicos de
  CSS del navegador y no aplican a Dart/Flutter).

---

## [4.2.0] — 2026-09-06

### 🎉 Primera versión pública del monorepo

Esta versión transforma el sistema de diseño de un módulo local a una librería NPM con arquitectura monorepo.

### Packages publicados

- **`@ds-yoandry/core`** — Motor agnóstico de framework
- **`@ds-yoandry/react`** — Hook + Provider para React / React Native
- **`@ds-yoandry/angular`** — Service + Signals para Angular 20+

### Agregado

#### `@ds-yoandry/core`
- `createDesignSystem(palette, options?)` — Genera el sistema completo desde una paleta
- `DEFAULT_PALETTE` — Paleta Coolors.co lista para usar
- Escala de grises uniforme (50–900) basada en luminosidad absoluta
- Variantes de color automáticas: light, main, dark, disabled
- Colores de texto con contraste WCAG AA garantizado (búsqueda binaria O log n)
- Colores de superficie para modo claro y oscuro
- Escalas de opacidad (alpha) para overlays
- Conversiones: `hexToRgb`, `rgbToHex`, `hexToRgba`, `rgbToHsl`, `hslToRgb`
- Manipuladores: `lighten`, `darken`, `saturate`, `desaturate`, `mix`, `complement`, `invert`, `adjustHue`
- Accesibilidad: `getContrastRatio`, `meetsContrastAA`, `meetsContrastAAA`, `ensureContrast`, `findBestContrast`
- Generadores de escala: `generateGrayScale`, `generateColorVariants`, `generateAlphaScale`
- Caché por paleta con `clearDesignSystemCache()` y `getCacheStats()`
- Validadores: `isValidHex`, `normalizeHex`
- 83 tests unitarios

#### `@ds-yoandry/react`
- `ThemeProvider` — Context provider con detección del sistema
- `useTheme()` — Hook con API de colores plana (sin navegación profunda)
- `useColors()` — Hook minimalista de colores
- `useShadow()` — Hook de sombras
- `useIsDark()` — Hook de estado dark/light
- Persistencia de tema en `AsyncStorage`
- Re-render reactivo al cambiar tema o preferencia del sistema
- Re-exporta todo `@ds-yoandry/core`

#### `@ds-yoandry/angular`
- `ThemeService` con Signals (compatible con Zone-less)
- `injectTheme()` — Función helper de inyección
- `provideDesignSystem(palette?)` — Provider funcional
- `ThemeDirective` — Directiva `appTheme` para bindings declarativos
- `ThemeColorPipe` — Pipe `themeColor` para templates
- CSS custom properties automáticas en `:root`
- Clases `ds-dark` / `ds-light` en `body`
- Compatible con SSR via `isPlatformBrowser`
- Re-exporta todo `@ds-yoandry/core`

### Infraestructura
- Monorepo con pnpm workspaces + Turborepo
- Build con tsup (CJS + ESM + tipos)
- TypeScript estricto en todos los packages

---

## [4.1.0] — 2026-09-06 _(versión local, no publicada)_

### Agregado
- Migración de archivos `.js` a TypeScript nativo
- Hook `useTheme()` con API simplificada
- `ThemeProvider` con persistencia en AsyncStorage
- Corrección de ciclos de dependencia (palette.js separado)
- Archivo `index.d.ts` para tipos TypeScript

---

## [4.0.0] — 2026-09-06 _(versión local, no publicada)_

### Agregado
- Sistema de diseño completo como módulo local
- `createDesignSystem()` a partir de paleta Coolors.co
- Soporte inicial para Platform.select() en React Native
- Gestor de temas (`createThemeManager`, `PRESET_THEMES`)

---

[4.4.0]: https://github.com/YoandryF/ds-yoandry/releases/tag/v4.4.0
[4.2.0]: https://github.com/YoandryF/ds-yoandry/releases/tag/v4.2.0
