/**
 * @fileoverview Funciones de inyección y providers para Angular
 * @module @ds-yoandry/angular/inject
 *
 * @author Yoandry
 * @version 4.2.0
 */

import { inject, Provider } from '@angular/core';
import { ThemeService } from './theme.service';
import type { BrandPalette } from '@ds-yoandry/core';

/**
 * Inyecta el ThemeService en un componente o servicio.
 * Shorthand idiomático de Angular.
 *
 * @example
 * class MyComponent {
 *     private theme = injectTheme();
 *
 *     colors = this.theme.colors;
 *     isDark = this.theme.isDark;
 *
 *     toggle() {
 *         this.theme.toggleTheme();
 *     }
 * }
 */
export function injectTheme(): ThemeService {
    return inject(ThemeService);
}

/**
 * Proveedor para configurar el Design System con una paleta personalizada.
 * Usar en bootstrapApplication o AppModule providers.
 *
 * @param palette - Paleta personalizada (opcional)
 * @returns Array de providers para Angular
 *
 * @example
 * // main.ts con paleta por defecto
 * bootstrapApplication(AppComponent, {
 *     providers: [provideDesignSystem()]
 * });
 *
 * @example
 * // Con paleta personalizada
 * bootstrapApplication(AppComponent, {
 *     providers: [
 *         provideDesignSystem({
 *             primary: '#FF6B35',
 *             secondary: '#004E89',
 *             background: '#F5F5F5',
 *             warning: '#FFD166',
 *             danger: '#EF476F',
 *         })
 *     ]
 * });
 *
 * @example
 * // En AppModule
 * @NgModule({
 *     providers: [...provideDesignSystem()]
 * })
 * export class AppModule {}
 */
export function provideDesignSystem(palette?: BrandPalette): Provider[] {
    return [
        {
            provide: ThemeService,
            useFactory: () => new ThemeService(palette),
        },
    ];
}
