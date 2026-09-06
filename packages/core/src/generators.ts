/**
 * @fileoverview Generadores de escalas y variantes de colores
 * @module @ds-yoandry/core/generators
 * @description Proporciona funciones para generar escalas de grises,
 * variantes de colores para estados UI, escalas de opacidad y colores complementarios.
 *
 * @author Yoandry
 * @version 4.2.0
 * @created 2026-09-06
 */

import type { GrayScale, ColorVariants, AlphaScale } from './types';
import { hexToRgb, rgbToHex, hexToRgba, rgbToHsl, hslToRgb } from './converters';
import { setLightness, setSaturation, lighten, darken, mix } from './manipulators';

/**
 * Genera una escala completa de grises a partir de un color base.
 * Sigue la convención Tailwind (50-900) con luminosidades absolutas uniformes.
 *
 * @param baseColor - Color hexadecimal base para la escala
 * @returns Escala de grises del 50 (más claro) al 900 (más oscuro)
 *
 * @example
 * const grays = generateGrayScale('#E4DFDA');
 * // grays[50]  -> Casi blanco (L=97%)
 * // grays[500] -> Gris medio (L=50%)
 * // grays[900] -> Casi negro (L=10%)
 */
export const generateGrayScale = (baseColor: string): GrayScale => {
    const lightnessValues: Record<number, number> = {
        50: 97,   // Casi blanco - fondos sutiles
        100: 94,  // Muy claro - fondos hover
        200: 86,  // Claro - bordes sutiles
        300: 77,  // Claro medio - bordes
        400: 64,  // Medio claro - placeholder text
        500: 50,  // Medio - texto deshabilitado
        600: 40,  // Medio oscuro - texto terciario
        700: 30,  // Oscuro - texto secundario
        800: 20,  // Muy oscuro - superficies dark mode
        900: 10,  // Casi negro - texto principal
    };

    const scale: Partial<GrayScale> = {};
    for (const [key, lightness] of Object.entries(lightnessValues)) {
        (scale as Record<string, string>)[key] = setLightness(baseColor, lightness);
    }
    return scale as GrayScale;
};

/**
 * Genera variantes de un color para diferentes estados de UI.
 * Crea versiones light (hover), main (normal), dark (pressed) y disabled.
 *
 * @param color - Color base hexadecimal
 * @param background - Color de fondo para mezcla en estado disabled
 * @returns Variantes: light, main, dark, disabled
 *
 * @example
 * const primaryVariants = generateColorVariants('#4357AD', '#E4DFDA');
 * // { light: '#6B7DC5', main: '#4357AD', dark: '#344289', disabled: '#9AA3C8' }
 */
export const generateColorVariants = (color: string, background: string): ColorVariants => ({
    light: lighten(color, 15),
    main: color,
    dark: darken(color, 12),
    disabled: mix(color, background, 0.6),
});

/**
 * Genera una escala de opacidades para un color dado.
 * Del 5% al 90% de opacidad.
 *
 * @param hex - Color hexadecimal base
 * @returns Escala de opacidades en formato rgba()
 *
 * @example
 * const blackAlpha = generateAlphaScale('#000000');
 * // blackAlpha[50] -> 'rgba(0, 0, 0, 0.5)'
 * // blackAlpha[20] -> 'rgba(0, 0, 0, 0.2)'
 */
export const generateAlphaScale = (hex: string): AlphaScale => ({
    5: hexToRgba(hex, 0.05),
    10: hexToRgba(hex, 0.1),
    20: hexToRgba(hex, 0.2),
    30: hexToRgba(hex, 0.3),
    40: hexToRgba(hex, 0.4),
    50: hexToRgba(hex, 0.5),
    60: hexToRgba(hex, 0.6),
    70: hexToRgba(hex, 0.7),
    80: hexToRgba(hex, 0.8),
    90: hexToRgba(hex, 0.9),
});

/**
 * Genera un color success complementario basado en el secondary de la paleta.
 * Garantiza saturación mínima 50%, luminosidad entre 35-50%.
 *
 * @param secondary - Color secundario de la paleta
 * @returns Color success (verde) complementario y vibrante
 *
 * @example
 * generateSuccessColor('#48A9A6');  // '#22C55E' (secondary verdoso → Emerald)
 * generateSuccessColor('#FF5722');  // Verde generado que combine con la paleta
 */
export const generateSuccessColor = (secondary: string): string => {
    const rgb = hexToRgb(secondary);
    if (!rgb) return '#22C55E';

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Si el secundario ya es verdoso (hue 80-160), usar Emerald para diferenciarse
    if (hsl.h >= 80 && hsl.h <= 160) return '#22C55E';

    const successHsl = {
        h: 142,
        s: Math.max(50, Math.min(80, hsl.s + 15)),
        l: Math.max(35, Math.min(50, hsl.l)),
    };

    const successRgb = hslToRgb(successHsl.h, successHsl.s, successHsl.l);
    let successColor = rgbToHex(successRgb.r, successRgb.g, successRgb.b);

    const finalHsl = rgbToHsl(successRgb.r, successRgb.g, successRgb.b);
    if (finalHsl.s < 50) {
        successColor = setSaturation(successColor, 55);
    }

    return successColor;
};
