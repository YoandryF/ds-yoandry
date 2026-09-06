# @ds-yoandry/react

[![npm](https://img.shields.io/npm/v/@ds-yoandry/react?color=48A9A6)](https://www.npmjs.com/package/@ds-yoandry/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)

> Hook `useTheme()` + Provider para React y React Native.
> Incluye modo oscuro reactivo, persistencia en AsyncStorage y API de colores plana.

---

## Instalación

```bash
npm install @ds-yoandry/react @react-native-async-storage/async-storage
# o
pnpm add @ds-yoandry/react @react-native-async-storage/async-storage
```

---

## Setup

### 1. Envolver la app con `ThemeProvider`

```tsx
// Expo Router — app/_layout.tsx
import { ThemeProvider } from '@ds-yoandry/react';
import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <ThemeProvider defaultTheme="system">
            <Stack />
        </ThemeProvider>
    );
}
```

```tsx
// React Native puro — App.tsx
import { ThemeProvider } from '@ds-yoandry/react';

export default function App() {
    return (
        <ThemeProvider defaultTheme="system">
            <YourApp />
        </ThemeProvider>
    );
}
```

### 2. Usar `useTheme()` en componentes

```tsx
import { useTheme } from '@ds-yoandry/react';

function MyComponent() {
    const { bg, text, primary, shadow, isDark, toggleTheme } = useTheme();

    return (
        <View style={[{ backgroundColor: bg }, shadow.md]}>
            <Text style={{ color: text }}>Hola mundo</Text>
            <TouchableOpacity
                style={{ backgroundColor: primary, padding: 12, borderRadius: 8 }}
                onPress={toggleTheme}
            >
                <Text style={{ color: onPrimary }}>
                    {isDark ? '☀️ Modo claro' : '🌙 Modo oscuro'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
```

---

## API de `useTheme()`

### Fondos

| Propiedad | Descripción |
|-----------|-------------|
| `bg` | Fondo principal de la app |
| `surface` | Cards, modales |
| `surfaceElevated` | Dropdowns, tooltips |
| `surfaceHover` | Superficie en estado hover |

### Texto

| Propiedad | Descripción |
|-----------|-------------|
| `text` | Texto principal |
| `textSecondary` | Descripciones, subtítulos |
| `textMuted` | Placeholders, hints |
| `textDisabled` | Estado deshabilitado |

### Colores de marca

| Propiedad | Descripción |
|-----------|-------------|
| `primary` | Color principal |
| `primaryLight` | Variante hover/fondo |
| `primaryDark` | Variante pressed |
| `secondary` | Color secundario |
| `secondaryLight` | Variante hover/fondo |
| `danger` | Error, eliminar |
| `dangerLight` | Fondo danger sutil |
| `success` | Éxito, confirmar |
| `successLight` | Fondo success sutil |
| `warning` | Alerta |
| `warningLight` | Fondo warning sutil |

### Texto sobre colores (para botones)

| Propiedad | Descripción |
|-----------|-------------|
| `onPrimary` | Texto sobre fondo primary |
| `onSecondary` | Texto sobre fondo secondary |
| `onDanger` | Texto sobre fondo danger |
| `onSuccess` | Texto sobre fondo success |
| `onWarning` | Texto sobre fondo warning |

### Utilidades

| Propiedad | Descripción |
|-----------|-------------|
| `gray` | Escala completa — `gray[100]`, `gray[500]`... |
| `border` | Color para bordes sutiles |
| `borderDark` | Color para bordes pronunciados |
| `divider` | Líneas divisoras (adapta a dark/light) |
| `shadow` | `shadow.sm`, `shadow.md`, `shadow.lg`, `shadow.xl` |

### Control de tema

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `isDark` | `boolean` | `true` si modo oscuro activo |
| `themeMode` | `'light' \| 'dark' \| 'system'` | Modo actual |
| `setTheme` | `(mode) => void` | Cambiar modo |
| `toggleTheme` | `() => void` | Alternar claro/oscuro |

### Acceso completo

| Propiedad | Descripción |
|-----------|-------------|
| `colors` | Objeto completo de colores anidado |
| `platform` | Shadow y feedback completos |
| `designSystem` | Design System crudo |

---

## Hooks adicionales

```tsx
import { useColors, useShadow, useIsDark } from '@ds-yoandry/react';

// Solo colores
const { bg, text, primary } = useColors();

// Solo sombras
const shadow = useShadow();
<View style={shadow.md} />

// Solo estado dark/light
const isDark = useIsDark();
const icon = isDark ? '🌙' : '☀️';
```

---

## Configuración del `ThemeProvider`

```tsx
<ThemeProvider
    defaultTheme="system"         // 'light' | 'dark' | 'system' — default: 'system'
    palette={customPalette}       // BrandPalette — default: DEFAULT_PALETTE
    storageKey="@myapp_theme"     // string — default: '@ds_theme'
>
    {children}
</ThemeProvider>
```

### Paleta personalizada

```tsx
import { ThemeProvider } from '@ds-yoandry/react';

const myPalette = {
    primary:    '#FF6B35',
    secondary:  '#004E89',
    background: '#F5F5F5',
    warning:    '#FFD166',
    danger:     '#EF476F',
    success:    '#06D6A0',  // Opcional
};

<ThemeProvider palette={myPalette}>
    <App />
</ThemeProvider>
```

---

## Selector de tema

```tsx
import { useTheme } from '@ds-yoandry/react';
import type { ThemeMode } from '@ds-yoandry/react';

function ThemeSelector() {
    const { themeMode, setTheme, primary, surface, text, onPrimary, gray } = useTheme();

    const options: { label: string; value: ThemeMode }[] = [
        { label: '☀️ Claro',   value: 'light' },
        { label: '🌙 Oscuro',  value: 'dark' },
        { label: '📱 Sistema', value: 'system' },
    ];

    return (
        <View style={{ flexDirection: 'row', gap: 8 }}>
            {options.map(({ label, value }) => (
                <TouchableOpacity
                    key={value}
                    style={{
                        backgroundColor: themeMode === value ? primary : surface,
                        borderColor: themeMode === value ? primary : gray[300],
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 8,
                    }}
                    onPress={() => setTheme(value)}
                >
                    <Text style={{ color: themeMode === value ? onPrimary : text }}>
                        {label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
```

---

## Monorepo / Metro config

Si usas este paquete en un monorepo con Metro (Expo), agrega en `metro.config.js`:

```js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
```

---

## Re-exporta `@ds-yoandry/core`

Este paquete re-exporta todo `@ds-yoandry/core`, así que no necesitas instalar ambos:

```typescript
import {
    createDesignSystem,
    lighten,
    getContrastRatio,
    DEFAULT_PALETTE,
} from '@ds-yoandry/react';
```
