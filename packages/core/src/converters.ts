/**
 * @fileoverview Funciones de conversión entre formatos de color
 * @module @yoandryf/core/converters
 * @description Proporciona utilidades para convertir colores entre diferentes
 * formatos: hexadecimal, RGB, HSL y RGBA.
 *
 * @author Yoandry
 * @version 4.2.0
 * @created 2026-09-06
 */

import type { RGB, HSL } from './types';

/**
 * Convierte un color hexadecimal a objeto RGB.
 *
 * @param hex - Color en formato hexadecimal (con o sin #)
 * @returns Objeto con valores RGB (0-255) o null si el formato es inválido
 *
 * @example
 * hexToRgb('#4357AD');  // { r: 67, g: 87, b: 173 }
 * hexToRgb('4357AD');   // { r: 67, g: 87, b: 173 }
 * hexToRgb('invalid');  // null
 */
export const hexToRgb = (hex: string): RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
};

/**
 * Convierte valores RGB a color hexadecimal.
 *
 * @param r - Valor rojo (0-255)
 * @param g - Valor verde (0-255)
 * @param b - Valor azul (0-255)
 * @returns Color en formato hexadecimal con # al inicio
 *
 * @example
 * rgbToHex(67, 87, 173);   // '#4357ad'
 * rgbToHex(255, 255, 255); // '#ffffff'
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(Math.min(255, Math.max(0, x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

/**
 * Convierte un color hexadecimal a RGBA con opacidad.
 *
 * @param hex - Color en formato hexadecimal
 * @param alpha - Opacidad (0-1)
 * @returns Color en formato rgba()
 *
 * @example
 * hexToRgba('#4357AD', 0.5);  // 'rgba(67, 87, 173, 0.5)'
 * hexToRgba('#000000', 0.1);  // 'rgba(0, 0, 0, 0.1)'
 */
export const hexToRgba = (hex: string, alpha: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return `rgba(0, 0, 0, ${alpha})`;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

/**
 * Convierte valores RGB a HSL.
 *
 * @param r - Valor rojo (0-255)
 * @param g - Valor verde (0-255)
 * @param b - Valor azul (0-255)
 * @returns Objeto con H (0-360), S (0-100), L (0-100)
 *
 * @example
 * rgbToHsl(67, 87, 173);  // { h: 228.67, s: 44.16, l: 47.06 }
 * rgbToHsl(255, 0, 0);    // { h: 0, s: 100, l: 50 }
 */
export const rgbToHsl = (r: number, g: number, b: number): HSL => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Convierte valores HSL a RGB.
 *
 * @param h - Hue/Tono (0-360)
 * @param s - Saturation/Saturación (0-100)
 * @param l - Lightness/Luminosidad (0-100)
 * @returns Objeto con valores RGB (0-255)
 *
 * @example
 * hslToRgb(228.67, 44.16, 47.06);  // { r: 67, g: 87, b: 173 }
 * hslToRgb(0, 100, 50);            // { r: 255, g: 0, b: 0 }
 */
export const hslToRgb = (h: number, s: number, l: number): RGB => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r: number, g: number, b: number;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
};
