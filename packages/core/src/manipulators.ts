/**
 * @fileoverview Funciones de manipulación de colores
 * @module @yoandryf/core/manipulators
 * @description Proporciona utilidades para modificar colores: aclarar, oscurecer,
 * saturar, desaturar, mezclar, rotar tonos y más.
 *
 * @author Yoandry
 * @version 4.2.0
 * @created 2026-09-06
 */

import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './converters';

/**
 * Ajusta la luminosidad de un color a un valor absoluto en HSL.
 *
 * @param hex - Color hexadecimal
 * @param targetLightness - Luminosidad objetivo (0-100)
 * @returns Color hexadecimal con la luminosidad ajustada
 *
 * @example
 * setLightness('#4357AD', 90);  // Versión muy clara del azul (L=90%)
 * setLightness('#4357AD', 10);  // Versión muy oscura del azul (L=10%)
 */
export const setLightness = (hex: string, targetLightness: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.min(100, Math.max(0, targetLightness));
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * Ajusta la saturación de un color a un valor absoluto en HSL.
 *
 * @param hex - Color hexadecimal
 * @param targetSaturation - Saturación objetivo (0-100)
 * @returns Color hexadecimal con la saturación ajustada
 *
 * @example
 * setSaturation('#4357AD', 100);  // Azul completamente saturado
 * setSaturation('#4357AD', 0);    // Gris (sin saturación)
 */
export const setSaturation = (hex: string, targetSaturation: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.s = Math.min(100, Math.max(0, targetSaturation));
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * Aclara un color aumentando su luminosidad en HSL.
 *
 * @param hex - Color hexadecimal a aclarar
 * @param percent - Porcentaje a aumentar la luminosidad (0-100)
 * @returns Color hexadecimal aclarado
 *
 * @example
 * lighten('#4357AD', 20);  // Versión más clara del azul
 * lighten('#4357AD', 15);  // Azul para hover state
 */
export const lighten = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.min(100, hsl.l + percent);
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * Oscurece un color reduciendo su luminosidad en HSL.
 *
 * @param hex - Color hexadecimal a oscurecer
 * @param percent - Porcentaje a reducir la luminosidad (0-100)
 * @returns Color hexadecimal oscurecido
 *
 * @example
 * darken('#4357AD', 15);  // Versión más oscura del azul
 * darken('#4357AD', 12);  // Azul para pressed state
 */
export const darken = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.max(0, hsl.l - percent);
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * Aumenta la saturación de un color.
 *
 * @param hex - Color hexadecimal
 * @param percent - Porcentaje a aumentar la saturación (0-100)
 * @returns Color hexadecimal más saturado
 *
 * @example
 * saturate('#4357AD', 20);  // Azul más vibrante
 */
export const saturate = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.s = Math.min(100, hsl.s + percent);
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * Reduce la saturación de un color.
 *
 * @param hex - Color hexadecimal
 * @param percent - Porcentaje a reducir la saturación (0-100)
 * @returns Color hexadecimal desaturado
 *
 * @example
 * desaturate('#4357AD', 20);    // Azul más apagado
 * desaturate('#FF0000', 100);   // Rojo convertido a gris
 */
export const desaturate = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.s = Math.max(0, hsl.s - percent);
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * Ajusta el tono (hue) de un color rotándolo en la rueda cromática.
 *
 * @param hex - Color hexadecimal
 * @param degrees - Grados a rotar el tono (-360 a 360)
 * @returns Color hexadecimal con el tono ajustado
 *
 * @example
 * adjustHue('#FF0000', 120);  // Rojo -> Verde
 * adjustHue('#FF0000', 240);  // Rojo -> Azul
 */
export const adjustHue = (hex: string, degrees: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = ((hsl.h + degrees) % 360 + 360) % 360;
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * Mezcla dos colores con un peso determinado.
 *
 * @param hex1 - Primer color hexadecimal
 * @param hex2 - Segundo color hexadecimal
 * @param weight - Peso del segundo color (0 = solo hex1, 1 = solo hex2)
 * @returns Color hexadecimal resultante de la mezcla
 *
 * @example
 * mix('#4357AD', '#E4DFDA', 0.5);  // 50% azul, 50% gris
 * mix('#4357AD', '#FFFFFF', 0.3);  // Azul con 30% blanco (tinte)
 */
export const mix = (hex1: string, hex2: string, weight = 0.5): string => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return hex1;
    const r = rgb1.r * (1 - weight) + rgb2.r * weight;
    const g = rgb1.g * (1 - weight) + rgb2.g * weight;
    const b = rgb1.b * (1 - weight) + rgb2.b * weight;
    return rgbToHex(r, g, b);
};

/**
 * Obtiene el color complementario (opuesto en la rueda cromática, 180°).
 *
 * @param hex - Color hexadecimal
 * @returns Color complementario
 *
 * @example
 * complement('#FF0000');  // '#00FFFF' (rojo -> cyan)
 * complement('#4357AD');  // Naranja/amarillo (opuesto al azul)
 */
export const complement = (hex: string): string => adjustHue(hex, 180);

/**
 * Invierte un color (negativo fotográfico).
 *
 * @param hex - Color hexadecimal
 * @returns Color invertido
 *
 * @example
 * invert('#000000');  // '#ffffff'
 * invert('#FFFFFF');  // '#000000'
 * invert('#FF0000');  // '#00ffff'
 */
export const invert = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
};

/**
 * Detecta si el entorno soporta color-mix() de CSS.
 *
 * @returns true si color-mix() está soportado
 *
 * @example
 * if (supportsColorMix()) {
 *     element.style.background = 'color-mix(in srgb, #4357AD 70%, #FFF 30%)';
 * }
 */
export const supportsColorMix = (): boolean => {
    if (typeof window === 'undefined' || typeof CSS === 'undefined') return false;
    try {
        return CSS.supports('color', 'color-mix(in srgb, #000 50%, #fff)');
    } catch {
        return false;
    }
};

/**
 * Mezcla dos colores usando color-mix() nativo si está disponible,
 * con fallback a implementación JavaScript.
 *
 * @param hex1 - Primer color hexadecimal
 * @param hex2 - Segundo color hexadecimal
 * @param weight - Peso del segundo color (0-1)
 * @param options - Opciones adicionales
 * @returns Color mezclado
 *
 * @example
 * mixWithNative('#4357AD', '#FFFFFF', 0.3);
 * // Navegador moderno: 'color-mix(in srgb, #4357AD 70%, #FFFFFF 30%)'
 * // Fallback JS: '#8a9bc9'
 */
export const mixWithNative = (
    hex1: string,
    hex2: string,
    weight = 0.5,
    options: { preferNative?: boolean } = {}
): string => {
    const { preferNative = true } = options;

    if (preferNative && supportsColorMix()) {
        const percent1 = Math.round((1 - weight) * 100);
        const percent2 = Math.round(weight * 100);
        return `color-mix(in srgb, ${hex1} ${percent1}%, ${hex2} ${percent2}%)`;
    }

    return mix(hex1, hex2, weight);
};
