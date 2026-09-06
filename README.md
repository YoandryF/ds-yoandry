# Design System Generator 🎨

Sistema de diseño completo para React Native con soporte para modo claro/oscuro, accesibilidad WCAG AA, y estilos específicos por plataforma.

## 🚀 Inicio Rápido

### 1. Instalar dependencia

```bash
npx expo install @react-native-async-storage/async-storage
```

### 2. Envolver la app con ThemeProvider

```tsx
// app/_layout.tsx
import { ThemeProvider, useTheme } from '@/utils/designSystem';

export default function RootLayout() {
    return (
        <ThemeProvider defaultTheme="system">
            <ThemedApp />
        </ThemeProvider>
    );
}

function ThemedApp() {
    const { bg, isDark } = useTheme();
    return (
        <Stack screenOptions={{ contentStyle: { backgroundColor: bg } }} />
    );
}
```

### 3. Usar en componentes

```tsx
import { useTheme } from '@/utils/designSystem';

function MiComponente() {
    const { bg, text, primary, shadow, isDark, toggleTheme } = useTheme();

    return (
        <View style={[{ backgroundColor: bg }, shadow.md]}>
            <Text style={{ color: text }}>Hola mundo</Text>
            <TouchableOpacity 
                style={{ backgroundColor: primary, padding: 12, borderRadius: 8 }}
                onPress={toggleTheme}
            >
                <Text style={{ color: '#FFF' }}>{isDark ? '☀️ Claro' : '🌙 Oscuro'}</Text>
            </TouchableOpacity>
        </View>
    );
}
```

---

## 📖 API del Hook `useTheme()`

### Colores Directos

| Propiedad | Descripción | Ejemplo |
|-----------|-------------|---------|
| `bg` | Background principal | `{ backgroundColor: bg }` |
| `surface` | Cards, modales | `{ backgroundColor: surface }` |
| `surfaceElevated` | Dropdowns, tooltips | `{ backgroundColor: surfaceElevated }` |
| `text` | Texto principal | `{ color: text }` |
| `textSecondary` | Texto secundario | `{ color: textSecondary }` |
| `textMuted` | Placeholder, hints | `{ color: textMuted }` |
| `textDisabled` | Texto deshabilitado | `{ color: textDisabled }` |

### Colores de Marca

| Propiedad | Descripción | Uso típico |
|-----------|-------------|------------|
| `primary` | Color principal | Botones, CTAs |
| `primaryLight` | Primary claro | Hover, fondos |
| `primaryDark` | Primary oscuro | Pressed |
| `secondary` | Color secundario | Acentos |
| `danger` | Rojo | Errores, gastos, eliminar |
| `success` | Verde | Éxito, ingresos, confirmar |
| `warning` | Amarillo | Alertas, advertencias |

### Texto sobre Colores

| Propiedad | Uso |
|-----------|-----|
| `onPrimary` | Texto sobre botón primary |
| `onSecondary` | Texto sobre botón secondary |
| `onDanger` | Texto sobre botón danger |
| `onSuccess` | Texto sobre botón success |
| `onWarning` | Texto sobre botón warning |

### Utilidades

| Propiedad | Descripción | Ejemplo |
|-----------|-------------|---------|
| `shadow` | Sombras por plataforma | `shadow.sm`, `shadow.md`, `shadow.lg`, `shadow.xl` |
| `gray` | Escala de grises | `gray[100]`, `gray[500]`, `gray[900]` |
| `border` | Color para bordes | `{ borderColor: border }` |
| `divider` | Color para divisores | `{ backgroundColor: divider }` |

### Control de Tema

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `isDark` | `boolean` | `true` si modo oscuro activo |
| `themeMode` | `'light' \| 'dark' \| 'system'` | Modo actual |
| `setTheme` | `(mode) => void` | Cambiar tema: `setTheme('dark')` |
| `toggleTheme` | `() => void` | Alternar claro/oscuro |

### Acceso Avanzado

| Propiedad | Descripción |
|-----------|-------------|
| `colors` | Objeto completo de colores (estructura anidada) |
| `platform` | Sombras y feedback táctil |
| `designSystem` | Design System completo |

---

## 🎨 Hooks Adicionales

```tsx
// Solo colores esenciales
const { bg, text, primary } = useColors();

// Solo sombras
const shadow = useShadow();
<View style={shadow.md} />

// Solo estado dark/light
const isDark = useIsDark();
```

---

## ⚙️ Configuración del Provider

```tsx
<ThemeProvider
    defaultTheme="system"        // 'light' | 'dark' | 'system'
    palette={customPalette}      // Opcional: paleta personalizada
    storageKey="@my_app_theme"   // Opcional: key para AsyncStorage
>
    {children}
</ThemeProvider>
```

### Paleta Personalizada

```tsx
<ThemeProvider
    palette={{
        primary: '#FF6B35',
        secondary: '#004E89',
        background: '#F5F5F5',
        warning: '#FFD166',
        danger: '#EF476F',
        success: '#06D6A0',  // Opcional
    }}
>
```

---

## 📁 Estructura de Archivos

```
utils/designSystem/
├── index.js              # Exportaciones públicas
├── index.d.ts            # Tipos TypeScript
├── palette.js            # Paleta por defecto
├── ThemeContext.tsx      # Provider y Context
├── useTheme.ts           # Hook principal
├── createDesignSystem.js # Generador del sistema
├── themeManager.js       # Gestor de múltiples temas
├── cache.js              # Memoización
├── converters.js         # hex ↔ rgb ↔ hsl ↔ rgba
├── manipulators.js       # lighten, darken, mix, etc.
├── accessibility.js      # WCAG, contraste
├── generators.js         # Escalas, variantes
├── platform.js           # Platform.select, sombras
├── validators.js         # Validación de colores
├── types.js              # Definiciones JSDoc
└── README.md             # Esta documentación
```

---

## 🔧 Uso sin Hook (Legacy)

Para casos donde no puedes usar hooks:

```tsx
import { DESIGN_SYSTEM } from '@/utils/designSystem';

const { colors, platform } = DESIGN_SYSTEM;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface.background,
    },
    card: {
        backgroundColor: colors.surface.elevated,
        ...platform.shadow.md,
    },
    button: {
        backgroundColor: colors.variants.primary.main,
    },
    buttonText: {
        color: colors.text.onPrimary,
    },
});
```

---

## 🛠️ Utilidades de Color

```tsx
import { colorUtils } from '@/utils/designSystem';

// Conversiones
colorUtils.hexToRgb('#4357AD');         // { r: 67, g: 87, b: 173 }
colorUtils.hexToRgba('#4357AD', 0.5);   // 'rgba(67, 87, 173, 0.5)'
colorUtils.rgbToHsl(67, 87, 173);       // { h: 228, s: 44, l: 47 }

// Manipulación
colorUtils.lighten('#4357AD', 20);      // Más claro
colorUtils.darken('#4357AD', 15);       // Más oscuro
colorUtils.saturate('#4357AD', 20);     // Más vibrante
colorUtils.desaturate('#4357AD', 30);   // Más apagado
colorUtils.mix('#4357AD', '#FFF', 0.3); // Mezcla 70/30

// Accesibilidad WCAG
colorUtils.getContrastRatio('#000', '#FFF');   // 21
colorUtils.meetsContrastAA('#333', '#FFF');    // true
colorUtils.meetsContrastAAA('#333', '#FFF');   // true
colorUtils.getContrastColor('#4357AD');        // '#FFFFFF' o '#000000'
colorUtils.ensureContrast('#888', '#FFF');     // Ajusta para cumplir 4.5:1

// Validación
colorUtils.isValidHex('#4357AD');       // true
colorUtils.normalizeHex('4357AD');      // '#4357AD'
```

---

## 🎭 Temas Predefinidos

```tsx
import { createThemeManager, PRESET_THEMES } from '@/utils/designSystem';

const manager = createThemeManager([
    PRESET_THEMES.light,
    PRESET_THEMES.dark,
    PRESET_THEMES.ocean,
    PRESET_THEMES.forest,
    PRESET_THEMES.sunset,
], 'light');

manager.setTheme('dark');
const colors = manager.current.colors;
```

---

## ✅ Características

- 🎨 Generación automática desde paleta de 5-6 colores
- 🌗 Modo claro/oscuro con detección del sistema
- 💾 Persistencia de preferencia en AsyncStorage
- ♿ Contraste WCAG AA garantizado
- 📱 Sombras nativas iOS/Android (Platform.select)
- ⚡ Memoización y caché para rendimiento
- 🔄 Re-render automático al cambiar tema
- 📐 Escala de grises uniforme (50-900)
- 🎯 API simplificada sin navegación profunda

---

## 📋 Paleta por Defecto

```javascript
{
    primary: '#4357AD',      // Ocean Twilight - Azul profundo
    secondary: '#48A9A6',    // Tropical Teal - Verde azulado
    background: '#E4DFDA',   // Dust Grey - Gris cálido
    warning: '#D4B483',      // Soft Fawn - Dorado suave
    danger: '#C1666B',       // Lobster Pink - Rosa coral
    success: '#22C55E',      // Emerald - Verde éxito
}
```

---

## 📌 Versión

**4.2.0** - Con hook simplificado `useTheme()`

## 👤 Autor

Yoandry - 2026
