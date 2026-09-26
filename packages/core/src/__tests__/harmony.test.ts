/**
 * @fileoverview Tests para harmony.ts
 * @module @ds-yoandry/core/__tests__/harmony
 */

import {
    suggestHarmonicPalette,
    getHarmonicColors,
    detectHarmonyStrategy,
    type HarmonyStrategy,
    type LockedColors,
    type HarmonicSuggestion,
} from '../harmony';

// =============================================================================
// suggestHarmonicPalette
// =============================================================================

describe('suggestHarmonicPalette', () => {
    describe('validación de entrada', () => {
        it('lanza error si no hay colores bloqueados', () => {
            expect(() => suggestHarmonicPalette({ locked: {} }))
                .toThrow('[Harmony] Se requiere al menos un color bloqueado');
        });

        it('lanza error si el color bloqueado es inválido', () => {
            expect(() => suggestHarmonicPalette({ locked: { primary: 'invalid' } }))
                .toThrow('[Harmony] Color bloqueado inválido');
        });

        it('lanza error si algún color bloqueado tiene formato incorrecto', () => {
            expect(() => suggestHarmonicPalette({ 
                locked: { primary: '#4357AD', secondary: 'not-a-color' } 
            })).toThrow('[Harmony] Color bloqueado inválido');
        });
    });

    describe('con un solo color bloqueado', () => {
        it('genera paleta completa con primary bloqueado', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
            });

            expect(suggestions.length).toBeGreaterThan(0);
            expect(suggestions[0].primary).toBe('#4357AD');
            expect(suggestions[0].secondary).toBeDefined();
            expect(suggestions[0].background).toBeDefined();
            expect(suggestions[0].warning).toBeDefined();
            expect(suggestions[0].danger).toBeDefined();
            expect(suggestions[0].success).toBeDefined();
        });

        it('genera paleta completa con secondary bloqueado', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { secondary: '#48A9A6' },
            });

            expect(suggestions.length).toBeGreaterThan(0);
            expect(suggestions[0].secondary).toBe('#48A9A6');
        });

        it('genera paleta completa con background bloqueado', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { background: '#E4DFDA' },
            });

            expect(suggestions.length).toBeGreaterThan(0);
            expect(suggestions[0].background).toBe('#E4DFDA');
        });
    });

    describe('con múltiples colores bloqueados', () => {
        it('respeta todos los colores bloqueados', () => {
            const locked: LockedColors = {
                primary: '#4357AD',
                secondary: '#48A9A6',
                background: '#E4DFDA',
            };

            const suggestions = suggestHarmonicPalette({ locked });

            expect(suggestions.length).toBeGreaterThan(0);
            expect(suggestions[0].primary).toBe('#4357AD');
            expect(suggestions[0].secondary).toBe('#48A9A6');
            expect(suggestions[0].background).toBe('#E4DFDA');
        });

        it('genera colores semánticos cuando no están bloqueados', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD', secondary: '#48A9A6' },
            });

            expect(suggestions[0].warning).toBeDefined();
            expect(suggestions[0].danger).toBeDefined();
            expect(suggestions[0].success).toBeDefined();
        });

        it('respeta colores semánticos bloqueados', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { 
                    primary: '#4357AD',
                    warning: '#D4B483', // Usar warning más accesible
                    danger: '#C1666B',
                },
                ensureAccessibility: false, // El warning amarillo puede fallar
            });

            expect(suggestions.length).toBeGreaterThan(0);
            expect(suggestions[0].warning).toBe('#D4B483');
            expect(suggestions[0].danger).toBe('#C1666B');
        });
    });

    describe('estrategias de armonía', () => {
        const testCases: { strategy: Exclude<HarmonyStrategy, 'auto'>; description: string }[] = [
            { strategy: 'analogous', description: 'genera paleta con colores adyacentes' },
            { strategy: 'complementary', description: 'genera paleta con colores opuestos' },
            { strategy: 'triadic', description: 'genera paleta con tres colores equidistantes' },
            { strategy: 'split-complementary', description: 'genera paleta con complementario dividido' },
            { strategy: 'tetradic', description: 'genera paleta con cuatro colores' },
        ];

        testCases.forEach(({ strategy, description }) => {
            it(`${strategy}: ${description}`, () => {
                const suggestions = suggestHarmonicPalette({
                    locked: { primary: '#4357AD' },
                    strategy,
                });

                expect(suggestions.length).toBeGreaterThan(0);
                expect(suggestions[0].strategy).toBe(strategy);
                expect(suggestions[0].primary).toBe('#4357AD');
            });
        });

        it('auto: detecta y usa la mejor estrategia', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
                strategy: 'auto',
            });

            expect(suggestions.length).toBeGreaterThan(0);
            // En modo auto, se prueban múltiples estrategias
            expect(['analogous', 'complementary', 'triadic', 'split-complementary', 'tetradic'])
                .toContain(suggestions[0].strategy);
        });
    });

    describe('opciones de generación', () => {
        it('respeta el parámetro count', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
                count: 5,
            });

            expect(suggestions.length).toBeLessThanOrEqual(5);
        });

        it('genera solo 1 sugerencia si count=1', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
                count: 1,
                strategy: 'analogous',
            });

            expect(suggestions.length).toBe(1);
        });

        it('respeta backgroundLightness', () => {
            const lightSuggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
                backgroundLightness: 95,
                count: 1,
            });

            const darkSuggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
                backgroundLightness: 70,
                count: 1,
            });

            // El background con lightness 95 debería ser más claro
            expect(lightSuggestions[0].background).not.toBe(darkSuggestions[0].background);
        });
    });

    describe('accesibilidad', () => {
        it('por defecto solo devuelve paletas accesibles', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
            });

            // Todas las sugerencias deberían pasar accesibilidad
            suggestions.forEach(suggestion => {
                // Al menos debería tener buen contraste texto-background
                expect(suggestion.accessibilityPass).toBe(true);
            });
        });

        it('ensureAccessibility=false devuelve más variaciones', () => {
            const withAccessibility = suggestHarmonicPalette({
                locked: { primary: '#FFFF00' }, // Amarillo - difícil para accesibilidad
                ensureAccessibility: true,
                count: 10,
            });

            const withoutAccessibility = suggestHarmonicPalette({
                locked: { primary: '#FFFF00' },
                ensureAccessibility: false,
                count: 10,
            });

            // Sin filtro de accesibilidad, debería haber más o igual variaciones
            expect(withoutAccessibility.length).toBeGreaterThanOrEqual(withAccessibility.length);
        });
    });

    describe('scoring', () => {
        it('devuelve suggestions ordenadas por score descendente', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
                count: 5,
            });

            for (let i = 1; i < suggestions.length; i++) {
                expect(suggestions[i - 1].score).toBeGreaterThanOrEqual(suggestions[i].score);
            }
        });

        it('incluye harmonyScore y contrastScore', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
            });

            suggestions.forEach(suggestion => {
                expect(suggestion.harmonyScore).toBeGreaterThanOrEqual(0);
                expect(suggestion.harmonyScore).toBeLessThanOrEqual(100);
                expect(suggestion.contrastScore).toBeGreaterThanOrEqual(0);
                expect(suggestion.contrastScore).toBeLessThanOrEqual(100);
            });
        });

        it('el score es combinación de harmony y contrast', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
            });

            // Score = 60% armonía + 40% contraste
            suggestions.forEach(suggestion => {
                const expectedScore = Math.round(
                    suggestion.harmonyScore * 0.6 + suggestion.contrastScore * 0.4
                );
                expect(suggestion.score).toBe(expectedScore);
            });
        });
    });

    describe('eliminación de duplicados', () => {
        it('no devuelve paletas con primary y secondary idénticos', () => {
            const suggestions = suggestHarmonicPalette({
                locked: { primary: '#4357AD' },
                count: 10,
            });

            const seen = new Set<string>();
            suggestions.forEach(suggestion => {
                const key = `${suggestion.primary}-${suggestion.secondary}`;
                expect(seen.has(key)).toBe(false);
                seen.add(key);
            });
        });
    });
});

// =============================================================================
// getHarmonicColors
// =============================================================================

describe('getHarmonicColors', () => {
    it('devuelve el color base más colores armónicos', () => {
        const colors = getHarmonicColors('#FF0000', 'complementary');

        expect(colors.length).toBe(2); // base + 1 complementario
        expect(colors[0]).toBe('#FF0000');
    });

    it('analogous: devuelve 3 colores (base + 2 adyacentes)', () => {
        const colors = getHarmonicColors('#4357AD', 'analogous');

        expect(colors.length).toBe(3);
        expect(colors[0]).toBe('#4357AD');
    });

    it('triadic: devuelve 3 colores equidistantes', () => {
        const colors = getHarmonicColors('#FF0000', 'triadic');

        expect(colors.length).toBe(3);
        expect(colors[0]).toBe('#FF0000');
    });

    it('tetradic: devuelve 4 colores en cuadrado', () => {
        const colors = getHarmonicColors('#4357AD', 'tetradic');

        expect(colors.length).toBe(4);
    });

    it('retorna solo el color base si es inválido', () => {
        const colors = getHarmonicColors('invalid', 'analogous');

        expect(colors).toEqual(['invalid']);
    });
});

// =============================================================================
// detectHarmonyStrategy
// =============================================================================

describe('detectHarmonyStrategy', () => {
    it('detecta complementary para colores opuestos', () => {
        const result = detectHarmonyStrategy(['#FF0000', '#00FFFF']); // Rojo y Cyan

        expect(result.strategy).toBe('complementary');
        expect(result.confidence).toBeGreaterThan(70);
    });

    it('detecta analogous para colores cercanos', () => {
        const result = detectHarmonyStrategy(['#FF0000', '#FF5500']); // Rojo y Naranja

        expect(result.strategy).toBe('analogous');
        expect(result.confidence).toBeGreaterThan(50);
    });

    it('detecta triadic para colores a 120°', () => {
        const result = detectHarmonyStrategy(['#FF0000', '#00FF00']); // Rojo y Verde (120°)

        expect(result.strategy).toBe('triadic');
        expect(result.confidence).toBeGreaterThan(70);
    });

    it('retorna analogous con confianza 0 para menos de 2 colores', () => {
        expect(detectHarmonyStrategy(['#FF0000'])).toEqual({
            strategy: 'analogous',
            confidence: 0,
        });

        expect(detectHarmonyStrategy([])).toEqual({
            strategy: 'analogous',
            confidence: 0,
        });
    });

    it('maneja colores inválidos gracefully', () => {
        const result = detectHarmonyStrategy(['#FF0000', 'invalid']);

        expect(result.strategy).toBe('analogous');
        expect(result.confidence).toBe(0);
    });
});

// =============================================================================
// Integración con el Design System
// =============================================================================

describe('integración', () => {
    it('las paletas sugeridas son compatibles con createDesignSystem', () => {
        // Importamos createDesignSystem para verificar compatibilidad
        const { createDesignSystem } = require('../createDesignSystem');

        const suggestions = suggestHarmonicPalette({
            locked: { primary: '#4357AD' },
        });

        // La primera sugerencia debería funcionar con createDesignSystem
        expect(() => {
            createDesignSystem({
                primary: suggestions[0].primary,
                secondary: suggestions[0].secondary,
                background: suggestions[0].background,
                warning: suggestions[0].warning,
                danger: suggestions[0].danger,
                success: suggestions[0].success,
            });
        }).not.toThrow();
    });

    it('usa la paleta por defecto como caso de prueba válido', () => {
        const { DEFAULT_PALETTE } = require('../palette');

        // Bloquear los colores de DEFAULT_PALETTE y verificar que se detecta la armonía
        const result = detectHarmonyStrategy([
            DEFAULT_PALETTE.primary,
            DEFAULT_PALETTE.secondary,
        ]);

        // La paleta por defecto debería tener una estrategia detectada
        expect(result.confidence).toBeGreaterThan(0);
    });
});

// =============================================================================
// Edge cases
// =============================================================================

describe('edge cases', () => {
    it('maneja colores muy saturados', () => {
        // Rojo puro tiene problemas de accesibilidad, usar ensureAccessibility: false
        const suggestions = suggestHarmonicPalette({
            locked: { primary: '#FF0000' },
            ensureAccessibility: false,
        });

        expect(suggestions.length).toBeGreaterThan(0);
        expect(suggestions[0].primary).toBe('#FF0000');
    });

    it('maneja colores muy desaturados (grises)', () => {
        // Grises puros pueden tener problemas de contraste, usar ensureAccessibility: false
        const suggestions = suggestHarmonicPalette({
            locked: { primary: '#808080' },
            ensureAccessibility: false,
        });

        expect(suggestions.length).toBeGreaterThan(0);
    });

    it('maneja blanco como color bloqueado', () => {
        const suggestions = suggestHarmonicPalette({
            locked: { background: '#FFFFFF' },
        });

        expect(suggestions.length).toBeGreaterThan(0);
        expect(suggestions[0].background).toBe('#FFFFFF');
    });

    it('maneja negro como color bloqueado', () => {
        const suggestions = suggestHarmonicPalette({
            locked: { primary: '#000000' },
            ensureAccessibility: false, // Negro puro es problemático para accesibilidad
        });

        expect(suggestions.length).toBeGreaterThan(0);
    });

    it('maneja hex en minúsculas', () => {
        const suggestions = suggestHarmonicPalette({
            locked: { primary: '#4357ad' },
        });

        expect(suggestions.length).toBeGreaterThan(0);
    });

    it('maneja todos los colores bloqueados (no genera nada nuevo)', () => {
        const locked: LockedColors = {
            primary: '#4357AD',
            secondary: '#48A9A6',
            background: '#E4DFDA',
            warning: '#D4B483',
            danger: '#C1666B',
            success: '#22C55E',
        };

        const suggestions = suggestHarmonicPalette({ 
            locked,
            ensureAccessibility: false, // La paleta ya es fija
        });

        // Debería devolver al menos la paleta bloqueada
        expect(suggestions.length).toBeGreaterThan(0);
        expect(suggestions[0].primary).toBe('#4357AD');
        expect(suggestions[0].secondary).toBe('#48A9A6');
        expect(suggestions[0].background).toBe('#E4DFDA');
        expect(suggestions[0].warning).toBe('#D4B483');
        expect(suggestions[0].danger).toBe('#C1666B');
        expect(suggestions[0].success).toBe('#22C55E');
    });
});
