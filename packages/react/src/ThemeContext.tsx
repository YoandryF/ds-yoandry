/**
 * @fileoverview Context y Provider para el sistema de temas
 * @module @yoandryf/react/ThemeContext
 *
 * @author Yoandry
 * @version 4.3.0
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
import { createDesignSystem } from '@yoandryf/core';
import { DEFAULT_PALETTE } from '@yoandryf/core';
import type { BrandPalette } from '@yoandryf/core';

// =============================================================================
// PALETAS PREDEFINIDAS
// =============================================================================

/**
 * Paletas de colores incluidas en el paquete.
 * El usuario puede elegir entre ellas en runtime o definir las suyas.
 */
export const PALETTES = {
    default: {
        primary: '#4357AD',
        secondary: '#48A9A6',
        background: '#E4DFDA',
        warning: '#D4B483',
        danger: '#C1666B',
        success: '#22C55E',
    },
    ocean: {
        primary: '#0077B6',
        secondary: '#00B4D8',
        background: '#CAF0F8',
        warning: '#FFB703',
        danger: '#E63946',
        success: '#06D6A0',
    },
    forest: {
        primary: '#2D6A4F',
        secondary: '#40916C',
        background: '#F0F4F0',
        warning: '#E9C46A',
        danger: '#BC4749',
        success: '#52B788',
    },
    sunset: {
        primary: '#FF6B35',
        secondary: '#F7C59F',
        background: '#FFFAF5',
        warning: '#FFD166',
        danger: '#EF476F',
        success: '#06D6A0',
    },
} as const satisfies Record<string, Required<BrandPalette>>;

/** Nombres de las paletas incluidas */
export type PaletteName = keyof typeof PALETTES;

/**
 * Metadatos de una paleta para construir selectores en la UI.
 */
export interface PaletteInfo {
    /** Identificador de la paleta */
    name: PaletteName;
    /** Etiqueta legible para mostrar al usuario */
    label: string;
    /** Color representativo para previsualización (el primary) */
    swatch: string;
}

/** Lista de paletas disponibles con metadatos */
export const AVAILABLE_PALETTES: PaletteInfo[] = [
    { name: 'default', label: 'Clásico',    swatch: PALETTES.default.primary },
    { name: 'ocean',   label: 'Océano',     swatch: PALETTES.ocean.primary },
    { name: 'forest',  label: 'Bosque',     swatch: PALETTES.forest.primary },
    { name: 'sunset',  label: 'Atardecer',  swatch: PALETTES.sunset.primary },
];

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
    /** Nombre de la paleta activa */
    paletteName: PaletteName;
    /** Cambiar la paleta activa (persiste en AsyncStorage) */
    setPalette: (name: PaletteName) => void;
    /** Lista de paletas disponibles para construir selectores */
    availablePalettes: PaletteInfo[];
    designSystem: ReturnType<typeof createDesignSystem>;
}

export interface ThemeProviderProps {
    children: React.ReactNode;
    /** Tema inicial: 'light' | 'dark' | 'system' — default: 'system' */
    defaultTheme?: ThemeMode;
    /** Paleta inicial por nombre — default: 'default' */
    defaultPalette?: PaletteName;
    /**
     * Paleta completamente personalizada.
     * Si se pasa, ignora `defaultPalette` y el selector de paletas.
     */
    palette?: BrandPalette;
    /** Key AsyncStorage para el modo de tema */
    storageKey?: string;
    /** Key AsyncStorage para la paleta seleccionada */
    paletteStorageKey?: string;
}

// =============================================================================
// CONTEXT
// =============================================================================

export const ThemeContext = createContext<ThemeContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

/**
 * Provider de tema con soporte para múltiples paletas predefinidas.
 *
 * - Detecta preferencia del sistema
 * - Persiste modo y paleta en AsyncStorage
 * - Paleta personalizada tiene prioridad sobre la seleccionada por nombre
 *
 * @example
 * // Modo básico — paleta por defecto, detecta el sistema
 * <ThemeProvider>
 *     <App />
 * </ThemeProvider>
 *
 * @example
 * // Paleta inicial específica
 * <ThemeProvider defaultPalette="ocean" defaultTheme="dark">
 *     <App />
 * </ThemeProvider>
 *
 * @example
 * // Paleta completamente custom
 * <ThemeProvider palette={{ primary: '#FF6B35', ... }}>
 *     <App />
 * </ThemeProvider>
 */
export function ThemeProvider({
    children,
    defaultTheme = 'system',
    defaultPalette = 'default',
    palette,
    storageKey = '@ds_theme',
    paletteStorageKey = '@ds_palette',
}: ThemeProviderProps) {
    const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultTheme);
    const [paletteName, setPaletteNameState] = useState<PaletteName>(defaultPalette);
    const [isLoaded, setIsLoaded] = useState(false);

    const systemColorScheme = useColorScheme();

    // Paleta activa: custom tiene prioridad, si no usa la seleccionada por nombre
    const activePalette = useMemo<BrandPalette>(
        () => palette ?? PALETTES[paletteName],
        [palette, paletteName]
    );

    const designSystem = useMemo(
        () => createDesignSystem(activePalette),
        [activePalette]
    );

    const isDark = useMemo(() => {
        if (themeMode === 'system') return systemColorScheme === 'dark';
        return themeMode === 'dark';
    }, [themeMode, systemColorScheme]);

    // Colores resueltos para el modo actual
    const colors = useMemo(() => {
        const { colors: ds } = designSystem;

        if (isDark) {
            return {
                ...ds,
                text: {
                    primary: ds.dark.textPrimary,
                    secondary: ds.dark.textSecondary,
                    tertiary: ds.dark.textTertiary,
                    disabled: (ds.gray as unknown as Record<number, string>)[500],
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

    // Cargar preferencias guardadas
    useEffect(() => {
        const load = async () => {
            try {
                const [savedTheme, savedPalette] = await Promise.all([
                    AsyncStorage.getItem(storageKey),
                    AsyncStorage.getItem(paletteStorageKey),
                ]);

                if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
                    setThemeModeState(savedTheme as ThemeMode);
                }
                if (savedPalette && savedPalette in PALETTES) {
                    setPaletteNameState(savedPalette as PaletteName);
                }
            } catch {
                // Continuar con los valores por defecto
            } finally {
                setIsLoaded(true);
            }
        };
        load();
    }, [storageKey, paletteStorageKey]);

    const setThemeMode = useCallback(async (mode: ThemeMode) => {
        setThemeModeState(mode);
        try { await AsyncStorage.setItem(storageKey, mode); } catch { /* silent */ }
    }, [storageKey]);

    const setPalette = useCallback(async (name: PaletteName) => {
        setPaletteNameState(name);
        try { await AsyncStorage.setItem(paletteStorageKey, name); } catch { /* silent */ }
    }, [paletteStorageKey]);

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
        paletteName,
        setPalette,
        availablePalettes: AVAILABLE_PALETTES,
        designSystem,
    }), [colors, designSystem, isDark, themeMode, setThemeMode, toggleTheme, paletteName, setPalette]);

    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}
