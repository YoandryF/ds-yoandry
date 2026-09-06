/**
 * @fileoverview Tests para converters.ts
 * @module @ds-yoandry/core/__tests__/converters
 */

import { hexToRgb, rgbToHex, hexToRgba, rgbToHsl, hslToRgb } from '../converters';

describe('hexToRgb', () => {
    it('convierte hex con # a RGB', () => {
        expect(hexToRgb('#4357AD')).toEqual({ r: 67, g: 87, b: 173 });
    });

    it('convierte hex sin # a RGB', () => {
        expect(hexToRgb('4357AD')).toEqual({ r: 67, g: 87, b: 173 });
    });

    it('convierte blanco correctamente', () => {
        expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('convierte negro correctamente', () => {
        expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('retorna null para hex inválido', () => {
        expect(hexToRgb('invalid')).toBeNull();
        expect(hexToRgb('#GGG')).toBeNull();
        expect(hexToRgb('')).toBeNull();
    });

    it('es case-insensitive', () => {
        expect(hexToRgb('#ff0000')).toEqual(hexToRgb('#FF0000'));
    });
});

describe('rgbToHex', () => {
    it('convierte RGB a hex', () => {
        expect(rgbToHex(67, 87, 173)).toBe('#4357ad');
    });

    it('convierte negro a #000000', () => {
        expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('convierte blanco a #ffffff', () => {
        expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    });

    it('normaliza valores fuera de rango', () => {
        const result = rgbToHex(300, -10, 128);
        expect(result).toBe('#ff0080');
    });

    it('roundtrip hex → rgb → hex', () => {
        const original = '#4357ad';
        const rgb = hexToRgb(original)!;
        expect(rgbToHex(rgb.r, rgb.g, rgb.b)).toBe(original);
    });
});

describe('hexToRgba', () => {
    it('genera rgba con opacidad', () => {
        expect(hexToRgba('#4357AD', 0.5)).toBe('rgba(67, 87, 173, 0.5)');
    });

    it('genera rgba con opacidad 0', () => {
        expect(hexToRgba('#000000', 0)).toBe('rgba(0, 0, 0, 0)');
    });

    it('genera rgba con opacidad 1', () => {
        expect(hexToRgba('#FFFFFF', 1)).toBe('rgba(255, 255, 255, 1)');
    });

    it('retorna fallback para hex inválido', () => {
        expect(hexToRgba('invalid', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
    });
});

describe('rgbToHsl', () => {
    it('convierte rojo puro', () => {
        const hsl = rgbToHsl(255, 0, 0);
        expect(hsl.h).toBeCloseTo(0);
        expect(hsl.s).toBeCloseTo(100);
        expect(hsl.l).toBeCloseTo(50);
    });

    it('convierte verde puro', () => {
        const hsl = rgbToHsl(0, 255, 0);
        expect(hsl.h).toBeCloseTo(120);
        expect(hsl.s).toBeCloseTo(100);
        expect(hsl.l).toBeCloseTo(50);
    });

    it('convierte azul puro', () => {
        const hsl = rgbToHsl(0, 0, 255);
        expect(hsl.h).toBeCloseTo(240);
        expect(hsl.s).toBeCloseTo(100);
        expect(hsl.l).toBeCloseTo(50);
    });

    it('convierte gris a saturación 0', () => {
        const hsl = rgbToHsl(128, 128, 128);
        expect(hsl.s).toBeCloseTo(0);
        expect(hsl.l).toBeCloseTo(50, 0);
    });

    it('convierte negro', () => {
        const hsl = rgbToHsl(0, 0, 0);
        expect(hsl.l).toBeCloseTo(0);
    });

    it('convierte blanco', () => {
        const hsl = rgbToHsl(255, 255, 255);
        expect(hsl.l).toBeCloseTo(100);
    });
});

describe('hslToRgb', () => {
    it('convierte rojo puro', () => {
        const rgb = hslToRgb(0, 100, 50);
        expect(Math.round(rgb.r)).toBe(255);
        expect(Math.round(rgb.g)).toBe(0);
        expect(Math.round(rgb.b)).toBe(0);
    });

    it('convierte verde puro', () => {
        const rgb = hslToRgb(120, 100, 50);
        expect(Math.round(rgb.r)).toBe(0);
        expect(Math.round(rgb.g)).toBe(255);
        expect(Math.round(rgb.b)).toBe(0);
    });

    it('convierte gris (s=0)', () => {
        const rgb = hslToRgb(0, 0, 50);
        expect(Math.round(rgb.r)).toBe(128);
        expect(Math.round(rgb.g)).toBe(128);
        expect(Math.round(rgb.b)).toBe(128);
    });

    it('roundtrip rgb → hsl → rgb', () => {
        const original = { r: 67, g: 87, b: 173 };
        const hsl = rgbToHsl(original.r, original.g, original.b);
        const back = hslToRgb(hsl.h, hsl.s, hsl.l);
        expect(Math.round(back.r)).toBe(original.r);
        expect(Math.round(back.g)).toBe(original.g);
        expect(Math.round(back.b)).toBe(original.b);
    });
});
