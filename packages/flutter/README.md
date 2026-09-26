# ds_yoandry_flutter 🎨

> Design System para Flutter — genera colores, escalas, variantes y accesibilidad **WCAG AA** a partir de una paleta de 5-6 colores.

Capa de theming idiomática de Flutter (Provider + persistencia + modo claro/oscuro + paletas conmutables en runtime) construida sobre [`ds_yoandry_core`](../dart_core/README.md), el motor de colores en **Dart puro**.

Este paquete **re-exporta todo el core**, así que con un solo import tienes el motor + los widgets de Flutter.

> ¿Solo necesitas el motor (backend Dart, CLI, sin UI)? Usa [`ds_yoandry_core`](../dart_core/README.md) directamente.

---

## Instalación

Elige según cómo distribuyas los paquetes:

### Opción A — desde Git (recomendado si aún no publicas)

```yaml
dependencies:
  ds_yoandry_flutter:
    git:
      url: https://github.com/YoandryF/ds-yoandry.git
      path: packages/flutter
```

### Opción B — path local (app dentro o junto al monorepo)

```yaml
dependencies:
  ds_yoandry_flutter:
    path: ../ruta/a/packages/flutter
```

### Opción C — pub.dev (si publicas los paquetes)

```yaml
dependencies:
  ds_yoandry_flutter: ^4.4.0
```

> **Nota para publicar en pub.dev**: dentro del monorepo, `ds_yoandry_flutter`
> depende de `ds_yoandry_core` con `path:`. Para publicar debes cambiar esa
> dependencia por una versión (`ds_yoandry_core: ^4.4.0`) y publicar primero
> `ds_yoandry_core`.

Trae consigo `ds_yoandry_core` (el motor) y depende de
[`shared_preferences`](https://pub.dev/packages/shared_preferences) para
persistir el tema.

### Requisitos

- Dart SDK >= 3.0 · Flutter >= 3.10
- `shared_preferences` funciona out-of-the-box en Android, iOS, macOS, Linux,
  Windows y Web. Si no quieres persistencia, usa `DsThemeProvider(persist: false)`
  y no arrastra ningún estado nativo.

---

## Inicio rápido

### 1. Envuelve tu app

```dart
import 'package:flutter/material.dart';
import 'package:ds_yoandry_flutter/ds_yoandry_flutter.dart';

void main() {
  runApp(
    const DsThemeProvider(
      defaultMode: DsThemeMode.system,   // light | dark | system
      defaultPalette: PaletteName.defaultPalette,
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final t = DsTheme.of(context); // se re-construye al cambiar el tema
    return MaterialApp(
      theme: t.toMaterialTheme(),   // ThemeData de Material generado
      home: const HomePage(),
    );
  }
}
```

### 2. Usa el tema en cualquier widget

```dart
class MyCard extends StatelessWidget {
  const MyCard({super.key});

  @override
  Widget build(BuildContext context) {
    final t = DsTheme.of(context);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: t.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: t.shadowMd,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Hola mundo', style: TextStyle(color: t.text, fontSize: 18)),
          Text('Descripción', style: TextStyle(color: t.textSecondary)),
          const SizedBox(height: 12),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: t.primary),
            onPressed: () => DsTheme.read(context).toggleTheme(),
            child: Text('Cambiar tema', style: TextStyle(color: t.onPrimary)),
          ),
        ],
      ),
    );
  }
}
```

---

## API del tema (`DsThemeData`)

`DsTheme.of(context)` devuelve un `DsThemeData` con API **plana** — sin navegación profunda:

| Categoría | Propiedades |
|-----------|-------------|
| **Fondos** | `bg`, `surface`, `surfaceElevated`, `surfaceHover` |
| **Texto** | `text`, `textSecondary`, `textMuted`, `textDisabled` |
| **Marca** | `primary`, `primaryLight`, `primaryDark`, `secondary`, `danger`, `success`, `warning` (+ variantes `*Light`) |
| **Sobre color** | `onPrimary`, `onSecondary`, `onDanger`, `onSuccess`, `onWarning` |
| **Utilidades** | `gray(500)`, `border`, `borderDark`, `divider` |
| **Sombras** | `shadowSm`, `shadowMd`, `shadowLg`, `shadowXl` → `List<BoxShadow>` |
| **Estado** | `isDark` |
| **Acceso completo** | `designSystem` (el `DesignSystem` completo) |

Todos los colores son `Color` nativos y ya están **resueltos para el modo activo** (claro/oscuro).

---

## Control del tema (`DsThemeController`)

Se obtiene con `DsTheme.controller(context)` (suscrito) o `DsTheme.read(context)` (para callbacks):

```dart
final c = DsTheme.read(context);

c.setMode(DsThemeMode.dark);        // Fijar modo
c.toggleTheme();                    // Alternar claro/oscuro
c.setPalette(PaletteName.ocean);    // Cambiar paleta

c.mode;            // DsThemeMode actual
c.isDark;          // bool resuelto
c.paletteName;     // PaletteName activa
c.designSystem;    // DesignSystem completo
```

El modo y la paleta se **persisten automáticamente** en `SharedPreferences`. El modo `system` reacciona a los cambios de brillo del dispositivo.

---

## Paletas predefinidas

```dart
PaletteName.defaultPalette  // Clásico   — #4357AD
PaletteName.ocean           // Océano    — #0077B6
PaletteName.forest          // Bosque    — #2D6A4F
PaletteName.sunset          // Atardecer — #FF6B35
```

Selector visual listo para usar:

```dart
const DsPaletteSelector()
```

### Paleta personalizada

```dart
DsThemeProvider(
  palette: BrandPalette(
    primary: '#FF6B35',
    secondary: '#F7C59F',
    background: '#FFFAF5',
    warning: '#FFD166',
    danger: '#EF476F',
    // success es opcional — se genera automáticamente
  ),
  child: const MyApp(),
)
```

---

## Solo el core (sin widgets)

El motor vive en el paquete separado [`ds_yoandry_core`](../dart_core/README.md) (Dart puro, sin Flutter) y se re-exporta desde aquí. Trabaja con colores en **hex string**, idéntico al paquete original:

```dart
import 'package:ds_yoandry_flutter/ds_yoandry_flutter.dart';

final system = createDesignSystem(const BrandPalette(
  primary: '#4357AD',
  secondary: '#48A9A6',
  background: '#E4DFDA',
  warning: '#D4B483',
  danger: '#C1666B',
));

system.colors.variants.primary.main; // '#4357ad'
system.colors.text.onPrimary;         // '#FFFFFF' (WCAG AA)
system.colors.gray[500];              // Gris medio
system.colors.dark.background;        // Fondo modo oscuro
```

### Utilidades de color

```dart
// Conversión
hexToRgb('#4357AD');       // RGB(r: 67, g: 87, b: 173)
rgbToHex(67, 87, 173);     // '#4357ad'
hexToRgba('#4357AD', 0.5); // 'rgba(67, 87, 173, 0.5)'

// Manipulación
lighten('#4357AD', 20);
darken('#4357AD', 15);
mix('#4357AD', '#FFFFFF', 0.3);
complement('#4357AD');

// Accesibilidad WCAG 2.1
getContrastRatio('#4357AD', '#FFFFFF');   // ~5.5
meetsContrastAA('#4357AD', '#FFFFFF');     // true
getContrastColor('#4357AD');               // '#FFFFFF'
ensureContrast('#888888', '#FFFFFF');      // Gris ajustado a 4.5:1

// Convertir hex del core a Color de Flutter
final color = hexToColor(system.colors.primary.toString());
```

---

## Diferencias con la versión React

| Concepto | React (`@yoandryf/react`) | Flutter (`ds_yoandry_flutter`) |
|----------|---------------------------|-------------------------------|
| Provider | `<ThemeProvider>` | `DsThemeProvider` |
| Acceso | `useTheme()` hook | `DsTheme.of(context)` |
| Acciones | `setTheme` / `toggleTheme` | `DsTheme.read(context).setMode` / `toggleTheme` |
| Persistencia | `AsyncStorage` | `SharedPreferences` |
| Detección sistema | `useColorScheme()` | `WidgetsBinding.platformDispatcher` |
| Colores | strings hex/rgba | `Color` nativos (resueltos por modo) |
| Sombras | estilos RN | `List<BoxShadow>` |
| `color-mix` CSS | `mixWithNative` | *omitido (no aplica)* |

El **core** (conversores, manipuladores, accesibilidad, generadores, `createDesignSystem`) es una réplica funcional 1:1 y produce los mismos valores hex.

---

## Licencia

MIT © [Yoandry](https://github.com/YoandryF)
