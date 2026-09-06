/**
 * @fileoverview Funciones de validación de colores
 * @module @ds-yoandry/core/validators
 * @description Proporciona utilidades para validar y normalizar colores hexadecimales.
 *
 * @author Yoandry
 * @version 4.2.0
 * @created 2026-09-06
 */

/**
 * Valida que un string sea un color hexadecimal válido de 6 dígitos.
 *
 * @param hex - String a validar
 * @returns true si es un hexadecimal válido de 6 dígitos
 *
 * @example
 * isValidHex('#4357AD');  // true
 * isValidHex('4357AD');   // true
 * isValidHex('#435');     // false (formato corto no soportado)
 * isValidHex('invalid');  // false
 * isValidHex('');         // false
 *
 * @example
 * if (isValidHex(userInput)) {
 *     const system = createDesignSystem({ ...palette, primary: userInput });
 * }
 */
export const isValidHex = (hex: unknown): boolean => {
    if (!hex || typeof hex !== 'string') return false;
    return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(hex);
};

/**
 * Normaliza un color hexadecimal al formato #RRGGBB.
 * Asegura que el color tenga el # al inicio.
 *
 * @param hex - Color hexadecimal (con o sin #)
 * @returns Color normalizado con # al inicio
 *
 * @example
 * normalizeHex('4357AD');   // '#4357AD'
 * normalizeHex('#4357AD');  // '#4357AD'
 * normalizeHex('ffffff');   // '#ffffff'
 */
export const normalizeHex = (hex: string): string => {
    if (!hex) return hex;
    return hex.startsWith('#') ? hex : `#${hex}`;
};
