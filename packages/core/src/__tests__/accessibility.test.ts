/**
 * @fileoverview Tests para accessibility.ts
 * @module @yoandryf/core/__tests__/accessibility
 */

import {
    getRelativeLuminance,
    getContrastRatio,
    meetsContrastAA,
    meetsContrastAAA,
    getContrastColor,
    ensureContrast,
    findBestContrast,
} from '../accessibility';

describe('getRelativeLuminance', () => {
    it('blanco tiene luminancia 1', () => {
        expect(getRelativeLuminance('#FFFFFF')).toBeCloseTo(1);
    });

    it('negro tiene luminancia 0', () => {
        expect(getRelativeLuminance('#000000')).toBeCloseTo(0);
    });

    it('luminancia está entre 0 y 1', () => {
        const colors = ['#4357AD', '#48A9A6', '#C1666B', '#D4B483', '#22C55E'];
        colors.forEach(color => {
            const l = getRelativeLuminance(color);
            expect(l).toBeGreaterThanOrEqual(0);
            expect(l).toBeLessThanOrEqual(1);
        });
    });

    it('retorna 0 para color inválido', () => {
        expect(getRelativeLuminance('invalid')).toBe(0);
    });

    it('colores claros tienen mayor luminancia que oscuros', () => {
        expect(getRelativeLuminance('#FFFFFF')).toBeGreaterThan(
            getRelativeLuminance('#000000')
        );
        expect(getRelativeLuminance('#EEEEEE')).toBeGreaterThan(
            getRelativeLuminance('#222222')
        );
    });
});

describe('getContrastRatio', () => {
    it('negro sobre blanco tiene ratio 21', () => {
        expect(getContrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21);
    });

    it('blanco sobre blanco tiene ratio 1', () => {
        expect(getContrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1);
    });

    it('ratio es simétrico', () => {
        const r1 = getContrastRatio('#4357AD', '#FFFFFF');
        const r2 = getContrastRatio('#FFFFFF', '#4357AD');
        expect(r1).toBeCloseTo(r2);
    });

    it('ratio entre 1 y 21', () => {
        const ratio = getContrastRatio('#4357AD', '#FFFFFF');
        expect(ratio).toBeGreaterThanOrEqual(1);
        expect(ratio).toBeLessThanOrEqual(21);
    });

    it('primary sobre blanco cumple AA (> 4.5)', () => {
        expect(getContrastRatio('#4357AD', '#FFFFFF')).toBeGreaterThan(4.5);
    });
});

describe('meetsContrastAA', () => {
    it('negro sobre blanco cumple AA', () => {
        expect(meetsContrastAA('#000000', '#FFFFFF')).toBe(true);
    });

    it('blanco sobre blanco no cumple AA', () => {
        expect(meetsContrastAA('#FFFFFF', '#FFFFFF')).toBe(false);
    });

    it('gris medio no cumple AA texto normal', () => {
        expect(meetsContrastAA('#777777', '#FFFFFF')).toBe(false);
    });

    it('gris medio puede cumplir AA texto grande', () => {
        // ratio ~4.47 >= 3 para texto grande
        expect(meetsContrastAA('#777777', '#FFFFFF', true)).toBe(true);
    });

    it('primary sobre blanco cumple AA', () => {
        expect(meetsContrastAA('#FFFFFF', '#4357AD')).toBe(true);
    });
});

describe('meetsContrastAAA', () => {
    it('negro sobre blanco cumple AAA', () => {
        expect(meetsContrastAAA('#000000', '#FFFFFF')).toBe(true);
    });

    it('gris oscuro #333 cumple AAA', () => {
        expect(meetsContrastAAA('#333333', '#FFFFFF')).toBe(true);
    });

    it('gris medio #666 no cumple AAA texto normal', () => {
        expect(meetsContrastAAA('#666666', '#FFFFFF')).toBe(false);
    });

    it('gris medio #666 cumple AAA texto grande', () => {
        expect(meetsContrastAAA('#666666', '#FFFFFF', true)).toBe(true);
    });
});

describe('getContrastColor', () => {
    it('retorna blanco sobre fondos oscuros', () => {
        expect(getContrastColor('#000000')).toBe('#FFFFFF');
        expect(getContrastColor('#4357AD')).toBe('#FFFFFF');
        // #C1666B (danger) es un rojo medio - puede preferir oscuro dependiendo de luminancia
        const result = getContrastColor('#C1666B');
        const whiteRatio = getContrastRatio('#FFFFFF', '#C1666B');
        const darkRatio = getContrastRatio('#1A1A1A', '#C1666B');
        expect(result).toBe(whiteRatio > darkRatio ? '#FFFFFF' : '#1A1A1A');
    });

    it('retorna oscuro sobre fondos claros', () => {
        expect(getContrastColor('#FFFFFF')).toBe('#1A1A1A');
        expect(getContrastColor('#E4DFDA')).toBe('#1A1A1A');
        expect(getContrastColor('#D4B483')).toBe('#1A1A1A');
    });

    it('usa colores personalizados', () => {
        const result = getContrastColor('#000000', '#F0F0F0', '#0A0A0A');
        expect(result).toBe('#F0F0F0');
    });
});

describe('ensureContrast', () => {
    it('retorna el mismo color si ya cumple el contraste', () => {
        const result = ensureContrast('#000000', '#FFFFFF');
        expect(result).toBe('#000000');
    });

    it('ajusta un gris que no cumple AA contra blanco', () => {
        const adjusted = ensureContrast('#888888', '#FFFFFF');
        const ratio = getContrastRatio(adjusted, '#FFFFFF');
        expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('ajusta un color claro que no cumple AA contra blanco', () => {
        const adjusted = ensureContrast('#CCCCCC', '#FFFFFF');
        const ratio = getContrastRatio(adjusted, '#FFFFFF');
        expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('ajusta para contraste personalizado (ratio 3)', () => {
        const adjusted = ensureContrast('#888888', '#FFFFFF', 3);
        const ratio = getContrastRatio(adjusted, '#FFFFFF');
        expect(ratio).toBeGreaterThanOrEqual(3);
    });

    it('el color ajustado cumple el contraste mínimo', () => {
        const colors = ['#888', '#999', '#aaa', '#bbb'];
        colors.forEach(color => {
            const adjusted = ensureContrast(color, '#FFFFFF');
            expect(getContrastRatio(adjusted, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
        });
    });
});

describe('findBestContrast', () => {
    it('encuentra blanco como mejor contraste sobre negro', () => {
        const result = findBestContrast('#000000', ['#FFFFFF', '#888888', '#CCCCCC']);
        expect(result.color).toBe('#FFFFFF');
        expect(result.ratio).toBeCloseTo(21);
    });

    it('encuentra negro como mejor contraste sobre blanco', () => {
        const result = findBestContrast('#FFFFFF', ['#000000', '#888888', '#CCCCCC']);
        expect(result.color).toBe('#000000');
    });

    it('retorna el primer candidato si solo hay uno', () => {
        const result = findBestContrast('#FFFFFF', ['#FF0000']);
        expect(result.color).toBe('#FF0000');
    });

    it('el ratio retornado coincide con el color', () => {
        const result = findBestContrast('#000000', ['#FFFFFF', '#888888']);
        const expectedRatio = getContrastRatio(result.color, '#000000');
        expect(result.ratio).toBeCloseTo(expectedRatio);
    });
});
