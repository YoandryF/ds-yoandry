/**
 * @fileoverview Utilidades de sombras y feedback por plataforma
 * @module @ds-yoandry/core/platform
 * @description Genera definiciones de sombras y feedback táctil.
 * Los valores son platform-agnostic en el core - el binding de React Native
 * aplica Platform.select() al consumirlos.
 *
 * @author Yoandry
 * @version 4.2.0
 * @created 2026-09-06
 */

import type { PlatformShadows, PlatformFeedback, ShadowStyle } from './types';
import { hexToRgba } from './converters';

/**
 * Definiciones de sombra para iOS.
 * @internal
 */
const iosShadow = (
    opacity: number,
    radius: number,
    offsetY: number,
    color: string
): ShadowStyle => ({
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: offsetY },
    shadowColor: color,
});

/**
 * Genera definiciones de sombra para iOS y Android.
 * El binding de React Native aplica Platform.select() para elegir la correcta.
 *
 * @param shadowColor - Color base para la sombra
 * @returns Objeto con sombras none, sm, md, lg, xl
 *
 * @example
 * const shadows = generatePlatformShadows('#000000');
 * // shadows.sm.ios    → { shadowOpacity: 0.1, shadowRadius: 2, ... }
 * // shadows.sm.android → { elevation: 2 }
 */
export const generatePlatformShadows = (shadowColor: string): {
    none: { ios: ShadowStyle; android: ShadowStyle };
    sm: { ios: ShadowStyle; android: ShadowStyle };
    md: { ios: ShadowStyle; android: ShadowStyle };
    lg: { ios: ShadowStyle; android: ShadowStyle };
    xl: { ios: ShadowStyle; android: ShadowStyle };
} => ({
    none: {
        ios: iosShadow(0, 0, 0, shadowColor),
        android: { elevation: 0 },
    },
    sm: {
        ios: iosShadow(0.1, 2, 1, shadowColor),
        android: { elevation: 2 },
    },
    md: {
        ios: iosShadow(0.15, 4, 2, shadowColor),
        android: { elevation: 4 },
    },
    lg: {
        ios: iosShadow(0.2, 8, 4, shadowColor),
        android: { elevation: 8 },
    },
    xl: {
        ios: iosShadow(0.25, 16, 8, shadowColor),
        android: { elevation: 16 },
    },
});

/**
 * Genera configuración de feedback táctil (ripple/highlight) para un color.
 *
 * @param color - Color base para el efecto
 * @returns Configuración de ripple (Android) y highlight (iOS)
 *
 * @example
 * const feedback = generatePlatformFeedback('#4357AD');
 * // feedback.ripple    → { color: 'rgba(67,87,173,0.2)', borderless: false }
 * // feedback.highlight → { underlayColor: 'rgba(67,87,173,0.1)' }
 */
export const generatePlatformFeedback = (color: string): PlatformFeedback => ({
    ripple: {
        color: hexToRgba(color, 0.2),
        borderless: false,
    },
    highlight: {
        underlayColor: hexToRgba(color, 0.1),
    },
});
