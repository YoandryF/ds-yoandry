/**
 * @fileoverview Paleta de colores por defecto del Design System
 * @module @yoandryf/core/palette
 *
 * @author Yoandry
 * @version 4.2.0
 * @created 2026-09-06
 */

import type { BrandPalette } from './types';

/**
 * Paleta por defecto basada en Coolors.co.
 *
 * @example
 * import { DEFAULT_PALETTE, createDesignSystem } from '@yoandryf/core';
 *
 * // Usar directamente
 * const system = createDesignSystem(DEFAULT_PALETTE);
 *
 * // Personalizar un color
 * const system = createDesignSystem({
 *     ...DEFAULT_PALETTE,
 *     primary: '#FF6B35',
 * });
 */
export const DEFAULT_PALETTE: Required<BrandPalette> = {
    primary: '#4357AD',      // Ocean Twilight - Azul profundo
    secondary: '#48A9A6',    // Tropical Teal - Verde azulado
    background: '#E4DFDA',   // Dust Grey - Gris cálido
    warning: '#D4B483',      // Soft Fawn - Dorado suave
    danger: '#C1666B',       // Lobster Pink - Rosa coral
    success: '#22C55E',      // Emerald - Verde éxito
};
