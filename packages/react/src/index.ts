/**
 * @fileoverview Design System para React y React Native
 * @module @ds-yoandry/react
 * @description Bindings de React/React Native para el Design System.
 * Incluye ThemeProvider, useTheme y hooks auxiliares.
 *
 * @author Yoandry
 * @version 4.2.0
 *
 * @example
 * // 1. Envolver la app
 * import { ThemeProvider } from '@ds-yoandry/react';
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
 * import { useTheme } from '@ds-yoandry/react';
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

export * from '@ds-yoandry/core';

// =============================================================================
// PROVIDER Y CONTEXT
// =============================================================================

export { ThemeProvider, ThemeContext } from './ThemeContext';
export type { ThemeMode, ThemeContextValue, ThemeProviderProps } from './ThemeContext';

// =============================================================================
// HOOKS
// =============================================================================

export { useTheme, useColors, useShadow, useIsDark } from './useTheme';
