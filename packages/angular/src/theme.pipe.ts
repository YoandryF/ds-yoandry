/**
 * @fileoverview Pipe para obtener colores del tema en templates
 * @module @yoandryf/angular/theme.pipe
 *
 * @author Yoandry
 * @version 4.2.0
 */

import { Pipe, PipeTransform, inject } from '@angular/core';
import { ThemeService } from './theme.service';
import type { ThemeColors } from './theme.service';

/**
 * Pipe para obtener un color del tema en un template Angular.
 * Impure para reaccionar a cambios de tema.
 *
 * @example
 * <!-- En template -->
 * <div [style.background]="'bg' | themeColor">
 *     <p [style.color]="'text' | themeColor">Contenido</p>
 *     <button
 *         [style.background]="'primary' | themeColor"
 *         [style.color]="'onPrimary' | themeColor"
 *     >
 *         Acción
 *     </button>
 * </div>
 *
 * @example
 * <!-- Combinado con ngStyle -->
 * <div [ngStyle]="{
 *     background: 'bg' | themeColor,
 *     color: 'text' | themeColor,
 *     borderColor: 'border' | themeColor
 * }">
 */
@Pipe({
    name: 'themeColor',
    standalone: true,
    pure: false,  // Impure para detectar cambios de tema
})
export class ThemeColorPipe implements PipeTransform {
    private readonly theme = inject(ThemeService);

    transform(colorKey: keyof ThemeColors): string {
        const colors = this.theme.colors();
        const value = colors[colorKey];
        return typeof value === 'string' ? value : '';
    }
}
