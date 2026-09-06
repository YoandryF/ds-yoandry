/**
 * @fileoverview Design System para React y React Native
 * @module @yoandryf/react
 * @description Bindings de React/React Native para el Design System.
 * Incluye ThemeProvider, useTheme y hooks auxiliares.
 *
 * @author Yoandry
 * @version 4.2.0
 *
 * @example
 * // 1. Envolver la app
 * import { ThemeProvider } from '@yoandryf/react';
 *
 * export default function App() {
 *     return (
 *         <ThemeProvider defaultTheme="system">
 *             <YourApp />
 *         </ThemeProvider>
 *     );
 * }
 *
 * @example
 * // 2. Usar en componentes
 * import { useTheme } from '@yoandryf/react';
 *
 * function MyButton() {
 *     const { primary, onPrimary, shadow } = useTheme();
 *
 *     return (
 *         <TouchableOpacity style={[{ backgroundColor: primary }, shadow.sm]}>
 *             <Text style={{ color: onPrimary }}>Presionar</Text>
 *         </TouchableOpacity>
 *     );
 * }
 */

// =============================================================================
// RE-EXPORTAR CORE (todo disponible desde un solo paquete)
// =============================================================================

export * from '@yoandryf/core';

// =============================================================================
// PROVIDER Y CONTEXT
// =============================================================================

export { ThemeProvider, ThemeContext, PALETTES, AVAILABLE_PALETTES } from './ThemeContext';
export type { ThemeMode, ThemeContextValue, ThemeProviderProps, PaletteName, PaletteInfo } from './ThemeContext';

// =============================================================================
// HOOKS
// =============================================================================

export { useTheme, useColors, useShadow, useIsDark } from './useTheme';

// =============================================================================
// COMPONENTES
// =============================================================================

export { PaletteSelector } from './PaletteSelector';
