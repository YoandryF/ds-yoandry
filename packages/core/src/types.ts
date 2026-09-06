/**
 * @fileoverview Definiciones de tipos TypeScript del Design System Core
 * @module @yoandryf/core/types
 *
 * @author Yoandry
 * @version 4.2.0
 * @created 2026-09-06
 */

// =============================================================================
// TIPOS PRIMITIVOS
// =============================================================================

/** Objeto RGB con valores 0-255 */
export interface RGB {
    r: number;
    g: number;
    b: number;
}

/** Objeto HSL con H(0-360), S(0-100), L(0-100) */
export interface HSL {
    h: number;
    s: number;
    l: number;
}

// =============================================================================
// PALETA
// =============================================================================

/** Paleta de colores de entrada */
export interface BrandPalette {
    primary: string;
    secondary: string;
    background: string;
    warning: string;
    danger: string;
    success?: string;
}

/** Paleta completa (con success siempre presente) */
export type FullPalette = Required<BrandPalette>;

// =============================================================================
// ESCALAS
// =============================================================================

/** Escala de grises estilo Tailwind */
export interface GrayScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}

/** Escala de opacidades */
export interface AlphaScale {
    5: string;
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;
    60: string;
    70: string;
    80: string;
    90: string;
}

// =============================================================================
// VARIANTES Y COLORES
// =============================================================================

/** Variantes de un color para estados de UI */
export interface ColorVariants {
    /** 15% más claro - estado hover */
    light: string;
    /** Color original - estado normal */
    main: string;
    /** 12% más oscuro - estado pressed/active */
    dark: string;
    /** Mezclado con background - estado disabled */
    disabled: string;
}

/** Colores semánticos de texto */
export interface TextColors {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    onPrimary: string;
    onSecondary: string;
    onDanger: string;
    onWarning: string;
    onSuccess: string;
}

/** Colores de superficie para modo claro */
export interface SurfaceColors {
    background: string;
    surface: string;
    surfaceHover: string;
    surfaceActive: string;
    elevated: string;
}

/** Colores para modo oscuro */
export interface DarkModeColors {
    background: string;
    surface: string;
    surfaceHover: string;
    surfaceActive: string;
    elevated: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    divider: string;
}

/** Colores con escalas de opacidad */
export interface AlphaColors {
    black: AlphaScale;
    white: AlphaScale;
    primary: AlphaScale;
}

/** Todos los colores del Design System */
export interface DesignSystemColors {
    brand: FullPalette;
    gray: GrayScale;
    variants: {
        primary: ColorVariants;
        secondary: ColorVariants;
        danger: ColorVariants;
        warning: ColorVariants;
        success: ColorVariants;
    };
    text: TextColors;
    surface: SurfaceColors;
    dark: DarkModeColors;
    alpha: AlphaColors;
}

// =============================================================================
// SOMBRAS Y PLATAFORMA
// =============================================================================

/** Propiedades de sombra por plataforma */
export interface ShadowStyle {
    shadowOpacity?: number;
    shadowRadius?: number;
    shadowOffset?: { width: number; height: number };
    shadowColor?: string;
    elevation?: number;
}

/** Sombras predefinidas */
export interface PlatformShadows {
    none: ShadowStyle;
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
    xl: ShadowStyle;
}

/** Feedback táctil por plataforma */
export interface PlatformFeedback {
    ripple: { color: string; borderless: boolean } | null;
    highlight: { underlayColor: string } | null;
}

/** Utilidades específicas por plataforma */
export interface PlatformSpecific {
    shadow: PlatformShadows;
    feedback: {
        primary: PlatformFeedback;
        secondary: PlatformFeedback;
        danger: PlatformFeedback;
    };
    color: (options: { ios: string; android: string; default?: string }) => string;
}

// =============================================================================
// DESIGN SYSTEM
// =============================================================================

/** Sistema de diseño completo */
export interface DesignSystem {
    colors: DesignSystemColors;
    platform: PlatformSpecific;
}

/** Opciones para createDesignSystem */
export interface CreateDesignSystemOptions {
    skipCache?: boolean;
}
