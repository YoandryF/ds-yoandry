# ds-yoandry 🎨

> Design System completo y agnóstico de framework — genera colores, escalas, variantes y accesibilidad WCAG AA a partir de una paleta de 5-6 colores.

[![npm core](https://img.shields.io/npm/v/@ds-yoandry/core?label=%40ds-yoandry%2Fcore&color=4357AD)](https://www.npmjs.com/package/@ds-yoandry/core)
[![npm react](https://img.shields.io/npm/v/@ds-yoandry/react?label=%40ds-yoandry%2Freact&color=48A9A6)](https://www.npmjs.com/package/@ds-yoandry/react)
[![npm angular](https://img.shields.io/npm/v/@ds-yoandry/angular?label=%40ds-yoandry%2Fangular&color=C1666B)](https://www.npmjs.com/package/@ds-yoandry/angular)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## ¿Qué es?

Dale 5 colores de [Coolors.co](https://coolors.co) y obtienes automáticamente:

- Escala de grises uniforme (50–900)
- Variantes de estado para cada color (light / main / dark / disabled)
- Colores de texto con contraste **WCAG AA** garantizado
- Paleta completa para modo claro y oscuro
- Escalas de opacidad para overlays
- Hook `useTheme()` con API plana — sin navegación profunda

```tsx
// ❌ Antes
colors.variants.primary.main
colors.surface.background
platform.shadow.md

// ✅ Con useTheme()
const { primary, bg, shadow } = useTheme();
```

---

## Paquetes

| Paquete | Descripción | Instalación |
|---------|-------------|-------------|
| [`@ds-yoandry/core`](./packages/core/README.md) | Motor agnóstico de framework | `npm i @ds-yoandry/core` |
| [`@ds-yoandry/react`](./packages/react/README.md) | Hook + Provider para React / React Native | `npm i @ds-yoandry/react` |
| [`@ds-yoandry/angular`](./packages/angular/README.md) | Service + Signals para Angular 20+ | `npm i @ds-yoandry/angular` |

---

## Inicio rápido

### React Native (Expo)

```bash
npm install @ds-yoandry/react @react-native-async-storage/async-storage
```

```tsx
// app/_layout.tsx
import { ThemeProvider } from '@ds-yoandry/react';

export default function RootLayout() {
    return (
        <ThemeProvider defaultTheme="system">
            <Stack />
        </ThemeProvider>
    );
}
```

```tsx
// Cualquier componente
import { useTheme } from '@ds-yoandry/react';

function MyCard() {
    const { bg, text, primary, shadow, toggleTheme } = useTheme();

    return (
        <View style={[{ backgroundColor: bg }, shadow.md]}>
            <Text style={{ color: text }}>Hola mundo</Text>
            <TouchableOpacity
                style={{ backgroundColor: primary }}
                onPress={toggleTheme}
            >
                <Text>Cambiar tema</Text>
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
```

```typescript
// app.component.ts
import { injectTheme, ThemeDirective, ThemeColorPipe } from '@ds-yoandry/angular';

@Component({
    standalone: true,
    imports: [ThemeDirective, ThemeColorPipe],
    template: `
        <div appTheme bg="bg" color="text">
            <button
                [style.background]="'primary' | themeColor"
                [style.color]="'onPrimary' | themeColor"
                (click)="theme.toggleTheme()"
            >
                {{ theme.isDark() ? '☀️ Claro' : '🌙 Oscuro' }}
            </button>
        </div>
    `
})
export class AppComponent {
    theme = injectTheme();
}
```

### Solo el core (vanilla JS/TS)

```bash
npm install @ds-yoandry/core
```

```typescript
import { createDesignSystem } from '@ds-yoandry/core';

const system = createDesignSystem({
    primary: '#4357AD',
    secondary: '#48A9A6',
    background: '#E4DFDA',
    warning: '#D4B483',
    danger: '#C1666B',
});

system.colors.variants.primary.main   // '#4357AD'
system.colors.text.onPrimary          // '#FFFFFF' (WCAG AA)
system.colors.gray[500]               // Gris medio
system.colors.dark.background         // Fondo para modo oscuro
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
//     success:    '#22C55E'  — Emerald (generado automáticamente si no se provee)
// }
```

---

## Características

- ✅ **Framework agnostic** — el core no tiene dependencias externas
- ✅ **WCAG AA** — contraste garantizado en todos los colores de texto
- ✅ **Modo oscuro** — paleta completa generada automáticamente
- ✅ **TypeScript** — tipos completos incluidos
- ✅ **Caché** — memoización automática por paleta
- ✅ **Signals** (Angular) — reactividad nativa sin Zone.js
- ✅ **AsyncStorage** (React Native) — persistencia de tema
- ✅ **API plana** — `useTheme()` sin profundidad de objetos
- ✅ **Tree-shakeable** — solo se incluye lo que se usa
- ✅ **83 tests** — cobertura del core

---

## Estructura del monorepo

```
ds-yoandry/
├── packages/
│   ├── core/          # @ds-yoandry/core
│   ├── react/         # @ds-yoandry/react
│   └── angular/       # @ds-yoandry/angular
├── apps/
│   └── demo-react/    # App demo con Expo
├── tools/
│   └── config/        # tsconfig compartido
├── CHANGELOG.md
├── CONTRIBUTING.md
└── LICENSE
```

---

## Desarrollo local

```bash
# Requisitos: Node >= 18, pnpm >= 9
pnpm install

# Build todos los packages
pnpm build

# Tests del core
pnpm test

# Correr la demo
cd apps/demo-react && npx expo start
```

---

## Documentación

- [Guía completa de @ds-yoandry/core](./packages/core/README.md)
- [Guía completa de @ds-yoandry/react](./packages/react/README.md)
- [Guía completa de @ds-yoandry/angular](./packages/angular/README.md)
- [CHANGELOG](./CHANGELOG.md)
- [CONTRIBUTING](./CONTRIBUTING.md)

---

## Licencia

MIT © [Yoandry](https://github.com/YoandryF)
