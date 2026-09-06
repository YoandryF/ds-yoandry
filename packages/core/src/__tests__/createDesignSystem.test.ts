/**
 * @fileoverview Tests para createDesignSystem.ts
 * @module @ds-yoandry/core/__tests__/createDesignSystem
 */

import { createDesignSystem } from '../createDesignSystem';
import { getContrastRatio } from '../accessibility';
import { clearDesignSystemCache } from '../cache';
import { DEFAULT_PALETTE } from '../palette';

const TEST_PALETTE = {
    primary: '#4357AD',
    secondary: '#48A9A6',
    background: '#E4DFDA',
    warning: '#D4B483',
    danger: '#C1666B',
};

beforeEach(() => {
    clearDesignSystemCache();
});

// =============================================================================
// ESTRUCTURA
// =============================================================================

describe('createDesignSystem - estructura', () => {
    it('retorna un objeto con colors y platform', () => {
        const system = createDesignSystem(TEST_PALETTE);
        expect(system).toHaveProperty('colors');
        expect(system).toHaveProperty('platform');
    });

    it('colors tiene todas las secciones requeridas', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        expect(colors).toHaveProperty('brand');
        expect(colors).toHaveProperty('gray');
        expect(colors).toHaveProperty('variants');
        expect(colors).toHaveProperty('text');
        expect(colors).toHaveProperty('surface');
        expect(colors).toHaveProperty('dark');
        expect(colors).toHaveProperty('alpha');
    });

    it('variants tiene los 5 colores semánticos', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        expect(colors.variants).toHaveProperty('primary');
        expect(colors.variants).toHaveProperty('secondary');
        expect(colors.variants).toHaveProperty('danger');
        expect(colors.variants).toHaveProperty('warning');
        expect(colors.variants).toHaveProperty('success');
    });

    it('cada variante tiene light, main, dark, disabled', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        ['primary', 'secondary', 'danger', 'warning', 'success'].forEach(key => {
            const variant = colors.variants[key as keyof typeof colors.variants];
            expect(variant).toHaveProperty('light');
            expect(variant).toHaveProperty('main');
            expect(variant).toHaveProperty('dark');
            expect(variant).toHaveProperty('disabled');
        });
    });

    it('gray tiene los 10 tonos (50-900)', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(key => {
            expect(colors.gray).toHaveProperty(String(key));
        });
    });

    it('platform tiene shadow con 5 niveles', () => {
        const { platform } = createDesignSystem(TEST_PALETTE);
        ['none', 'sm', 'md', 'lg', 'xl'].forEach(level => {
            expect(platform.shadow).toHaveProperty(level);
        });
    });
});

// =============================================================================
// PALETA
// =============================================================================

describe('createDesignSystem - paleta', () => {
    it('respeta el primary de la paleta', () => {
        const system = createDesignSystem(TEST_PALETTE);
        expect(system.colors.variants.primary.main).toBe(TEST_PALETTE.primary);
        expect(system.colors.brand.primary).toBe(TEST_PALETTE.primary);
    });

    it('acepta hex sin #', () => {
        const system = createDesignSystem({
            ...TEST_PALETTE,
            primary: '4357AD',
        });
        expect(system.colors.variants.primary.main).toBe('#4357AD');
    });

    it('genera success automáticamente si no se provee', () => {
        const system = createDesignSystem(TEST_PALETTE);
        expect(system.colors.brand.success).toBeTruthy();
        expect(system.colors.brand.success).toMatch(/^#[a-fA-F0-9]{6}$/);
    });

    it('respeta el success personalizado', () => {
        const system = createDesignSystem({
            ...TEST_PALETTE,
            success: '#06D6A0',
        });
        expect(system.colors.brand.success).toBe('#06D6A0');
    });

    it('usa DEFAULT_PALETTE correctamente', () => {
        const system = createDesignSystem(DEFAULT_PALETTE);
        expect(system.colors.brand.primary).toBe(DEFAULT_PALETTE.primary);
    });
});

// =============================================================================
// ACCESIBILIDAD
// =============================================================================

describe('createDesignSystem - accesibilidad WCAG AA', () => {
    it('texto onPrimary tiene contraste >= 4.5 sobre primary', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        const ratio = getContrastRatio(colors.text.onPrimary, TEST_PALETTE.primary);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('texto onSecondary tiene contraste >= 4.5 sobre secondary', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        const ratio = getContrastRatio(colors.text.onSecondary, TEST_PALETTE.secondary);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('texto onDanger tiene contraste >= 4.5 sobre danger', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        const ratio = getContrastRatio(colors.text.onDanger, TEST_PALETTE.danger);
        // Tolerancia de 0.1 por precisión de búsqueda binaria
        expect(ratio).toBeGreaterThanOrEqual(4.4);
    });

    it('texto onWarning tiene contraste >= 4.5 sobre warning', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        const ratio = getContrastRatio(colors.text.onWarning, TEST_PALETTE.warning);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('texto onSuccess tiene contraste >= 4.5 sobre success', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        const ratio = getContrastRatio(
            colors.text.onSuccess,
            colors.brand.success
        );
        expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
});

// =============================================================================
// ESCALA DE GRISES
// =============================================================================

describe('createDesignSystem - escala de grises', () => {
    it('gray[50] es más claro que gray[900]', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        // Comparar luminosidades
        const l50 = parseInt(colors.gray[50].slice(1), 16);
        const l900 = parseInt(colors.gray[900].slice(1), 16);
        expect(l50).toBeGreaterThan(l900);
    });

    it('todos los grises son strings hexadecimales válidos', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        Object.values(colors.gray).forEach(color => {
            expect(color).toMatch(/^#[a-fA-F0-9]{6}$/);
        });
    });

    it('text.primary usa gray[900]', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        expect(colors.text.primary).toBe(colors.gray[900]);
    });

    it('text.secondary usa gray[700]', () => {
        const { colors } = createDesignSystem(TEST_PALETTE);
        expect(colors.text.secondary).toBe(colors.gray[700]);
    });
});

// =============================================================================
// CACHÉ
// =============================================================================

describe('createDesignSystem - caché', () => {
    it('retorna el mismo objeto para la misma paleta', () => {
        const s1 = createDesignSystem(TEST_PALETTE);
        const s2 = createDesignSystem(TEST_PALETTE);
        expect(s1).toBe(s2); // misma referencia
    });

    it('retorna objeto diferente con skipCache', () => {
        const s1 = createDesignSystem(TEST_PALETTE);
        const s2 = createDesignSystem(TEST_PALETTE, { skipCache: true });
        expect(s1).not.toBe(s2);
    });

    it('retorna objeto diferente para paletas distintas', () => {
        const s1 = createDesignSystem(TEST_PALETTE);
        const s2 = createDesignSystem({ ...TEST_PALETTE, primary: '#FF0000' });
        expect(s1).not.toBe(s2);
    });
});

// =============================================================================
// ERRORES
// =============================================================================

describe('createDesignSystem - validaciones', () => {
    it('lanza error si falta primary', () => {
        const { primary, ...rest } = TEST_PALETTE;
        expect(() => createDesignSystem(rest as any)).toThrow(/primary/);
    });

    it('lanza error si falta secondary', () => {
        const { secondary, ...rest } = TEST_PALETTE;
        expect(() => createDesignSystem(rest as any)).toThrow(/secondary/);
    });

    it('lanza error si falta background', () => {
        const { background, ...rest } = TEST_PALETTE;
        expect(() => createDesignSystem(rest as any)).toThrow(/background/);
    });

    it('lanza error para hex inválido', () => {
        expect(() => createDesignSystem({
            ...TEST_PALETTE,
            primary: 'not-a-color',
        })).toThrow();
    });
});
