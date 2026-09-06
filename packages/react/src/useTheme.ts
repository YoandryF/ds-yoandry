/**
 * @fileoverview Hook simplificado para acceder al tema
 * @module @ds-yoandry/react/useTheme
 *
 * @author Yoandry
 * @version 4.2.0
 */

import { useContext, useMemo } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeMode } from './ThemeContext';
import type { PlatformShadows } from '@ds-yoandry/core';

/**
 * Hook para acceder al tema con API simplificada y plana.
 *
 * En vez de navegar estructuras profundas, expone los valores
 * más usados directamente.
 *
 * @throws {Error} Si se usa fuera de ThemeProvider
 *
 * @example
 * // ❌ Antes (navegación profunda)
 * const { colors, platform } = useTheme();
 * colors.surface.background
 * colors.variants.primary.main
 * platform.shadow.md
 *
 * // ✅ Ahora (directo)
 * const { bg, primary, shadow } = useTheme();
 * bg
 * primary
 * shadow.md
 *
 * @example
 * function Card() {
 *     const { bg, text, shadow } = useTheme();
 *
 *     return (
 *         <View style={[{ backgroundColor: bg }, shadow.md]}>
 *             <Text style={{ color: text }}>Contenido</Text>
 *         </View>
 *     );
 * }
 *
 * @example
 * // Toggle de tema
 * function Header() {
 *     const { isDark, toggleTheme, primary } = useTheme();
 *
 *     return (
 *         <TouchableOpacity onPress={toggleTheme}>
 *             <Text style={{ color: primary }}>
 *                 {isDark ? '☀️ Claro' : '🌙 Oscuro'}
 *             </Text>
 *         </TouchableOpacity>
 *     );
 * }
 */
export function useTheme() {
    const ctx = useContext(ThemeContext);

    if (!ctx) {
        throw new Error(
            '[useTheme] debe usarse dentro de un <ThemeProvider>.\n\n' +
            'Envuelve tu app en app/_layout.tsx:\n\n' +
            'import { ThemeProvider } from "@ds-yoandry/react";\n\n' +
            '<ThemeProvider defaultTheme="system">\n' +
            '    <Stack />\n' +
            '</ThemeProvider>'
        );
    }

    const { colors, platform, isDark, themeMode, setThemeMode, toggleTheme, designSystem } = ctx;
    const gray = colors.gray as Record<number, string>;

    return useMemo(() => ({
        // -----------------------------------------------------------------------
        // FONDOS
        // -----------------------------------------------------------------------
        /** Fondo principal de la app */
        bg: colors.surface.background,
        /** Surface para cards y modales */
        surface: colors.surface.surface,
        /** Surface elevada (dropdowns, tooltips) */
        surfaceElevated: colors.surface.elevated,
        /** Surface en estado hover */
        surfaceHover: colors.surface.surfaceHover,

        // -----------------------------------------------------------------------
        // TEXTO
        // -----------------------------------------------------------------------
        /** Texto principal */
        text: colors.text.primary,
        /** Texto secundario */
        textSecondary: colors.text.secondary,
        /** Texto terciario / placeholder */
        textMuted: colors.text.tertiary,
        /** Texto deshabilitado */
        textDisabled: colors.text.disabled,

        // -----------------------------------------------------------------------
        // COLORES DE MARCA
        // -----------------------------------------------------------------------
        primary: colors.variants.primary.main,
        primaryLight: colors.variants.primary.light,
        primaryDark: colors.variants.primary.dark,

        secondary: colors.variants.secondary.main,
        secondaryLight: colors.variants.secondary.light,

        danger: colors.variants.danger.main,
        dangerLight: colors.variants.danger.light,

        success: colors.variants.success.main,
        successLight: colors.variants.success.light,

        warning: colors.variants.warning.main,
        warningLight: colors.variants.warning.light,

        // -----------------------------------------------------------------------
        // TEXTO SOBRE COLORES (para botones)
        // -----------------------------------------------------------------------
        onPrimary: colors.text.onPrimary,
        onSecondary: colors.text.onSecondary,
        onDanger: colors.text.onDanger,
        onSuccess: colors.text.onSuccess,
        onWarning: colors.text.onWarning,

        // -----------------------------------------------------------------------
        // UTILIDADES
        // -----------------------------------------------------------------------
        /** Escala completa de grises: gray[100], gray[500], etc. */
        gray,
        /** Color para bordes sutiles */
        border: gray[200],
        /** Color para bordes más pronunciados */
        borderDark: gray[300],
        /** Color para líneas divisoras (adapta a dark/light) */
        divider: isDark ? gray[700] : gray[200],

        // -----------------------------------------------------------------------
        // SOMBRAS (ya resueltas por plataforma en el binding de RN)
        // -----------------------------------------------------------------------
        /** Sombras: shadow.sm, shadow.md, shadow.lg, shadow.xl */
        shadow: platform.shadow as PlatformShadows,

        // -----------------------------------------------------------------------
        // CONTROL DE TEMA
        // -----------------------------------------------------------------------
        /** true si el tema actual es oscuro */
        isDark,
        /** Modo actual: 'light' | 'dark' | 'system' */
        themeMode,
        /** Cambiar modo: setTheme('dark') */
        setTheme: setThemeMode,
        /** Alternar entre claro y oscuro */
        toggleTheme,

        // -----------------------------------------------------------------------
        // ACCESO COMPLETO (para casos avanzados)
        // -----------------------------------------------------------------------
        /** Todos los colores organizados */
        colors,
        /** Utilidades de plataforma completas */
        platform,
        /** Design System completo */
        designSystem,

    }), [colors, platform, isDark, themeMode, setThemeMode, toggleTheme, designSystem, gray]);
}

/**
 * Hook minimalista - solo colores esenciales.
 *
 * @example
 * const { bg, text, primary, danger, success } = useColors();
 */
export function useColors() {
    const { bg, surface, text, textSecondary, primary, secondary, danger, success, warning, gray, border } = useTheme();
    return { bg, surface, text, textSecondary, primary, secondary, danger, success, warning, gray, border };
}

/**
 * Hook para acceder solo a las sombras.
 *
 * @example
 * const shadow = useShadow();
 * <View style={shadow.md} />
 */
export function useShadow() {
    const { shadow } = useTheme();
    return shadow;
}

/**
 * Hook para el estado dark/light.
 *
 * @example
 * const isDark = useIsDark();
 * const icon = isDark ? '🌙' : '☀️';
 */
export function useIsDark(): boolean {
    const { isDark } = useTheme();
    return isDark;
}
