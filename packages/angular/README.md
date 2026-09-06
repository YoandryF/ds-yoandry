# @ds-yoandry/angular

[![npm](https://img.shields.io/npm/v/@ds-yoandry/angular?color=C1666B)](https://www.npmjs.com/package/@ds-yoandry/angular)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)

> `ThemeService` con Signals + directiva + pipe para Angular 16+.
> API de colores idéntica al hook de React.

---

## Instalación

```bash
npm install @ds-yoandry/angular
# o
pnpm add @ds-yoandry/angular
```

**Requiere:** `@angular/core >= 16` y `@angular/common >= 16`.

---

## Setup

### 1. Proveer el Design System

```typescript
// main.ts — Standalone (recomendado)
import { bootstrapApplication } from '@angular/platform-browser';
import { provideDesignSystem } from '@ds-yoandry/angular';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [provideDesignSystem()]
});
```

```typescript
// AppModule (NgModule)
import { NgModule } from '@angular/core';
import { provideDesignSystem } from '@ds-yoandry/angular';

@NgModule({
    providers: [...provideDesignSystem()]
})
export class AppModule {}
```

### 2. Usar en componentes

```typescript
import { Component } from '@angular/core';
import { injectTheme, ThemeDirective, ThemeColorPipe } from '@ds-yoandry/angular';

@Component({
    standalone: true,
    imports: [ThemeDirective, ThemeColorPipe],
    template: `
        <div appTheme bg="bg" color="text" class="container">
            <h1>{{ theme.isDark() ? '🌙' : '☀️' }} Mi App</h1>
            <p [style.color]="'textSecondary' | themeColor">Descripción</p>
            <button
                appTheme bg="primary" color="onPrimary"
                (click)="theme.toggleTheme()"
            >
                Cambiar tema
            </button>
        </div>
    `,
    styles: [`
        .container {
            background: var(--ds-bg);
            color: var(--ds-text);
        }
    `]
})
export class AppComponent {
    theme = injectTheme();
}
```

---

## `ThemeService`

El servicio se puede inyectar de dos formas:

```typescript
// Opción 1 — función helper (recomendada)
import { injectTheme } from '@ds-yoandry/angular';

class MyComponent {
    theme = injectTheme();
}

// Opción 2 — inject() estándar de Angular
import { inject } from '@angular/core';
import { ThemeService } from '@ds-yoandry/angular';

class MyComponent {
    private theme = inject(ThemeService);
}
```

### Signals disponibles

| Signal | Tipo | Descripción |
|--------|------|-------------|
| `theme.isDark()` | `boolean` | true si modo oscuro activo |
| `theme.themeMode()` | `ThemeMode` | `'light' \| 'dark' \| 'system'` |
| `theme.colors()` | `ThemeColors` | Todos los colores del tema actual |
| `theme.shadow()` | `PlatformShadows` | Sombras none/sm/md/lg/xl |

### Métodos

```typescript
theme.setTheme('dark')    // Cambiar modo
theme.toggleTheme()       // Alternar claro/oscuro
theme.getDesignSystem()   // Acceso completo al DesignSystem
```

---

## `ThemeColors` — colores disponibles

Los mismos de `useTheme()` en React:

```typescript
const c = theme.colors();

// Fondos
c.bg              // Fondo principal
c.surface         // Cards, modales
c.surfaceElevated // Dropdowns
c.surfaceHover    // Estado hover

// Texto
c.text            // Principal
c.textSecondary   // Descripciones
c.textMuted       // Placeholders
c.textDisabled    // Deshabilitado

// Marca
c.primary         c.primaryLight    c.primaryDark
c.secondary       c.secondaryLight
c.danger          c.dangerLight
c.success         c.successLight
c.warning         c.warningLight

// Texto sobre colores
c.onPrimary       c.onSecondary
c.onDanger        c.onSuccess       c.onWarning

// Utilidades
c.gray            // GrayScale — c.gray[500]
c.border          // Bordes sutiles
c.divider         // Líneas divisoras
```

---

## Directiva `appTheme`

Aplica colores del tema directamente en el elemento. Reactiva a cambios.

```html
<!-- Fondo y texto -->
<div appTheme bg="bg" color="text">...</div>

<!-- Botón primary -->
<button appTheme bg="primary" color="onPrimary">Guardar</button>

<!-- Card con borde -->
<div appTheme bg="surface" borderColor="border">...</div>

<!-- Danger -->
<div appTheme bg="dangerLight" color="danger">Error</div>
```

**Inputs disponibles:** `bg`, `color`, `borderColor` — cualquier key de `ThemeColors`.

---

## Pipe `themeColor`

Obtiene el valor de un color del tema para usarlo en expresiones de binding.

```html
<!-- En ngStyle -->
<div [ngStyle]="{
    background: 'surface' | themeColor,
    color:      'text' | themeColor,
    borderColor:'border' | themeColor
}">

<!-- En style binding -->
<p [style.color]="'textSecondary' | themeColor">Descripción</p>

<!-- En atributos -->
<button [style.background]="'primary' | themeColor">Acción</button>
```

---

## CSS Custom Properties

El `ThemeService` aplica automáticamente variables CSS al `:root` cuando cambia el tema. Úsalas en tus stylesheets:

```css
.my-component {
    background: var(--ds-bg);
    color: var(--ds-text);
    border-color: var(--ds-border);
}

.btn-primary {
    background: var(--ds-primary);
    color: var(--ds-primary-light);  /* Usarlo como texto no garantiza contraste */
}
```

**Variables disponibles:**
`--ds-bg`, `--ds-surface`, `--ds-surface-elevated`,
`--ds-text`, `--ds-text-secondary`, `--ds-text-muted`,
`--ds-primary`, `--ds-primary-light`, `--ds-secondary`,
`--ds-danger`, `--ds-success`, `--ds-warning`,
`--ds-border`, `--ds-divider`

También se agrega `ds-dark` o `ds-light` al `body`:

```css
body.ds-dark .my-component {
    /* Estilos adicionales para dark mode */
}
```

---

## Paleta personalizada

```typescript
import { provideDesignSystem } from '@ds-yoandry/angular';

bootstrapApplication(AppComponent, {
    providers: [
        provideDesignSystem({
            primary:    '#FF6B35',
            secondary:  '#004E89',
            background: '#F5F5F5',
            warning:    '#FFD166',
            danger:     '#EF476F',
            success:    '#06D6A0',
        })
    ]
});
```

---

## Server-Side Rendering (SSR)

El servicio detecta automáticamente si está en browser o servidor vía `isPlatformBrowser`. En SSR no intenta acceder a `window`, `localStorage` ni `matchMedia`.

---

## Re-exporta `@ds-yoandry/core`

No necesitas instalar `@ds-yoandry/core` por separado:

```typescript
import {
    createDesignSystem,
    lighten,
    getContrastRatio,
    DEFAULT_PALETTE,
} from '@ds-yoandry/angular';
```
