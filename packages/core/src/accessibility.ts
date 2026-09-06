/**
 * @fileoverview Funciones de contraste y accesibilidad WCAG 2.1
 * @module @ds-yoandry/core/accessibility
 * @description Proporciona utilidades para verificar y garantizar contraste
 * accesible según las pautas WCAG 2.1.
 *
 * @author Yoandry
 * @version 4.2.0
 * @created 2026-09-06
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */

import { hexToRgb } from './converters';
import { setLightness } from './manipulators';

/**
 * Calcula la luminancia relativa de un color según WCAG 2.1.
 *
 * @param hex - Color hexadecimal
 * @returns Luminancia relativa (0-1)
 *
 * @example
 * getRelativeLuminance('#FFFFFF');  // 1
 * getRelativeLuminance('#000000');  // 0
 * getRelativeLuminance('#4357AD');  // ~0.12
 */
export const getRelativeLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(channel => {
        const sRGB = channel / 255;
        return sRGB <= 0.03928
            ? sRGB / 12.92
            : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Calcula el ratio de contraste entre dos colores según WCAG 2.1.
 * Niveles: AA normal >= 4.5:1, AA grande >= 3:1, AAA normal >= 7:1
 *
 * @param hex1 - Primer color hexadecimal
 * @param hex2 - Segundo color hexadecimal
 * @returns Ratio de contraste (1-21)
 *
 * @example
 * getContrastRatio('#000000', '#FFFFFF');  // 21
 * getContrastRatio('#4357AD', '#FFFFFF');  // ~5.5
 */
export const getContrastRatio = (hex1: string, hex2: string): number => {
    const l1 = getRelativeLuminance(hex1);
    const l2 = getRelativeLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Verifica si el contraste cumple con WCAG AA.
 * Texto normal: >= 4.5:1 | Texto grande: >= 3:1
 *
 * @param foreground - Color del texto
 * @param background - Color del fondo
 * @param isLargeText - Si es texto grande (18pt+ o 14pt+ bold)
 * @returns true si cumple WCAG AA
 *
 * @example
 * meetsContrastAA('#000000', '#FFFFFF');        // true (21:1)
 * meetsContrastAA('#777777', '#FFFFFF');        // false (~4.47 < 4.5)
 * meetsContrastAA('#777777', '#FFFFFF', true);  // true (texto grande)
 */
export const meetsContrastAA = (
    foreground: string,
    background: string,
    isLargeText = false
): boolean => {
    const ratio = getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Verifica si el contraste cumple con WCAG AAA.
 * Texto normal: >= 7:1 | Texto grande: >= 4.5:1
 *
 * @param foreground - Color del texto
 * @param background - Color del fondo
 * @param isLargeText - Si es texto grande
 * @returns true si cumple WCAG AAA
 *
 * @example
 * meetsContrastAAA('#000000', '#FFFFFF');  // true (21:1 >= 7)
 * meetsContrastAAA('#666666', '#FFFFFF');  // false (~5.74 < 7)
 */
export const meetsContrastAAA = (
    foreground: string,
    background: string,
    isLargeText = false
): boolean => {
    const ratio = getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
};

/**
 * Calcula el color de texto óptimo (claro u oscuro) para un fondo dado.
 *
 * @param backgroundColor - Color de fondo hexadecimal
 * @param lightColor - Color claro a usar (default blanco)
 * @param darkColor - Color oscuro a usar (default casi negro)
 * @returns El color que ofrece mejor contraste
 *
 * @example
 * getContrastColor('#4357AD');  // '#FFFFFF' (blanco sobre azul oscuro)
 * getContrastColor('#D4B483');  // '#1A1A1A' (oscuro sobre amarillo claro)
 */
export const getContrastColor = (
    backgroundColor: string,
    lightColor = '#FFFFFF',
    darkColor = '#1A1A1A'
): string => {
    const lightContrast = getContrastRatio(lightColor, backgroundColor);
    const darkContrast = getContrastRatio(darkColor, backgroundColor);
    return lightContrast > darkContrast ? lightColor : darkColor;
};

/**
 * Ajusta un color de texto para garantizar contraste WCAG AA.
 * Usa búsqueda binaria O(log n) para encontrar la luminosidad óptima.
 *
 * @param textColor - Color de texto original
 * @param backgroundColor - Color de fondo
 * @param minRatio - Ratio mínimo requerido (default 4.5 para AA)
 * @returns Color ajustado que cumple el contraste mínimo
 *
 * @example
 * ensureContrast('#888888', '#FFFFFF');  // Gris más oscuro que cumple 4.5:1
 * ensureContrast('#000000', '#FFFFFF');  // '#000000' (ya cumple 21:1)
 */
export const ensureContrast = (
    textColor: string,
    backgroundColor: string,
    minRatio = 4.5
): string => {
    const currentRatio = getContrastRatio(textColor, backgroundColor);
    if (currentRatio >= minRatio) return textColor;

    const bgLuminance = getRelativeLuminance(backgroundColor);
    const shouldDarken = bgLuminance > 0.5;

    let low = shouldDarken ? 0 : 50;
    let high = shouldDarken ? 50 : 100;
    let bestColor = textColor;
    let bestRatio = currentRatio;

    for (let i = 0; i < 15; i++) {
        const mid = (low + high) / 2;
        const testColor = setLightness(textColor, mid);
        const testRatio = getContrastRatio(testColor, backgroundColor);

        if (testRatio >= minRatio) {
            bestColor = testColor;
            bestRatio = testRatio;
            if (shouldDarken) low = mid;
            else high = mid;
        } else {
            if (shouldDarken) high = mid;
            else low = mid;
        }

        if (high - low < 0.5) break;
    }

    if (bestRatio < minRatio) {
        const fallback = shouldDarken ? '#1A1A1A' : '#FFFFFF';
        if (getContrastRatio(fallback, backgroundColor) > bestRatio) return fallback;
    }

    return bestColor;
};

/**
 * Encuentra el mejor color de una lista para usar sobre un fondo dado.
 *
 * @param backgroundColor - Color de fondo hexadecimal
 * @param candidates - Lista de colores candidatos
 * @returns El mejor color y su ratio de contraste
 *
 * @example
 * findBestContrast('#4357AD', ['#FFFFFF', '#000000', '#FFFF00']);
 * // { color: '#FFFFFF', ratio: 5.5 }
 */
export const findBestContrast = (
    backgroundColor: string,
    candidates: string[]
): { color: string; ratio: number } => {
    let best = { color: candidates[0], ratio: 0 };

    for (const color of candidates) {
        const ratio = getContrastRatio(color, backgroundColor);
        if (ratio > best.ratio) best = { color, ratio };
    }

    return best;
};
