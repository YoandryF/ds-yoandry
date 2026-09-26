# ds-yoandry 🎨

> Design System completo y agnóstico de framework — genera colores, escalas, variantes y accesibilidad WCAG AA a partir de una paleta de 5-6 colores.

[![npm core](https://img.shields.io/npm/v/@ds-yoandry/core?label=%40ds-yoandry%2Fcore&color=4357AD)](https://www.npmjs.com/package/@ds-yoandry/core)
[![npm react](https://img.shields.io/npm/v/@ds-yoandry/react?label=%40ds-yoandry%2Freact&color=48A9A6)](https://www.npmjs.com/package/@ds-yoandry/react)
[![npm angular](https://img.shields.io/npm/v/@ds-yoandry/angular?label=%40ds-yoandry%2Fangular&color=C1666B)](https://www.npmjs.com/package/@ds-yoandry/angular)
[![CI](https://github.com/YoandryF/ds-yoandry/actions/workflows/ci.yml/badge.svg)](https://github.com/YoandryF/ds-yoandry/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> Disponible para **React / React Native**, **Angular** y **Flutter / Dart**. El motor es el mismo en todos: JS/TS (`@ds-yoandry/core`) y Dart (`ds_yoandry_core`) producen salidas idénticas, verificadas con tests de paridad automatizados.

---

## ¿Qué es?

Dale 5 colores de [Coolors.co](https://coolors.co) y obtienes automáticamente:

- ✅ Escala de grises uniforme (50–900)
- ✅ Variantes de estado para cada color (light / main / dark / disabled)
- ✅ Colores de texto con contraste **WCAG AA** garantizado
- ✅ Paleta completa para modo claro y oscuro
- ✅ Escalas de opacidad para overlays
- ✅ **🎨 Generador de paletas armónicas** — bloquea tu color de marca y genera el resto
- ✅ Hook `useTheme()` con API plana — sin navegación profunda

```tsx
// ❌ Antes (navegación profunda)
colors.variants.primary.main
colors.surface.background
platform.shadow.md

// ✅ Después (API plana)
const { primary, bg, shadow } = useTheme();
```

---

## Paquetes

| Paquete | Descripción | Instalación |
|---------|-------------|-------------|
| [`@ds-yoandry/core`](./packages/core/README.md) | Motor agnóstico (JS/TS) | `npm i @ds-yoandry/core` |
| [`@ds-yoandry/react`](./packages/react/README.md) | Hook + Provider para React / RN | `npm i @ds-yoandry/react` |
| [`@ds-yoandry/angular`](./packages/angular/README.md) | Service + Signals para Angular | `npm i @ds-yoandry/angular` |
| [`ds_yoandry_core`](./packages/dart_core/README.md) | Motor agnóstico (Dart puro) | `dart pub add ds_yoandry_core` |
| [`ds_yoandry_flutter`](./packages/flutter/README.md) | Provider para Flutter | `flutter pub add ds_yoandry_flutter` |

---

## Inicio rápido

### React / React Native

```bash
npm install @ds-yoandry/react
```

```tsx
// App.tsx
import { ThemeProvider, useTheme } from '@ds-yoandry/react';

function App() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
}

function MyComponent() {
  const { primary, bg, text, shadow, isDark, toggleTheme } = useTheme();

  return (
    <View style={[{ backgroundColor: bg }, shadow.md]}>
      <Text style={{ color: text }}>Hola mundo</Text>
      <TouchableOpacity 
        style={{ backgroundColor: primary }}
        onPress={toggleTheme}
      >
        <Text>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Angular

```bash
npm install @ds-yoandry/angular
```

```typescript
// main.ts
import { provideDesignSystem } from '@ds-yoandry/angular';

bootstrapApplication(AppComponent, {
  providers: [provideDesignSystem()]
});

// component.ts
import { injectTheme, ThemeDirective, ThemeColorPipe } from '@ds-yoandry/angular';

@Component({
  standalone: true,
  imports: [ThemeDirective, ThemeColorPipe],
  template: `
    <div appTheme bg="bg" color="text">
      <button 
        [style.background]="'primary' | themeColor"
        (click)="theme.toggleTheme()"
      >
        {{ theme.isDark() ? '☀️' : '🌙' }}
      </button>
    </div>
  `
})
export class AppComponent {
  theme = injectTheme();
}
```

### Flutter

```yaml
# pubspec.yaml
dependencies:
  ds_yoandry_flutter: ^4.4.0
```

```dart
import 'package:ds_yoandry_flutter/ds_yoandry_flutter.dart';

void main() {
  runApp(
    DsThemeProvider(
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = DsTheme.of(context);
    
    return MaterialApp(
      theme: theme.toMaterialTheme(),
      home: Scaffold(
        backgroundColor: theme.bg,
        body: Text('Hola', style: TextStyle(color: theme.text)),
        floatingActionButton: FloatingActionButton(
          backgroundColor: theme.primary,
          onPressed: () => theme.controller.toggleTheme(),
          child: Icon(theme.isDark ? Icons.light_mode : Icons.dark_mode),
        ),
      ),
    );
  }
}
```

### Solo el core (vanilla JS/TS)

```bash
npm install @ds-yoandry/core
```

```typescript
import { createDesignSystem, DEFAULT_PALETTE } from '@ds-yoandry/core';

const system = createDesignSystem({
  primary:    '#4357AD',
  secondary:  '#48A9A6',
  background: '#E4DFDA',
  warning:    '#D4B483',
  danger:     '#C1666B',
  // success es opcional — se genera automáticamente
});

// Colores generados
system.colors.brand.primary       // '#4357AD'
system.colors.variants.primary.light  // hover state
system.colors.variants.primary.dark   // pressed state
system.colors.text.onPrimary      // '#FFFFFF' (WCAG AA)
system.colors.gray[500]           // Gris medio
system.colors.dark.background     // Fondo modo oscuro
```

---

## 🎨 Armonía de colores (nuevo en v4.4)

¿Tienes tu color de marca pero no sabes qué colores combinan? El generador de paletas armónicas te sugiere colores que funcionan juntos.

```typescript
import { suggestHarmonicPalette } from '@ds-yoandry/core';

// Bloquea tu color de marca
const suggestions = suggestHarmonicPalette({
  locked: { primary: '#4357AD' },
  strategy: 'triadic',  // analogous, complementary, triadic, split-complementary, tetradic, auto
  count: 3,
});

// suggestions[0] = {
//   primary: '#4357AD',     // ← tu color (bloqueado)
//   secondary: '#AD4357',   // ← generado armónicamente
//   background: '#E8E6F0',  // ← generado
//   warning: '#B38B4D',
//   danger: '#B34D5A',
//   success: '#4DAD57',
//   score: 85,              // puntuación de armonía
//   accessibilityPass: true // ✓ pasa WCAG AA
// }

// Usa la sugerencia directamente
const system = createDesignSystem(suggestions[0]);
```

### Estrategias de armonía

| Estrategia | Descripción | Uso ideal |
|------------|-------------|-----------|
| `analogous` | Colores adyacentes (±30°) | Paletas suaves, apps de bienestar |
| `complementary` | Opuestos (180°) | Alto contraste, CTAs llamativos |
| `triadic` | Tres equidistantes (120°) | Balance vibrante, apps creativas |
| `split-complementary` | 150° + 210° | Complementario menos agresivo |
| `tetradic` | Cuatro en cuadrado (90°) | Paletas complejas, dashboards |
| `auto` | Prueba todas | Deja que el algoritmo elija |

### Detectar estrategia de una paleta existente

```typescript
import { detectHarmonyStrategy } from '@ds-yoandry/core';

const result = detectHarmonyStrategy(['#4357AD', '#AD5743']);
// { strategy: 'complementary', confidence: 92 }
```

---

## Colores generados

Desde una paleta de 5-6 colores, se genera automáticamente:

### Variantes de estado

```typescript
system.colors.variants.primary.light    // +15% luminosidad (hover)
system.colors.variants.primary.main     // Color original
system.colors.variants.primary.dark     // -12% luminosidad (pressed)
system.colors.variants.primary.disabled // 60% mezclado con bg
```

### Escala de grises (estilo Tailwind)

```typescript
system.colors.gray[50]   // L=97% — casi blanco
system.colors.gray[100]  // L=94% — fondos hover
system.colors.gray[500]  // L=50% — texto disabled
system.colors.gray[900]  // L=10% — texto principal
```

### Colores de texto (WCAG AA garantizado)

```typescript
system.colors.text.primary      // gray[900]
system.colors.text.secondary    // gray[700]
system.colors.text.onPrimary    // Blanco o negro según contraste
system.colors.text.onDanger     // Automático
```

### Superficies (modo claro y oscuro)

```typescript
// Modo claro
system.colors.surface.background  // Tu background
system.colors.surface.elevated    // #FFFFFF

// Modo oscuro (generado)
system.colors.dark.background     // gray[900]
system.colors.dark.surface        // gray[800]
system.colors.dark.textPrimary    // gray[50]
```

### Escalas de opacidad

```typescript
system.colors.alpha.black[50]   // 'rgba(0, 0, 0, 0.5)'
system.colors.alpha.primary[20] // 'rgba(67, 87, 173, 0.2)'
```

---

## Utilidades de color

### Conversiones

```typescript
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '@ds-yoandry/core';

hexToRgb('#4357AD')      // { r: 67, g: 87, b: 173 }
rgbToHex(67, 87, 173)    // '#4357ad'
rgbToHsl(67, 87, 173)    // { h: 228, s: 44, l: 47 }
```

### Manipulación

```typescript
import { lighten, darken, mix, complement } from '@ds-yoandry/core';

lighten('#4357AD', 20)         // Más claro
darken('#4357AD', 15)          // Más oscuro
mix('#4357AD', '#FFF', 0.3)    // 70% azul, 30% blanco
complement('#4357AD')          // Color opuesto
```

### Accesibilidad WCAG 2.1

```typescript
import { getContrastRatio, meetsContrastAA, ensureContrast } from '@ds-yoandry/core';

getContrastRatio('#4357AD', '#FFFFFF')  // 5.5
meetsContrastAA('#4357AD', '#FFFFFF')   // true (≥4.5)
ensureContrast('#888', '#FFF')          // Ajusta para cumplir 4.5:1
```

---

## Características

| Feature | Core | React | Angular | Dart | Flutter |
|---------|:----:|:-----:|:-------:|:----:|:-------:|
| Escala de grises | ✅ | ✅ | ✅ | ✅ | ✅ |
| Variantes de color | ✅ | ✅ | ✅ | ✅ | ✅ |
| WCAG AA garantizado | ✅ | ✅ | ✅ | ✅ | ✅ |
| Modo oscuro | ✅ | ✅ | ✅ | ✅ | ✅ |
| Armonía de colores | ✅ | ✅ | ✅ | ✅ | ✅ |
| Caché por paleta | ✅ | ✅ | ✅ | ✅ | ✅ |
| API plana | — | ✅ | ✅ | — | ✅ |
| Persistencia de tema | — | ✅ | ✅ | — | ✅ |
| Signals | — | — | ✅ | — | — |
| Material Theme | — | — | — | — | ✅ |

---

## Desarrollo local

```bash
# Clonar e instalar
git clone https://github.com/YoandryF/ds-yoandry.git
cd ds-yoandry
pnpm install

# Build
pnpm build

# Tests (125 tests, ~1.2s con SWC)
pnpm test

# Verificar paridad JS ↔ Dart
pnpm parity
```

### Estructura del monorepo

```
ds-yoandry/
├── packages/
│   ├── core/          # @ds-yoandry/core (JS/TS)
│   ├── react/         # @ds-yoandry/react
│   ├── angular/       # @ds-yoandry/angular
│   ├── dart_core/     # ds_yoandry_core (Dart)
│   └── flutter/       # ds_yoandry_flutter
├── apps/
│   └── demo-react/    # Demo Expo
├── .github/
│   └── workflows/     # CI: tests + paridad
└── turbo.json         # Turborepo config
```

---

## Documentación detallada

- **[@ds-yoandry/core](./packages/core/README.md)** — Motor completo, todas las funciones
- **[@ds-yoandry/react](./packages/react/README.md)** — useTheme, ThemeProvider
- **[@ds-yoandry/angular](./packages/angular/README.md)** — Signals, Directive, Pipe
- **[ds_yoandry_core](./packages/dart_core/README.md)** — Port Dart del core
- **[ds_yoandry_flutter](./packages/flutter/README.md)** — DsThemeProvider, Material integration

---

## Licencia

MIT © [Yoandry](https://github.com/YoandryF)
