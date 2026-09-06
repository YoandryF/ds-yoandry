/**
 * @fileoverview Context y Provider para el sistema de temas
 * @module @ds-yoandry/react/ThemeContext
 *
 * @author Yoandry
 * @version 4.2.0
 */

import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDesignSystem } from '@ds-yoandry/core';
import { DEFAULT_PALETTE } from '@ds-yoandry/core';
import type { BrandPalette } from '@ds-yoandry/core';

// =============================================================================
// TIPOS
// =============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
    colors: ReturnType<typeof createDesignSystem>['colors'];
    platform: ReturnType<typeof createDesignSystem>['platform'];
    isDark: boolean;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
    designSystem: ReturnType<typeof createDesignSystem>;
}

export interface ThemeProviderProps {
    children: React.ReactNode;
    /** Tema inicial: 'light' | 'dark' | 'system' (default: 'system') */
    defaultTheme?: ThemeMode;
    /** Paleta personalizada (opcional) */
    palette?: BrandPalette;
    /** Key para AsyncStorage (default: '@ds_theme') */
    storageKey?: string;
}

// =============================================================================
// CONTEXT
// =============================================================================

export const ThemeContext = createContext<ThemeContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

/**
 * Provider que envuelve la app y proporciona acceso al tema.
 *
 * - Detecta preferencia del sistema automáticamente
 * - Persiste la selección en AsyncStorage
 * - Re-renderiza componentes cuando cambia el tema
 * - Soporta paletas personalizadas
 *
 * @example
 * // En _layout.tsx (Expo Router) o App.tsx
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
 * // Con paleta personalizada
 * <ThemeProvider
 *     palette={{
 *         primary: '#FF6B35',
 *         secondary: '#004E89',
 *         background: '#F5F5F5',
 *         warning: '#FFD166',
 *         danger: '#EF476F',
 *     }}
 * >
 *     {children}
 * </ThemeProvider>
 */
export function ThemeProvider({
    children,
    defaultTheme = 'system',
    palette = DEFAULT_PALETTE,
    storageKey = '@ds_theme',
}: ThemeProviderProps) {
    const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultTheme);
    const [isLoaded, setIsLoaded] = useState(false);

    const systemColorScheme = useColorScheme();
    const designSystem = useMemo(() => createDesignSystem(palette), [palette]);

    const isDark = useMemo(() => {
        if (themeMode === 'system') return systemColorScheme === 'dark';
        return themeMode === 'dark';
    }, [themeMode, systemColorScheme]);

    // Colores resueltos según modo claro/oscuro
    const colors = useMemo(() => {
        const { colors: ds } = designSystem;

        if (isDark) {
            return {
                ...ds,
                text: {
                    primary: ds.dark.textPrimary,
                    secondary: ds.dark.textSecondary,
                    tertiary: ds.dark.textTertiary,
                    disabled: ds.gray[500],
                    onPrimary: ds.text.onPrimary,
                    onSecondary: ds.text.onSecondary,
                    onDanger: ds.text.onDanger,
                    onWarning: ds.text.onWarning,
                    onSuccess: ds.text.onSuccess,
                },
                surface: {
                    background: ds.dark.background,
                    surface: ds.dark.surface,
                    surfaceHover: ds.dark.surfaceHover,
                    surfaceActive: ds.dark.surfaceActive,
                    elevated: ds.dark.elevated,
                },
            };
        }

        return ds;
    }, [designSystem, isDark]);

    // Cargar tema guardado
    useEffect(() => {
        const load = async () => {
            try {
                const saved = await AsyncStorage.getItem(storageKey);
                if (saved && ['light', 'dark', 'system'].includes(saved)) {
                    setThemeModeState(saved as ThemeMode);
                }
            } catch {
                // Continuar con el tema por defecto
            } finally {
                setIsLoaded(true);
            }
        };
        load();
    }, [storageKey]);

    const setThemeMode = useCallback(async (mode: ThemeMode) => {
        setThemeModeState(mode);
        try {
            await AsyncStorage.setItem(storageKey, mode);
        } catch {
            // Fallar silenciosamente
        }
    }, [storageKey]);

    const toggleTheme = useCallback(() => {
        setThemeMode(isDark ? 'light' : 'dark');
    }, [isDark, setThemeMode]);

    const contextValue = useMemo((): ThemeContextValue => ({
        colors,
        platform: designSystem.platform,
        isDark,
        themeMode,
        setThemeMode,
        toggleTheme,
        designSystem,
    }), [colors, designSystem, isDark, themeMode, setThemeMode, toggleTheme]);

    // Evitar flash de tema incorrecto mientras carga
    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}
