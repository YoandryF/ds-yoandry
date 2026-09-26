/**
 * Generador de fixtures de paridad.
 *
 * Ejecuta el core JS ORIGINAL (build de producción en packages/core/dist)
 * con varias paletas y funciones puras, y vuelca las salidas exactas a
 * test/fixtures/parity.json.
 *
 * El test de Dart (parity_test.dart) verifica que ds_yoandry_core produce
 * EXACTAMENTE estos mismos valores. La fuente de verdad es el código JS
 * que ya usas en producción, no suposiciones del port.
 *
 * Uso:
 *   node tool/generate_parity_fixtures.js
 */

const fs = require('fs');
const path = require('path');

// El core compilado de producción.
const core = require('../../core/dist/index.js');

const {
    createDesignSystem,
    hexToRgb, rgbToHex, hexToRgba, rgbToHsl, hslToRgb,
    lighten, darken, saturate, desaturate, adjustHue, mix, complement, invert,
    setLightness, setSaturation,
    getRelativeLuminance, getContrastRatio, meetsContrastAA, meetsContrastAAA,
    getContrastColor, ensureContrast, findBestContrast,
    generateGrayScale, generateColorVariants, generateAlphaScale, generateSuccessColor,
    isValidHex, normalizeHex,
    DEFAULT_PALETTE,
} = core;

// Paletas de prueba (incluye las predefinidas del paquete Flutter + casos borde).
const PALETTES = {
    default: DEFAULT_PALETTE,
    ocean: {
        primary: '#0077B6', secondary: '#00B4D8', background: '#CAF0F8',
        warning: '#FFB703', danger: '#E63946', success: '#06D6A0',
    },
    forest: {
        primary: '#2D6A4F', secondary: '#40916C', background: '#F0F4F0',
        warning: '#E9C46A', danger: '#BC4749', success: '#52B788',
    },
    sunset: {
        primary: '#FF6B35', secondary: '#F7C59F', background: '#FFFAF5',
        warning: '#FFD166', danger: '#EF476F', success: '#06D6A0',
    },
    // Sin success → fuerza generateSuccessColor
    noSuccess: {
        primary: '#4357AD', secondary: '#48A9A6', background: '#E4DFDA',
        warning: '#D4B483', danger: '#C1666B',
    },
    // Hex sin # → fuerza normalizeHex
    noHash: {
        primary: '883333', secondary: '338833', background: 'DDDDDD',
        warning: 'CCAA33', danger: 'AA3355',
    },
};

// Serializa el DesignSystem completo a un objeto plano de hex/valores.
function serializeSystem(system) {
    const c = system.colors;
    const variant = (v) => ({ light: v.light, main: v.main, dark: v.dark, disabled: v.disabled });
    const alpha = (a) => ({ 5: a[5], 10: a[10], 20: a[20], 30: a[30], 40: a[40], 50: a[50], 60: a[60], 70: a[70], 80: a[80], 90: a[90] });
    const gray = (g) => ({ 50: g[50], 100: g[100], 200: g[200], 300: g[300], 400: g[400], 500: g[500], 600: g[600], 700: g[700], 800: g[800], 900: g[900] });

    return {
        brand: c.brand,
        gray: gray(c.gray),
        variants: {
            primary: variant(c.variants.primary),
            secondary: variant(c.variants.secondary),
            danger: variant(c.variants.danger),
            warning: variant(c.variants.warning),
            success: variant(c.variants.success),
        },
        text: c.text,
        surface: c.surface,
        dark: c.dark,
        alpha: {
            black: alpha(c.alpha.black),
            white: alpha(c.alpha.white),
            primary: alpha(c.alpha.primary),
        },
    };
}

// Colores de prueba para funciones puras.
const SAMPLE_COLORS = [
    '#4357AD', '#48A9A6', '#E4DFDA', '#D4B483', '#C1666B',
    '#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000',
    '#888888', '#123456', '#ABCDEF', '#FF6B35',
];

const fixtures = {
    systems: {},
    converters: { hexToRgb: [], rgbToHex: [], hexToRgba: [], rgbToHsl: [], hslToRgb: [] },
    manipulators: {
        lighten: [], darken: [], saturate: [], desaturate: [], adjustHue: [],
        mix: [], complement: [], invert: [], setLightness: [], setSaturation: [],
    },
    accessibility: {
        getRelativeLuminance: [], getContrastRatio: [], meetsContrastAA: [],
        meetsContrastAAA: [], getContrastColor: [], ensureContrast: [], findBestContrast: [],
    },
    generators: { generateGrayScale: [], generateColorVariants: [], generateAlphaScale: [], generateSuccessColor: [] },
    validators: { isValidHex: [], normalizeHex: [] },
};

// --- Sistemas completos ---
for (const [name, palette] of Object.entries(PALETTES)) {
    fixtures.systems[name] = {
        palette,
        output: serializeSystem(createDesignSystem(palette, { skipCache: true })),
    };
}

// --- Funciones puras ---
for (const hex of SAMPLE_COLORS) {
    const rgb = hexToRgb(hex);
    fixtures.converters.hexToRgb.push({ in: hex, out: rgb });
    if (rgb) {
        fixtures.converters.rgbToHex.push({ in: [rgb.r, rgb.g, rgb.b], out: rgbToHex(rgb.r, rgb.g, rgb.b) });
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        fixtures.converters.rgbToHsl.push({ in: [rgb.r, rgb.g, rgb.b], out: hsl });
        fixtures.converters.hslToRgb.push({ in: [hsl.h, hsl.s, hsl.l], out: hslToRgb(hsl.h, hsl.s, hsl.l) });
    }
    for (const a of [0, 0.1, 0.5, 0.9, 1]) {
        fixtures.converters.hexToRgba.push({ in: [hex, a], out: hexToRgba(hex, a) });
    }

    for (const p of [5, 12, 15, 20, 30, 50]) {
        fixtures.manipulators.lighten.push({ in: [hex, p], out: lighten(hex, p) });
        fixtures.manipulators.darken.push({ in: [hex, p], out: darken(hex, p) });
        fixtures.manipulators.saturate.push({ in: [hex, p], out: saturate(hex, p) });
        fixtures.manipulators.desaturate.push({ in: [hex, p], out: desaturate(hex, p) });
        fixtures.manipulators.setLightness.push({ in: [hex, p], out: setLightness(hex, p) });
        fixtures.manipulators.setSaturation.push({ in: [hex, p], out: setSaturation(hex, p) });
    }
    for (const d of [30, 90, 120, 180, 240, 360]) {
        fixtures.manipulators.adjustHue.push({ in: [hex, d], out: adjustHue(hex, d) });
    }
    fixtures.manipulators.complement.push({ in: hex, out: complement(hex) });
    fixtures.manipulators.invert.push({ in: hex, out: invert(hex) });

    fixtures.accessibility.getRelativeLuminance.push({ in: hex, out: getRelativeLuminance(hex) });
    fixtures.accessibility.getContrastColor.push({ in: hex, out: getContrastColor(hex) });
    fixtures.generators.generateGrayScale.push({ in: hex, out: (() => { const g = generateGrayScale(hex); return { 50: g[50], 100: g[100], 200: g[200], 300: g[300], 400: g[400], 500: g[500], 600: g[600], 700: g[700], 800: g[800], 900: g[900] }; })() });
    fixtures.generators.generateSuccessColor.push({ in: hex, out: generateSuccessColor(hex) });

    for (const other of ['#FFFFFF', '#000000', '#4357AD']) {
        fixtures.manipulators.mix.push({ in: [hex, other, 0.3], out: mix(hex, other, 0.3) });
        fixtures.accessibility.getContrastRatio.push({ in: [hex, other], out: getContrastRatio(hex, other) });
        fixtures.accessibility.meetsContrastAA.push({ in: [hex, other], out: meetsContrastAA(hex, other) });
        fixtures.accessibility.meetsContrastAAA.push({ in: [hex, other], out: meetsContrastAAA(hex, other) });
        fixtures.accessibility.ensureContrast.push({ in: [hex, other], out: ensureContrast(hex, other) });
    }

    fixtures.generators.generateColorVariants.push({ in: [hex, '#E4DFDA'], out: (() => { const v = generateColorVariants(hex, '#E4DFDA'); return { light: v.light, main: v.main, dark: v.dark, disabled: v.disabled }; })() });
    fixtures.generators.generateAlphaScale.push({ in: hex, out: (() => { const a = generateAlphaScale(hex); return { 5: a[5], 10: a[10], 20: a[20], 30: a[30], 40: a[40], 50: a[50], 60: a[60], 70: a[70], 80: a[80], 90: a[90] }; })() });
}

fixtures.accessibility.findBestContrast.push({ in: ['#000000', ['#FFFFFF', '#888888', '#CCCCCC']], out: findBestContrast('#000000', ['#FFFFFF', '#888888', '#CCCCCC']) });
fixtures.accessibility.findBestContrast.push({ in: ['#FFFFFF', ['#000000', '#888888']], out: findBestContrast('#FFFFFF', ['#000000', '#888888']) });

for (const v of ['#4357AD', '4357AD', '#435', 'invalid', '', '#GGGGGG']) {
    fixtures.validators.isValidHex.push({ in: v, out: isValidHex(v) });
}
for (const v of ['4357AD', '#4357AD', 'ffffff']) {
    fixtures.validators.normalizeHex.push({ in: v, out: normalizeHex(v) });
}

const outDir = path.join(__dirname, '..', 'test', 'fixtures');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'parity.json');
fs.writeFileSync(outFile, JSON.stringify(fixtures, null, 2));
console.log('Fixtures escritos en', outFile);
console.log('Sistemas:', Object.keys(fixtures.systems).length);
