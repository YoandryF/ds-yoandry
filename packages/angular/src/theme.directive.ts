/**
 * @fileoverview Directiva para aplicar colores del tema en templates
 * @module @ds-yoandry/angular/theme.directive
 *
 * @author Yoandry
 * @version 4.2.0
 */

import { Directive, ElementRef, inject, effect, input } from '@angular/core';
import { ThemeService } from './theme.service';
import type { ThemeColors } from './theme.service';

/**
 * Directiva que aplica colores del tema a un elemento.
 * Reactiva a cambios de tema gracias a Signals.
 *
 * @example
 * <!-- Fondo y texto del tema -->
 * <div appTheme bg="bg" color="text">
 *     Contenido con colores del tema
 * </div>
 *
 * @example
 * <!-- Botón primary -->
 * <button appTheme bg="primary" color="onPrimary" borderColor="primaryDark">
 *     Guardar
 * </button>
 *
 * @example
 * <!-- Card elevada -->
 * <div appTheme bg="surfaceElevated" borderColor="border">
 *     Card content
 * </div>
 */
@Directive({
    selector: '[appTheme]',
    standalone: true,
})
export class ThemeDirective {
    private readonly el = inject(ElementRef<HTMLElement>);
    private readonly theme = inject(ThemeService);

    /** Color de fondo (key de ThemeColors) */
    readonly bg = input<keyof ThemeColors>();

    /** Color de texto (key de ThemeColors) */
    readonly color = input<keyof ThemeColors>();

    /** Color de borde (key de ThemeColors) */
    readonly borderColor = input<keyof ThemeColors>();

    constructor() {
        effect(() => {
            const colors = this.theme.colors();
            const style = this.el.nativeElement.style;

            const bg = this.bg();
            if (bg) {
                const value = colors[bg];
                if (typeof value === 'string') style.backgroundColor = value;
            }

            const color = this.color();
            if (color) {
                const value = colors[color];
                if (typeof value === 'string') style.color = value;
            }

            const border = this.borderColor();
            if (border) {
                const value = colors[border];
                if (typeof value === 'string') style.borderColor = value;
            }
        });
    }
}
