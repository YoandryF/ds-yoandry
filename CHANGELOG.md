# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).
Versiones siguiendo [Semantic Versioning](https://semver.org/lang/es/).

---

## [4.4.2] — 2026-09-26

### 🔧 CI/CD — Fixes acumulados

Correcciones al pipeline de GitHub Actions. Sin cambios en la API pública.

### Corregido

#### GitHub Actions

- **`pnpm/action-setup@v4`**: Eliminado conflicto de versión doble entre `version:` en el workflow y `packageManager` en `package.json`. La acción lee la versión exclusivamente desde `packageManager: pnpm@9.0.0`.
- **`actions/setup-node@v4`**: Eliminado `cache: 'pnpm'` integrado que fallaba al no tener pnpm en PATH en el momento de ejecución.
- **`pnpm-lock.yaml`**: Agregado al repositorio (estaba en `.gitignore` marcado como "excluido en librería pública"). Necesario para `pnpm install --frozen-lockfile` en CI.
- **Versiones de dependencias**: Sincronizados `@swc/core` y `lint-staged` entre `package.json` y el lockfile para eliminar `ERR_PNPM_OUTDATED_LOCKFILE`.
- **Filtro Turborepo**: Corregido `@ds-yoandry/core` → `@yoandryf/core` en el job `test-dart` y en el script `parity`.
- **`@yoandryf/react` tests**: Agregado `--passWithNoTests` a Jest (carpeta `__tests__/` vacía causaba exit code 1).

---

## [4.4.1] — 2025-01-XX

### 🚀 Optimizaciones de Developer Experience

Mejoras internas de tooling que no afectan la API pública.

### Cambiado

#### Performance de tests

- **Tests 3-5× más rápidos**: Migración de `ts-jest` a `@swc/jest` en el core.
  Tests que tardaban ~5s ahora corren en ~1.2s.

#### Watch mode optimizado

- **Rebuilds 2× más rápidos**: `tsup.config.ts` ahora usa `dts: !options.watch`,
  omitiendo la generación de `.d.ts` durante desarrollo (se generan en build final).

#### Turborepo optimizado

- Eliminada dependencia `test → build` innecesaria.
- Inputs granulares por tarea para mejor cache hit rate.

### Agregado

#### Script de paridad

- Nuevo script `pnpm parity` que ejecuta los 3 pasos de verificación
  JS↔Dart en un solo comando:
  1. Build del core JS
  2. Genera fixtures
  3. Corre tests de Dart

#### CI/CD

- GitHub Actions workflow (`.github/workflows/ci.yml`):
  - Job 1: Tests JS (pnpm test)
  - Job 2: Tests Dart + verificación de paridad

#### Pre-commit hooks

- Husky + lint-staged para validar código antes de commits.
- Requiere Git >= 2.32 para `core.hooksPath`.

---

## [4.4.0] — 2025-01-XX

### 🎨 Generador de paletas armónicas

Nueva funcionalidad para generar paletas de colores armónicas a partir de
colores "bloqueados" (colores de marca que no deben cambiar).

### Agregado

#### `@ds-yoandry/core` / `ds_yoandry_core`

- **`suggestHarmonicPalette()`**: Función principal que genera paletas completas.

  ```typescript
  const suggestions = suggestHarmonicPalette({
    locked: { primary: "#4357AD" },
    strategy: "triadic", // o 'auto'
    count: 3,
    ensureAccessibility: true,
  });
  // → Array de BrandPalette con scores de armonía
  ```

- **5 estrategias de armonía**:
  - `analogous` — colores adyacentes (±30°)
  - `complementary` — opuestos (180°)
  - `triadic` — tres equidistantes (120°)
  - `split-complementary` — 150° + 210°
  - `tetradic` — cuatro en cuadrado (90°)
  - `auto` — prueba todas y devuelve las mejores

- **`getHarmonicColors()`**: Versión simple que devuelve solo los colores hex.

  ```typescript
  getHarmonicColors("#FF0000", "triadic");
  // → ['#FF0000', '#00FF00', '#0000FF']
  ```

- **`detectHarmonyStrategy()`**: Detecta qué estrategia usa una paleta existente.

  ```typescript
  detectHarmonyStrategy(["#4357AD", "#AD5743"]);
  // → { strategy: 'complementary', confidence: 92 }
  ```

- **Sistema de scoring**:
  - 60% armonía (distancia angular a la estrategia ideal)
  - 40% contraste (score de accesibilidad WCAG)
  - Filtro opcional de paletas que no pasan WCAG AA

- **Tipos exportados**:
  - `HarmonyStrategy` — union type de estrategias
  - `LockedColors` — colores bloqueados (partial de BrandPalette)
  - `HarmonicSuggestion` — paleta sugerida con scores

#### Port a Dart (`ds_yoandry_core`)

- Port completo 1:1 del módulo de armonía.
- 42 nuevos tests de armonía (125 total en JS, 74 en Dart).
- Tests de paridad actualizados para incluir harmony.

### Tests

- **125 tests** en `@ds-yoandry/core` (42 nuevos de harmony)
- **74 tests** en `ds_yoandry_core` (37 de paridad)

---

## [4.3.0] — 2025-01-XX _(versión de desarrollo, no publicada)_

### Agregado

- Estructura inicial del módulo de armonía (refactorizado en 4.4.0).

---

## [4.2.0] — 2025-01-XX

### 🎉 Primera versión pública del monorepo

Esta versión transforma el sistema de diseño de un módulo local a una librería
NPM/pub.dev con arquitectura monorepo.

### Packages publicados

- **`@ds-yoandry/core`** v4.2.0 — Motor agnóstico de framework (JS/TS)
- **`@ds-yoandry/react`** v4.2.0 — Hook + Provider para React / React Native
- **`@ds-yoandry/angular`** v4.2.0 — Service + Signals para Angular 20+
- **`ds_yoandry_core`** v4.2.0 — Motor agnóstico en Dart puro
- **`ds_yoandry_flutter`** v4.2.0 — Theming + Provider para Flutter

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

#### `ds_yoandry_core` (Dart puro)

- Port 1:1 del motor de `@ds-yoandry/core` a Dart, **sin dependencia de Flutter**
- Usable en Flutter, backends Dart (Shelf / Dart Frog / Serverpod), CLIs, etc.
- `createDesignSystem(palette, {skipCache})` y `DEFAULT_PALETTE` (`kDefaultPalette`)
- Todas las utilidades: conversores, manipuladores, accesibilidad, generadores,
  validadores, caché
- **Test de paridad** que compara salidas contra fixtures del core JS — cero divergencias

#### `ds_yoandry_flutter`

- Capa de theming idiomática construida sobre `ds_yoandry_core`
- `DsThemeProvider` (InheritedNotifier) + `DsTheme.of(context)`
- `DsThemeController` (ChangeNotifier) con modo claro/oscuro/sistema
- `DsThemeData` con API plana que expone `Color` nativos ya resueltos por modo,
  `List<BoxShadow>` para sombras y `toMaterialTheme()` para integrar con Material
- Persistencia con `shared_preferences`
- 4 paletas predefinidas + `DsPaletteSelector`
- Re-exporta todo `ds_yoandry_core`

### Infraestructura

- Monorepo con pnpm workspaces + Turborepo
- Build con tsup (CJS + ESM + tipos)
- TypeScript estricto en todos los packages

---

## [4.1.0] — 2025-01-XX _(versión local, no publicada)_

### Agregado

- Migración de archivos `.js` a TypeScript nativo
- Hook `useTheme()` con API simplificada
- `ThemeProvider` con persistencia en AsyncStorage
- Corrección de ciclos de dependencia (palette.js separado)
- Archivo `index.d.ts` para tipos TypeScript

---

## [4.0.0] — 2025-01-XX _(versión local, no publicada)_

### Agregado

- Sistema de diseño completo como módulo local
- `createDesignSystem()` a partir de paleta Coolors.co
- Soporte inicial para Platform.select() en React Native
- Gestor de temas (`createThemeManager`, `PRESET_THEMES`)

---

[4.4.1]: https://github.com/YoandryF/ds-yoandry/releases/tag/v4.4.1
[4.4.0]: https://github.com/YoandryF/ds-yoandry/releases/tag/v4.4.0
[4.2.0]: https://github.com/YoandryF/ds-yoandry/releases/tag/v4.2.0
