/**
 * @fileoverview Sistema de caché y memoización para Design System
 * @module @ds-yoandry/core/cache
 * @description Proporciona funcionalidades de caché para evitar recalcular
 * sistemas de diseño con la misma paleta de colores.
 *
 * @author Yoandry
 * @version 4.2.0
 * @created 2026-09-06
 */

import type { DesignSystem } from './types';

/**
 * Caché para sistemas de diseño generados.
 * Evita recalcular el mismo sistema múltiples veces.
 */
export const designSystemCache = new Map<string, DesignSystem>();

/**
 * Genera una clave única para una paleta de colores y opciones.
 * Se usa para identificar sistemas en caché.
 *
 * @param palette - Paleta de colores
 * @param options - Opciones de generación
 * @returns Clave única basada en los colores y opciones
 *
 * @example
 * const key = generateCacheKey({
 *     primary: '#4357AD',
 *     secondary: '#48A9A6',
 *     background: '#E4DFDA',
 *     warning: '#D4B483',
 *     danger: '#C1666B',
 * });
 * // 'background:#E4DFDA|danger:#C1666B|primary:#4357AD|secondary:#48A9A6|warning:#D4B483'
 *
 * @example
 * // Con opciones adicionales
 * const keyWithOptions = generateCacheKey(palette, { customOption: true });
 * // 'background:#E4DFDA|...|warning:#D4B483::{"customOption":true}'
 */
export const generateCacheKey = (
    palette: Record<string, string>,
    options: Record<string, unknown> = {}
): string => {
    const paletteKey = Object.entries(palette)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${value}`)
        .join('|');

    const { skipCache, ...relevantOptions } = options;
    const optionsKey = Object.keys(relevantOptions).length > 0
        ? `::${JSON.stringify(relevantOptions)}`
        : '';

    return paletteKey + optionsKey;
};

/**
 * Limpia la caché de sistemas de diseño.
 * Útil para liberar memoria o forzar regeneración.
 *
 * @example
 * clearDesignSystemCache();
 */
export const clearDesignSystemCache = (): void => {
    designSystemCache.clear();
};

/**
 * Obtiene estadísticas de la caché.
 *
 * @returns Objeto con tamaño y claves en caché
 *
 * @example
 * const stats = getCacheStats();
 * console.log(`Sistemas en caché: ${stats.size}`);
 */
export const getCacheStats = (): { size: number; keys: string[] } => ({
    size: designSystemCache.size,
    keys: Array.from(designSystemCache.keys()),
});
