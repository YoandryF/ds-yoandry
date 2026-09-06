/**
 * @fileoverview Design System para Angular 16+
 * @module @yoandryf/angular
 * @description Bindings de Angular para el Design System.
 * Incluye ThemeService con Signals, directiva, pipe y providers.
 *
 * @author Yoandry
 * @version 4.2.0
 *
 * @example
 * // 1. Proveer en main.ts
 * import { provideDesignSystem } from '@yoandryf/angular';
 *
 * bootstrapApplication(AppComponent, {
 *     providers: [provideDesignSystem()]
 * });
 *
 * @example
 * // 2. Usar en componente (Signals API)
 * import { injectTheme } from '@yoandryf/angular';
 *
 * @Component({
 *     standalone: true,
 *     imports: [ThemeDirective, ThemeColorPipe],
 *     template: `
 *         <div appTheme bg="bg" color="text">
 *             <h1>{{ 'primary' | themeColor }}</h1>
 *             <button (click)="theme.toggleTheme()">
 *                 {{ theme.isDark() ? '☀️' : '🌙' }}
 *             </button>
 *         </div>
 *     `
 * })
 * export class AppComponent {
 *     theme = injectTheme();
 * }
 */

// =============================================================================
// RE-EXPORTAR CORE
// =============================================================================

export * from '@yoandryf/core';

// =============================================================================
// SERVICIO
// =============================================================================

export { ThemeService } from './theme.service';
export type { ThemeMode, ThemeColors } from './theme.service';

// =============================================================================
// DIRECTIVA Y PIPE
// =============================================================================

export { ThemeDirective } from './theme.directive';
export { ThemeColorPipe } from './theme.pipe';

// =============================================================================
// PROVIDERS E INYECCIÓN
// =============================================================================

export { injectTheme, provideDesignSystem } from './inject';
