/**
 * @fileoverview Función principal para crear el sistema de diseño
 * @module @yoandryf/core/createDesignSystem
 * @description Genera un sistema de diseño completo a partir de una paleta de colores.
 *
 * @author Yoandry
 * @version 4.2.0
 * @created 2026-09-06
 */

import type { BrandPalette, DesignSystem, CreateDesignSystemOptions } from './types';
import { designSystemCache, generateCacheKey } from './cache';
import { isValidHex, normalizeHex } from './validators';
import { generateGrayScale, generateColorVariants, generateAlphaScale, generateSuccessColor } from './generators';
import { getContrastColor, ensureContrast } from './accessibility';
import { generatePlatformShadows, generatePlatformFeedback } from './platform';

/**
 * Genera un sistema de diseño completo a partir de una paleta de 5-6 colores.
 *
 * Genera automáticamente:
 * - Escala de grises uniforme (50-900)
 * - Variantes de cada color (light, main, dark, disabled)
 * - Colores de texto con contraste WCAG AA garantizado
 * - Colores de superficie para modo claro y oscuro
 * - Escalas de opacidad para overlays
 * - Color success automático si no se provee
 * - Utilidades de sombras y feedback por plataforma
 *
 * Los resultados se cachean por paleta para evitar recálculos.
 *
 * @param palette - Tu paleta de colores con 5-6 colores
 * @param options - Opciones adicionales
 * @returns Sistema de diseño completo
 *
 * @throws {Error} Si faltan colores requeridos
 * @throws {Error} Si algún color no es un hexadecimal válido
 *
 * @example
 * const system = createDesignSystem({
 *     primary: '#4357AD',
 *     secondary: '#48A9A6',
 *     background: '#E4DFDA',
 *     warning: '#D4B483',
 *     danger: '#C1666B',
 * });
 *
 * @example
 * // Con success personalizado
 * const system = createDesignSystem({
 *     primary: '#2E7D32',
 *     secondary: '#1565C0',
 *     background: '#FAFAFA',
 *     warning: '#F9A825',
 *     danger: '#C62828',
 *     success: '#06D6A0',
 * });
 *
 * @example
 * // Forzar regeneración sin caché
 * const fresh = createDesignSystem(palette, { skipCache: true });
 */
export const createDesignSystem = (
    palette: BrandPalette,
    options: CreateDesignSystemOptions = {}
): DesignSystem => {
    const { skipCache = false } = options;

    // Normalizar colores
    const normalizedPalette: Record<string, string> = {};
    for (const [key, value] of Object.entries(palette)) {
        if (value) normalizedPalette[key] = normalizeHex(value);
    }

    // Verificar caché
    const cacheKey = generateCacheKey(normalizedPalette);
    if (!skipCache && designSystemCache.has(cacheKey)) {
        return designSystemCache.get(cacheKey)!;
    }

    // Validar colores requeridos
    const requiredColors = ['primary', 'secondary', 'background', 'warning', 'danger'] as const;
    const missingColors = requiredColors.filter(c => !normalizedPalette[c]);

    if (missingColors.length > 0) {
        throw new Error(
            `[DesignSystem] Faltan colores requeridos: ${missingColors.join(', ')}. ` +
            `La paleta debe incluir: ${requiredColors.join(', ')}.`
        );
    }

    // Validar formato hex
    const allColorKeys = [...requiredColors, 'success'].filter(c => normalizedPalette[c]);
    const invalidColors = allColorKeys.filter(c => !isValidHex(normalizedPalette[c]));

    if (invalidColors.length > 0) {
        throw new Error(
            `[DesignSystem] Colores con formato inválido: ${invalidColors.join(', ')}. ` +
            `Usa formato hexadecimal de 6 dígitos (ej: '#4357AD').`
        );
    }

    // Generar success si no se provee
    const successColor = normalizedPalette.success || generateSuccessColor(normalizedPalette.secondary);
    const fullPalette: Record<string, string> = { ...normalizedPalette, success: successColor };

    // Escala de grises
    const gray = generateGrayScale(normalizedPalette.background);

    // Helper de texto accesible
    const textOnColor = (bgColor: string): string =>
        ensureContrast(getContrastColor(bgColor), bgColor, 4.5);

    // Sombras (el binding de RN aplica Platform.select)
    const rawShadows = generatePlatformShadows('#000000');

    const designSystem: DesignSystem = {
        colors: {
            brand: {
                primary: fullPalette.primary,
                secondary: fullPalette.secondary,
                background: fullPalette.background,
                warning: fullPalette.warning,
                danger: fullPalette.danger,
                success: fullPalette.success,
            },
            gray,
            variants: {
                primary: generateColorVariants(normalizedPalette.primary, normalizedPalette.background),
                secondary: generateColorVariants(normalizedPalette.secondary, normalizedPalette.background),
                danger: generateColorVariants(normalizedPalette.danger, normalizedPalette.background),
                warning: generateColorVariants(normalizedPalette.warning, normalizedPalette.background),
                success: generateColorVariants(successColor, normalizedPalette.background),
            },
            text: {
                primary: gray[900],
                secondary: gray[700],
                tertiary: gray[600],
                disabled: gray[500],
                onPrimary: textOnColor(normalizedPalette.primary),
                onSecondary: textOnColor(normalizedPalette.secondary),
                onDanger: textOnColor(normalizedPalette.danger),
                onWarning: textOnColor(normalizedPalette.warning),
                onSuccess: textOnColor(successColor),
            },
            surface: {
                background: normalizedPalette.background,
                surface: gray[50],
                surfaceHover: gray[100],
                surfaceActive: gray[200],
                elevated: '#FFFFFF',
            },
            dark: {
                background: gray[900],
                surface: gray[800],
                surfaceHover: gray[700],
                surfaceActive: gray[600],
                elevated: gray[700],
                textPrimary: gray[50],
                textSecondary: gray[300],
                textTertiary: gray[400],
                divider: gray[700],
            },
            alpha: {
                black: generateAlphaScale('#000000'),
                white: generateAlphaScale('#FFFFFF'),
                primary: generateAlphaScale(normalizedPalette.primary),
            },
        },
        platform: {
            // El binding de RN convierte ios/android → Platform.select()
            shadow: rawShadows as unknown as DesignSystem['platform']['shadow'],
            feedback: {
                primary: generatePlatformFeedback(normalizedPalette.primary),
                secondary: generatePlatformFeedback(normalizedPalette.secondary),
                danger: generatePlatformFeedback(normalizedPalette.danger),
            },
            color: ({ ios, android, default: def }) => def ?? ios,
        },
    };

    designSystemCache.set(cacheKey, designSystem);
    return designSystem;
};
