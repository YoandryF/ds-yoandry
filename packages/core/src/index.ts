/**
 * @fileoverview Design System Core - Framework agnostic
 * @module @ds-yoandry/core
 * @description Sistema de diseño completo agnóstico de framework.
 * Incluye conversión de colores, accesibilidad WCAG, generadores
 * de escalas y variantes, y utilidades de plataforma.
 *
 * @author Yoandry
 * @version 4.2.0
 *
 * @example
 * import { createDesignSystem, DEFAULT_PALETTE } from '@ds-yoandry/core';
 *
 * const system = createDesignSystem({
 *     primary: '#4357AD',
 *     secondary: '#48A9A6',
 *     background: '#E4DFDA',
 *     warning: '#D4B483',
 *     danger: '#C1666B',
 * });
 *
 * system.colors.variants.primary.main  // '#4357AD'
 * system.colors.text.onPrimary         // '#FFFFFF' (WCAG AA garantizado)
 * system.colors.gray[500]              // Gris medio
 */

// =============================================================================
// FUNCIÓN PRINCIPAL
// =============================================================================

export { createDesignSystem } from './createDesignSystem';

// =============================================================================
// PALETA POR DEFECTO
// =============================================================================

export { DEFAULT_PALETTE } from './palette';

// =============================================================================
// TIPOS
// =============================================================================

export type {
    RGB,
    HSL,
    BrandPalette,
    FullPalette,
    GrayScale,
    AlphaScale,
    ColorVariants,
    TextColors,
    SurfaceColors,
    DarkModeColors,
    AlphaColors,
    DesignSystemColors,
    ShadowStyle,
    PlatformShadows,
    PlatformFeedback,
    PlatformSpecific,
    DesignSystem,
    CreateDesignSystemOptions,
} from './types';

// =============================================================================
// CONVERSORES
// =============================================================================

export { hexToRgb, rgbToHex, hexToRgba, rgbToHsl, hslToRgb } from './converters';

// =============================================================================
// MANIPULADORES
// =============================================================================

export {
    setLightness,
    setSaturation,
    lighten,
    darken,
    saturate,
    desaturate,
    adjustHue,
    mix,
    complement,
    invert,
    supportsColorMix,
    mixWithNative,
} from './manipulators';

// =============================================================================
// ACCESIBILIDAD
// =============================================================================

export {
    getRelativeLuminance,
    getContrastRatio,
    meetsContrastAA,
    meetsContrastAAA,
    getContrastColor,
    ensureContrast,
    findBestContrast,
} from './accessibility';

// =============================================================================
// GENERADORES
// =============================================================================

export {
    generateGrayScale,
    generateColorVariants,
    generateAlphaScale,
    generateSuccessColor,
} from './generators';

// =============================================================================
// VALIDADORES
// =============================================================================

export { isValidHex, normalizeHex } from './validators';

// =============================================================================
// CACHÉ
// =============================================================================

export { clearDesignSystemCache, getCacheStats } from './cache';

// =============================================================================
// PLATAFORMA
// =============================================================================

export { generatePlatformShadows, generatePlatformFeedback } from './platform';
