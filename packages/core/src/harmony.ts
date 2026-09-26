/**
 * @fileoverview Generador de paletas armónicas con colores bloqueados
 * @module @ds-yoandry/core/harmony
 * @description Genera paletas de colores cromáticamente armónicas respetando
 * colores "bloqueados" (colores de marca que no deben cambiar).
 *
 * @author Yoandry
 * @version 4.3.0
 * @created 2026-09-25
 *
 * @example
 * import { suggestHarmonicPalette } from '@ds-yoandry/core';
 *
 * // Tengo mi azul de marca fijo, necesito el resto
 * const suggestions = suggestHarmonicPalette({
 *     locked: { primary: '#4357AD' },
 *     strategy: 'analogous',
 * });
 *
 * // suggestions[0] = paleta completa con el primary bloqueado
 */

import type { BrandPalette, HSL } from './types';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './converters';
import { adjustHue, setLightness, setSaturation } from './manipulators';
import { getContrastRatio, meetsContrastAA } from './accessibility';

// =============================================================================
// TIPOS
// =============================================================================

/**
 * Estrategias de armonía cromática basadas en la rueda de colores.
 *
 * - `analogous`: Colores adyacentes (±30°) — paletas suaves y coherentes
 * - `complementary`: Colores opuestos (180°) — alto contraste visual
 * - `triadic`: Tres colores equidistantes (120°) — balance vibrante
 * - `split-complementary`: Complementario dividido (150° + 210°) — menos agresivo
 * - `tetradic`: Cuatro colores en cuadrado (90°) — paletas complejas
 * - `auto`: Detecta la mejor estrategia según los colores bloqueados
 */
export type HarmonyStrategy =
    | 'analogous'
    | 'complementary'
    | 'triadic'
    | 'split-complementary'
    | 'tetradic'
    | 'auto';

/**
 * Colores que el usuario quiere mantener fijos (de marca).
 * Solo se requiere al menos 1 color bloqueado.
 */
export interface LockedColors {
    primary?: string;
    secondary?: string;
    background?: string;
    warning?: string;
    danger?: string;
    success?: string;
}

/**
 * Una sugerencia de paleta armónica con métricas de calidad.
 */
export interface HarmonicSuggestion extends Required<BrandPalette> {
    /** Puntuación de armonía (0-100). Mayor = más armónico */
    harmonyScore: number;
    /** Puntuación de contraste (0-100). Mayor = mejor accesibilidad */
    contrastScore: number;
    /** Puntuación combinada (0-100) */
    score: number;
    /** ¿Todos los colores de texto pasan WCAG AA? */
    accessibilityPass: boolean;
    /** Estrategia usada para generar esta sugerencia */
    strategy: HarmonyStrategy;
}

/**
 * Opciones para el generador de paletas armónicas.
 */
export interface SuggestHarmonicPaletteOptions {
    /** Colores bloqueados (al menos 1 requerido) */
    locked: LockedColors;
    /** Estrategia de armonía. Default: 'auto' */
    strategy?: HarmonyStrategy;
    /** Número de sugerencias a generar. Default: 3 */
    count?: number;
    /** Filtrar solo paletas que pasen WCAG AA. Default: true */
    ensureAccessibility?: boolean;
    /** Luminosidad objetivo para el background (0-100). Default: 90 */
    backgroundLightness?: number;
}

// =============================================================================
// CONSTANTES
// =============================================================================

/** Ángulos de la rueda cromática para cada estrategia */
const HARMONY_ANGLES: Record<Exclude<HarmonyStrategy, 'auto'>, number[]> = {
    analogous: [-30, 30],
    complementary: [180],
    triadic: [120, 240],
    'split-complementary': [150, 210],
    tetradic: [90, 180, 270],
};

/** Hue ranges para colores semánticos (aproximados) */
const SEMANTIC_HUE_RANGES = {
    warning: { min: 30, max: 60 },    // Amarillo/naranja
    danger: { min: 0, max: 30 },       // Rojo/naranja-rojo (también 330-360)
    success: { min: 90, max: 160 },    // Verde
};

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

/**
 * Obtiene el HSL de un color hex.
 * @internal
 */
const getHsl = (hex: string): HSL | null => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
};

/**
 * Convierte HSL a hex.
 * @internal
 */
const hslToHex = (h: number, s: number, l: number): string => {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
};

/**
 * Normaliza el hue a rango 0-360.
 * @internal
 */
const normalizeHue = (h: number): number => ((h % 360) + 360) % 360;

/**
 * Calcula la distancia angular entre dos hues (0-180).
 * @internal
 */
const hueDistance = (h1: number, h2: number): number => {
    const diff = Math.abs(normalizeHue(h1) - normalizeHue(h2));
    return Math.min(diff, 360 - diff);
};

/**
 * Genera un color con un hue específico, manteniendo saturación y luminosidad razonables.
 * @internal
 */
const generateColorAtHue = (
    targetHue: number,
    baseSaturation: number,
    baseLightness: number
): string => {
    const h = normalizeHue(targetHue);
    // Mantener saturación vibrante pero no extrema (40-75%)
    const s = Math.max(40, Math.min(75, baseSaturation));
    // Mantener luminosidad media (35-55%)
    const l = Math.max(35, Math.min(55, baseLightness));
    return hslToHex(h, s, l);
};

/**
 * Genera un color de background a partir de un color base.
 * @internal
 */
const generateBackground = (baseColor: string, targetLightness: number): string => {
    const hsl = getHsl(baseColor);
    if (!hsl) return '#E4DFDA'; // Fallback

    // Background muy claro, baja saturación
    return hslToHex(hsl.h, Math.min(20, hsl.s * 0.3), targetLightness);
};

/**
 * Genera un color semántico (warning/danger/success) que armonice con la paleta.
 * @internal
 */
const generateSemanticColor = (
    type: 'warning' | 'danger' | 'success',
    baseHue: number,
    baseSaturation: number
): string => {
    const range = SEMANTIC_HUE_RANGES[type];

    // Elegir un hue dentro del rango semántico que esté más cerca del baseHue
    // para mantener cierta armonía
    let targetHue: number;

    if (type === 'danger') {
        // Danger puede ser 0-30 o 330-360
        const distToLow = hueDistance(baseHue, 15);
        const distToHigh = hueDistance(baseHue, 345);
        targetHue = distToLow < distToHigh ? 15 : 350;
    } else {
        // Para warning y success, usar el punto medio del rango
        targetHue = (range.min + range.max) / 2;
    }

    const saturation = Math.max(50, Math.min(70, baseSaturation));
    const lightness = type === 'warning' ? 55 : 45; // Warning más claro para legibilidad

    return hslToHex(targetHue, saturation, lightness);
};

/**
 * Calcula el score de armonía de una paleta (0-100).
 * Basado en qué tan bien los colores siguen relaciones cromáticas.
 * @internal
 */
const calculateHarmonyScore = (palette: Required<BrandPalette>): number => {
    const hues: number[] = [];

    for (const color of [palette.primary, palette.secondary]) {
        const hsl = getHsl(color);
        if (hsl) hues.push(hsl.h);
    }

    if (hues.length < 2) return 50; // No hay suficientes colores para evaluar

    // Calcular qué tan cerca están de relaciones armónicas conocidas
    const distance = hueDistance(hues[0], hues[1]);

    // Ángulos armónicos ideales y sus tolerancias
    const harmonicAngles = [30, 60, 90, 120, 150, 180];
    let minDeviation = 180;

    for (const angle of harmonicAngles) {
        const deviation = Math.abs(distance - angle);
        minDeviation = Math.min(minDeviation, deviation);
    }

    // Convertir desviación a score (0 desviación = 100, 30+ desviación = ~50)
    const harmonyScore = Math.max(0, 100 - (minDeviation * 2));

    return Math.round(harmonyScore);
};

/**
 * Calcula el score de contraste/accesibilidad de una paleta (0-100).
 * @internal
 */
const calculateContrastScore = (palette: Required<BrandPalette>): number => {
    const background = palette.background;
    const colorsToCheck = [
        palette.primary,
        palette.secondary,
        palette.danger,
        palette.warning,
        palette.success,
    ];

    let totalScore = 0;
    let checks = 0;

    for (const color of colorsToCheck) {
        const ratio = getContrastRatio(color, background);
        // Normalizar: ratio de 4.5 (AA) = 70 puntos, 7 (AAA) = 100 puntos
        const normalizedScore = Math.min(100, (ratio / 7) * 100);
        totalScore += normalizedScore;
        checks++;
    }

    // También verificar contraste del texto sobre colores de marca
    for (const color of [palette.primary, palette.secondary, palette.danger]) {
        const whiteRatio = getContrastRatio('#FFFFFF', color);
        const blackRatio = getContrastRatio('#1A1A1A', color);
        const bestRatio = Math.max(whiteRatio, blackRatio);
        const normalizedScore = Math.min(100, (bestRatio / 7) * 100);
        totalScore += normalizedScore;
        checks++;
    }

    return Math.round(totalScore / checks);
};

/**
 * Verifica si todos los colores de texto pasan WCAG AA.
 * @internal
 */
const checkAccessibility = (palette: Required<BrandPalette>): boolean => {
    const background = palette.background;

    // Verificar que haya buen contraste para texto sobre colores de marca
    // Esto es más importante que el contraste color-sobre-background
    for (const color of [palette.primary, palette.secondary, palette.danger]) {
        const whiteRatio = getContrastRatio('#FFFFFF', color);
        const blackRatio = getContrastRatio('#1A1A1A', color);
        // Al menos uno debe tener contraste suficiente para texto (4.5:1)
        if (Math.max(whiteRatio, blackRatio) < 4.5) return false;
    }

    return true;
};

/**
 * Detecta la mejor estrategia basándose en los colores bloqueados.
 * @internal
 */
const detectBestStrategy = (locked: LockedColors): Exclude<HarmonyStrategy, 'auto'> => {
    const lockedHues: number[] = [];

    for (const color of Object.values(locked)) {
        if (color) {
            const hsl = getHsl(color);
            if (hsl) lockedHues.push(hsl.h);
        }
    }

    if (lockedHues.length < 2) {
        // Con 1 solo color, analogous es seguro y versátil
        return 'analogous';
    }

    // Calcular el ángulo entre los primeros dos colores bloqueados
    const angle = hueDistance(lockedHues[0], lockedHues[1]);

    // Detectar qué estrategia se aproxima más
    if (angle >= 165 && angle <= 195) return 'complementary';
    if (angle >= 105 && angle <= 135) return 'triadic';
    if (angle >= 135 && angle <= 165) return 'split-complementary';
    if (angle >= 75 && angle <= 105) return 'tetradic';
    if (angle <= 45) return 'analogous';

    // Default para ángulos intermedios
    return 'split-complementary';
};

// =============================================================================
// GENERADORES POR ESTRATEGIA
// =============================================================================

/**
 * Ajusta un color para mejorar su contraste si es necesario.
 * @internal
 */
const adjustForContrast = (color: string, background: string): string => {
    const ratio = getContrastRatio(color, background);
    if (ratio >= 3) return color; // Ya tiene buen contraste para UI elements

    const hsl = getHsl(color);
    if (!hsl) return color;

    const bgHsl = getHsl(background);
    if (!bgHsl) return color;

    // Si el background es claro, oscurecer el color; si es oscuro, aclararlo
    const targetLightness = bgHsl.l > 50 
        ? Math.max(25, hsl.l - 15) 
        : Math.min(75, hsl.l + 15);

    return hslToHex(hsl.h, hsl.s, targetLightness);
};

/**
 * Genera un color primario a partir de un background o secondary.
 * @internal
 */
const deriveBaseColor = (locked: LockedColors): { color: string; hsl: HSL } | null => {
    // Si tenemos primary, usarlo directamente
    if (locked.primary) {
        const hsl = getHsl(locked.primary);
        if (hsl) return { color: locked.primary, hsl };
    }

    // Si tenemos secondary, usarlo como base
    if (locked.secondary) {
        const hsl = getHsl(locked.secondary);
        if (hsl) return { color: locked.secondary, hsl };
    }

    // Si solo tenemos background, generar un color vibrante complementario
    if (locked.background) {
        const bgHsl = getHsl(locked.background);
        if (bgHsl) {
            // Generar un color con el mismo hue pero más saturado y oscuro
            const h = bgHsl.h;
            const s = Math.max(50, bgHsl.s + 30);
            const l = 45;
            const color = hslToHex(h, s, l);
            return { color, hsl: { h, s, l } };
        }
    }

    // Si tenemos cualquier otro color semántico, derivar de él
    const anyColor = locked.warning ?? locked.danger ?? locked.success;
    if (anyColor) {
        const hsl = getHsl(anyColor);
        if (hsl) return { color: anyColor, hsl };
    }

    return null;
};

/**
 * Genera paletas usando una estrategia específica.
 * @internal
 */
const generateWithStrategy = (
    locked: LockedColors,
    strategy: Exclude<HarmonyStrategy, 'auto'>,
    options: {
        backgroundLightness: number;
        variations: number;
    }
): Required<BrandPalette>[] => {
    const { backgroundLightness, variations } = options;
    const results: Required<BrandPalette>[] = [];

    // Derivar el color base de cualquier color bloqueado disponible
    const baseInfo = deriveBaseColor(locked);
    if (!baseInfo) return results;

    const { hsl: baseHsl } = baseInfo;
    const angles = HARMONY_ANGLES[strategy];

    // Generar variaciones rotando ligeramente el punto de inicio
    for (let v = 0; v < variations; v++) {
        const rotationOffset = v * 12; // Rotar 12° para cada variación

        // Determinar primary
        let primary: string;
        if (locked.primary) {
            primary = locked.primary;
        } else {
            primary = generateColorAtHue(
                baseHsl.h + rotationOffset,
                baseHsl.s,
                baseHsl.l
            );
        }

        // Determinar secondary usando el primer ángulo de la estrategia
        const primaryHsl = getHsl(primary) ?? baseHsl;
        let secondary: string;
        if (locked.secondary) {
            secondary = locked.secondary;
        } else {
            secondary = generateColorAtHue(
                primaryHsl.h + angles[0] + rotationOffset,
                primaryHsl.s,
                primaryHsl.l
            );
        }

        // Background
        const background = locked.background ?? generateBackground(primary, backgroundLightness);

        // Colores semánticos
        const warning = locked.warning ?? generateSemanticColor('warning', primaryHsl.h, primaryHsl.s);
        const danger = locked.danger ?? generateSemanticColor('danger', primaryHsl.h, primaryHsl.s);
        const success = locked.success ?? generateSemanticColor('success', primaryHsl.h, primaryHsl.s);

        // Ajustar primary y secondary para mejor contraste con el background generado
        const adjustedPrimary = locked.primary ? primary : adjustForContrast(primary, background);
        const adjustedSecondary = locked.secondary ? secondary : adjustForContrast(secondary, background);

        results.push({
            primary: adjustedPrimary,
            secondary: adjustedSecondary,
            background,
            warning,
            danger,
            success,
        });
    }

    return results;
};

// =============================================================================
// FUNCIÓN PRINCIPAL
// =============================================================================

/**
 * Genera sugerencias de paletas armónicas respetando colores bloqueados.
 *
 * @param options - Opciones de generación
 * @returns Array de sugerencias ordenadas por score (mejor primero)
 *
 * @throws {Error} Si no hay al menos un color bloqueado
 * @throws {Error} Si algún color bloqueado no es un hexadecimal válido
 *
 * @example
 * // Con un solo color bloqueado
 * const suggestions = suggestHarmonicPalette({
 *     locked: { primary: '#4357AD' },
 * });
 *
 * @example
 * // Con estrategia específica
 * const suggestions = suggestHarmonicPalette({
 *     locked: { primary: '#4357AD', secondary: '#48A9A6' },
 *     strategy: 'complementary',
 *     count: 5,
 * });
 *
 * @example
 * // Sin filtro de accesibilidad (para exploración)
 * const suggestions = suggestHarmonicPalette({
 *     locked: { primary: '#FF0000' },
 *     ensureAccessibility: false,
 * });
 */
export const suggestHarmonicPalette = (
    options: SuggestHarmonicPaletteOptions
): HarmonicSuggestion[] => {
    const {
        locked,
        strategy = 'auto',
        count = 3,
        ensureAccessibility = true,
        backgroundLightness = 90,
    } = options;

    // Validar que hay al menos un color bloqueado
    const lockedColors = Object.values(locked).filter(c => c !== undefined && c !== null);
    if (lockedColors.length === 0) {
        throw new Error(
            '[Harmony] Se requiere al menos un color bloqueado. ' +
            'Proporciona primary, secondary, background, warning, danger o success.'
        );
    }

    // Validar formato de colores bloqueados
    for (const [key, color] of Object.entries(locked)) {
        if (color && !getHsl(color)) {
            throw new Error(
                `[Harmony] Color bloqueado inválido: ${key}='${color}'. ` +
                `Usa formato hexadecimal de 6 dígitos (ej: '#4357AD').`
            );
        }
    }

    // Determinar estrategia(s) a usar
    const strategiesToTry: Exclude<HarmonyStrategy, 'auto'>[] =
        strategy === 'auto'
            ? ['analogous', 'complementary', 'triadic', 'split-complementary', 'tetradic']
            : [strategy];

    // Generar paletas candidatas
    const candidates: HarmonicSuggestion[] = [];

    for (const strat of strategiesToTry) {
        const palettes = generateWithStrategy(locked, strat, {
            backgroundLightness,
            variations: strategy === 'auto' ? 2 : Math.ceil(count / strategiesToTry.length) + 1,
        });

        for (const palette of palettes) {
            const harmonyScore = calculateHarmonyScore(palette);
            const contrastScore = calculateContrastScore(palette);
            const accessibilityPass = checkAccessibility(palette);

            // Filtrar por accesibilidad si está habilitado
            if (ensureAccessibility && !accessibilityPass) continue;

            // Score combinado (60% armonía, 40% contraste)
            const score = Math.round(harmonyScore * 0.6 + contrastScore * 0.4);

            candidates.push({
                ...palette,
                harmonyScore,
                contrastScore,
                score,
                accessibilityPass,
                strategy: strat,
            });
        }
    }

    // Ordenar por score descendente
    candidates.sort((a, b) => b.score - a.score);

    // Eliminar duplicados (paletas muy similares)
    const unique: HarmonicSuggestion[] = [];
    for (const candidate of candidates) {
        const isDuplicate = unique.some(existing => {
            // Considerar duplicado si primary y secondary son iguales
            return existing.primary === candidate.primary &&
                   existing.secondary === candidate.secondary;
        });
        if (!isDuplicate) {
            unique.push(candidate);
        }
        if (unique.length >= count) break;
    }

    return unique;
};

// =============================================================================
// FUNCIONES AUXILIARES EXPORTADAS
// =============================================================================

/**
 * Genera colores armónicos a partir de un color base usando una estrategia específica.
 * Versión simplificada de suggestHarmonicPalette para casos de uso básicos.
 *
 * @param baseColor - Color hexadecimal base
 * @param strategy - Estrategia de armonía
 * @returns Array de colores armónicos (incluyendo el base)
 *
 * @example
 * const colors = getHarmonicColors('#4357AD', 'triadic');
 * // ['#4357AD', '#57AD43', '#AD4357'] (aproximado)
 */
export const getHarmonicColors = (
    baseColor: string,
    strategy: Exclude<HarmonyStrategy, 'auto'>
): string[] => {
    const hsl = getHsl(baseColor);
    if (!hsl) return [baseColor];

    const angles = HARMONY_ANGLES[strategy];
    const colors = [baseColor];

    for (const angle of angles) {
        colors.push(adjustHue(baseColor, angle));
    }

    return colors;
};

/**
 * Detecta qué estrategia de armonía se aproxima más a un conjunto de colores existente.
 *
 * @param colors - Array de colores hexadecimales (mínimo 2)
 * @returns Estrategia detectada y confianza (0-100)
 *
 * @example
 * const { strategy, confidence } = detectHarmonyStrategy(['#4357AD', '#AD5743']);
 * // { strategy: 'complementary', confidence: 92 }
 */
export const detectHarmonyStrategy = (
    colors: string[]
): { strategy: Exclude<HarmonyStrategy, 'auto'>; confidence: number } => {
    if (colors.length < 2) {
        return { strategy: 'analogous', confidence: 0 };
    }

    const hues = colors
        .map(c => getHsl(c))
        .filter((hsl): hsl is HSL => hsl !== null)
        .map(hsl => hsl.h);

    if (hues.length < 2) {
        return { strategy: 'analogous', confidence: 0 };
    }

    // Calcular ángulo promedio entre colores consecutivos
    const angle = hueDistance(hues[0], hues[1]);

    // Encontrar la estrategia más cercana
    let bestStrategy: Exclude<HarmonyStrategy, 'auto'> = 'analogous';
    let bestDeviation = 180;

    const strategyAngles: [Exclude<HarmonyStrategy, 'auto'>, number][] = [
        ['analogous', 30],
        ['complementary', 180],
        ['triadic', 120],
        ['split-complementary', 150],
        ['tetradic', 90],
    ];

    for (const [strat, targetAngle] of strategyAngles) {
        const deviation = Math.abs(angle - targetAngle);
        if (deviation < bestDeviation) {
            bestDeviation = deviation;
            bestStrategy = strat;
        }
    }

    // Calcular confianza (0 desviación = 100%, 30° desviación = ~50%)
    const confidence = Math.max(0, Math.round(100 - (bestDeviation * 2)));

    return { strategy: bestStrategy, confidence };
};
