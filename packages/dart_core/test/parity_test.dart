/// Test de PARIDAD: verifica que ds_yoandry_core (Dart) produce salidas
/// EXACTAMENTE iguales al core JS original.
///
/// Los fixtures en test/fixtures/parity.json fueron generados ejecutando el
/// build de producción del core JS (packages/core/dist) — ver
/// tool/generate_parity_fixtures.js. La fuente de verdad es el código que ya
/// corre en producción, no las suposiciones del port.
///
/// Regenerar fixtures:  node tool/generate_parity_fixtures.js
library;

import 'dart:convert';
import 'dart:io';

import 'package:ds_yoandry_core/ds_yoandry_core.dart';
import 'package:test/test.dart';

/// Tolerancia para comparaciones de punto flotante (IEEE 754 double en ambos).
const double _eps = 1e-9;

void main() {
  final file = File('test/fixtures/parity.json');
  if (!file.existsSync()) {
    throw StateError(
      'Falta test/fixtures/parity.json. Genéralo con:\n'
      '  node tool/generate_parity_fixtures.js',
    );
  }
  final fixtures = jsonDecode(file.readAsStringSync()) as Map<String, dynamic>;

  // ---------------------------------------------------------------------------
  // SISTEMAS COMPLETOS
  // ---------------------------------------------------------------------------
  group('paridad — createDesignSystem', () {
    final systems = fixtures['systems'] as Map<String, dynamic>;
    systems.forEach((name, data) {
      test('sistema "$name" idéntico al core JS', () {
        final p = (data as Map)['palette'] as Map;
        final expected = data['output'] as Map;

        final palette = BrandPalette(
          primary: p['primary'] as String,
          secondary: p['secondary'] as String,
          background: p['background'] as String,
          warning: p['warning'] as String,
          danger: p['danger'] as String,
          success: p['success'] as String?,
        );
        final c = createDesignSystem(palette, skipCache: true).colors;

        // brand
        final brand = expected['brand'] as Map;
        expect(c.brand.primary, brand['primary']);
        expect(c.brand.secondary, brand['secondary']);
        expect(c.brand.background, brand['background']);
        expect(c.brand.warning, brand['warning']);
        expect(c.brand.danger, brand['danger']);
        expect(c.brand.success, brand['success']);

        // gray
        final gray = expected['gray'] as Map;
        for (final shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
          expect(c.gray[shade], gray['$shade'],
              reason: 'gray[$shade] en "$name"');
        }

        // variants
        final variants = expected['variants'] as Map;
        void checkVariant(String key, ColorVariants v) {
          final e = variants[key] as Map;
          expect(v.light, e['light'], reason: '$key.light en "$name"');
          expect(v.main, e['main'], reason: '$key.main en "$name"');
          expect(v.dark, e['dark'], reason: '$key.dark en "$name"');
          expect(v.disabled, e['disabled'], reason: '$key.disabled en "$name"');
        }

        checkVariant('primary', c.variants.primary);
        checkVariant('secondary', c.variants.secondary);
        checkVariant('danger', c.variants.danger);
        checkVariant('warning', c.variants.warning);
        checkVariant('success', c.variants.success);

        // text
        final text = expected['text'] as Map;
        expect(c.text.primary, text['primary']);
        expect(c.text.secondary, text['secondary']);
        expect(c.text.tertiary, text['tertiary']);
        expect(c.text.disabled, text['disabled']);
        expect(c.text.onPrimary, text['onPrimary'], reason: 'onPrimary "$name"');
        expect(c.text.onSecondary, text['onSecondary']);
        expect(c.text.onDanger, text['onDanger'], reason: 'onDanger "$name"');
        expect(c.text.onWarning, text['onWarning'], reason: 'onWarning "$name"');
        expect(c.text.onSuccess, text['onSuccess'], reason: 'onSuccess "$name"');

        // surface
        final surface = expected['surface'] as Map;
        expect(c.surface.background, surface['background']);
        expect(c.surface.surface, surface['surface']);
        expect(c.surface.surfaceHover, surface['surfaceHover']);
        expect(c.surface.surfaceActive, surface['surfaceActive']);
        expect(c.surface.elevated, surface['elevated']);

        // dark
        final dark = expected['dark'] as Map;
        expect(c.dark.background, dark['background']);
        expect(c.dark.surface, dark['surface']);
        expect(c.dark.surfaceHover, dark['surfaceHover']);
        expect(c.dark.surfaceActive, dark['surfaceActive']);
        expect(c.dark.elevated, dark['elevated']);
        expect(c.dark.textPrimary, dark['textPrimary']);
        expect(c.dark.textSecondary, dark['textSecondary']);
        expect(c.dark.textTertiary, dark['textTertiary']);
        expect(c.dark.divider, dark['divider']);

        // alpha
        final alpha = expected['alpha'] as Map;
        void checkAlpha(String key, AlphaScale a) {
          final e = alpha[key] as Map;
          for (final step in [5, 10, 20, 30, 40, 50, 60, 70, 80, 90]) {
            expect(a[step], e['$step'], reason: 'alpha.$key[$step] en "$name"');
          }
        }

        checkAlpha('black', c.alpha.black);
        checkAlpha('white', c.alpha.white);
        checkAlpha('primary', c.alpha.primary);
      });
    });
  });

  // ---------------------------------------------------------------------------
  // CONVERSORES
  // ---------------------------------------------------------------------------
  group('paridad — converters', () {
    final conv = fixtures['converters'] as Map<String, dynamic>;

    test('hexToRgb', () {
      for (final e in conv['hexToRgb'] as List) {
        final input = e['in'] as String;
        final out = e['out'];
        final result = hexToRgb(input);
        if (out == null) {
          expect(result, isNull, reason: 'hexToRgb("$input")');
        } else {
          final m = out as Map;
          expect(result!.r, closeTo((m['r'] as num).toDouble(), _eps));
          expect(result.g, closeTo((m['g'] as num).toDouble(), _eps));
          expect(result.b, closeTo((m['b'] as num).toDouble(), _eps));
        }
      }
    });

    test('rgbToHex', () {
      for (final e in conv['rgbToHex'] as List) {
        final i = e['in'] as List;
        expect(
          rgbToHex((i[0] as num).toDouble(), (i[1] as num).toDouble(),
              (i[2] as num).toDouble()),
          e['out'],
        );
      }
    });

    test('hexToRgba', () {
      for (final e in conv['hexToRgba'] as List) {
        final i = e['in'] as List;
        expect(hexToRgba(i[0] as String, (i[1] as num).toDouble()), e['out']);
      }
    });

    test('rgbToHsl', () {
      for (final e in conv['rgbToHsl'] as List) {
        final i = e['in'] as List;
        final m = e['out'] as Map;
        final hsl = rgbToHsl((i[0] as num).toDouble(), (i[1] as num).toDouble(),
            (i[2] as num).toDouble());
        expect(hsl.h, closeTo((m['h'] as num).toDouble(), _eps));
        expect(hsl.s, closeTo((m['s'] as num).toDouble(), _eps));
        expect(hsl.l, closeTo((m['l'] as num).toDouble(), _eps));
      }
    });

    test('hslToRgb', () {
      for (final e in conv['hslToRgb'] as List) {
        final i = e['in'] as List;
        final m = e['out'] as Map;
        final rgb = hslToRgb((i[0] as num).toDouble(), (i[1] as num).toDouble(),
            (i[2] as num).toDouble());
        expect(rgb.r, closeTo((m['r'] as num).toDouble(), _eps));
        expect(rgb.g, closeTo((m['g'] as num).toDouble(), _eps));
        expect(rgb.b, closeTo((m['b'] as num).toDouble(), _eps));
      }
    });
  });

  // ---------------------------------------------------------------------------
  // MANIPULADORES
  // ---------------------------------------------------------------------------
  group('paridad — manipulators', () {
    final man = fixtures['manipulators'] as Map<String, dynamic>;

    String call1(String name, String hex, double p) {
      switch (name) {
        case 'lighten':
          return lighten(hex, p);
        case 'darken':
          return darken(hex, p);
        case 'saturate':
          return saturate(hex, p);
        case 'desaturate':
          return desaturate(hex, p);
        case 'setLightness':
          return setLightness(hex, p);
        case 'setSaturation':
          return setSaturation(hex, p);
        case 'adjustHue':
          return adjustHue(hex, p);
        default:
          throw ArgumentError(name);
      }
    }

    for (final fn in [
      'lighten', 'darken', 'saturate', 'desaturate', 'setLightness',
      'setSaturation', 'adjustHue'
    ]) {
      test(fn, () {
        for (final e in man[fn] as List) {
          final i = e['in'] as List;
          expect(call1(fn, i[0] as String, (i[1] as num).toDouble()), e['out'],
              reason: '$fn(${i[0]}, ${i[1]})');
        }
      });
    }

    test('mix', () {
      for (final e in man['mix'] as List) {
        final i = e['in'] as List;
        expect(mix(i[0] as String, i[1] as String, (i[2] as num).toDouble()),
            e['out']);
      }
    });

    test('complement', () {
      for (final e in man['complement'] as List) {
        expect(complement(e['in'] as String), e['out']);
      }
    });

    test('invert', () {
      for (final e in man['invert'] as List) {
        expect(invert(e['in'] as String), e['out']);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // ACCESIBILIDAD
  // ---------------------------------------------------------------------------
  group('paridad — accessibility', () {
    final acc = fixtures['accessibility'] as Map<String, dynamic>;

    test('getRelativeLuminance', () {
      for (final e in acc['getRelativeLuminance'] as List) {
        expect(getRelativeLuminance(e['in'] as String),
            closeTo((e['out'] as num).toDouble(), _eps),
            reason: 'luminance(${e['in']})');
      }
    });

    test('getContrastRatio', () {
      for (final e in acc['getContrastRatio'] as List) {
        final i = e['in'] as List;
        expect(getContrastRatio(i[0] as String, i[1] as String),
            closeTo((e['out'] as num).toDouble(), _eps));
      }
    });

    test('meetsContrastAA', () {
      for (final e in acc['meetsContrastAA'] as List) {
        final i = e['in'] as List;
        expect(meetsContrastAA(i[0] as String, i[1] as String), e['out']);
      }
    });

    test('meetsContrastAAA', () {
      for (final e in acc['meetsContrastAAA'] as List) {
        final i = e['in'] as List;
        expect(meetsContrastAAA(i[0] as String, i[1] as String), e['out']);
      }
    });

    test('getContrastColor', () {
      for (final e in acc['getContrastColor'] as List) {
        expect(getContrastColor(e['in'] as String), e['out']);
      }
    });

    test('ensureContrast', () {
      for (final e in acc['ensureContrast'] as List) {
        final i = e['in'] as List;
        expect(ensureContrast(i[0] as String, i[1] as String), e['out'],
            reason: 'ensureContrast(${i[0]}, ${i[1]})');
      }
    });

    test('findBestContrast', () {
      for (final e in acc['findBestContrast'] as List) {
        final i = e['in'] as List;
        final m = e['out'] as Map;
        final result = findBestContrast(
            i[0] as String, (i[1] as List).cast<String>());
        expect(result.color, m['color']);
        expect(result.ratio, closeTo((m['ratio'] as num).toDouble(), _eps));
      }
    });
  });

  // ---------------------------------------------------------------------------
  // GENERADORES
  // ---------------------------------------------------------------------------
  group('paridad — generators', () {
    final gen = fixtures['generators'] as Map<String, dynamic>;

    test('generateGrayScale', () {
      for (final e in gen['generateGrayScale'] as List) {
        final g = generateGrayScale(e['in'] as String);
        final m = e['out'] as Map;
        for (final shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
          expect(g[shade], m['$shade'], reason: 'grayScale(${e['in']})[$shade]');
        }
      }
    });

    test('generateColorVariants', () {
      for (final e in gen['generateColorVariants'] as List) {
        final i = e['in'] as List;
        final v = generateColorVariants(i[0] as String, i[1] as String);
        final m = e['out'] as Map;
        expect(v.light, m['light']);
        expect(v.main, m['main']);
        expect(v.dark, m['dark']);
        expect(v.disabled, m['disabled']);
      }
    });

    test('generateAlphaScale', () {
      for (final e in gen['generateAlphaScale'] as List) {
        final a = generateAlphaScale(e['in'] as String);
        final m = e['out'] as Map;
        for (final step in [5, 10, 20, 30, 40, 50, 60, 70, 80, 90]) {
          expect(a[step], m['$step']);
        }
      }
    });

    test('generateSuccessColor', () {
      for (final e in gen['generateSuccessColor'] as List) {
        expect(generateSuccessColor(e['in'] as String), e['out'],
            reason: 'successColor(${e['in']})');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // VALIDADORES
  // ---------------------------------------------------------------------------
  group('paridad — validators', () {
    final val = fixtures['validators'] as Map<String, dynamic>;

    test('isValidHex', () {
      for (final e in val['isValidHex'] as List) {
        expect(isValidHex(e['in'] as String?), e['out'],
            reason: 'isValidHex(${e['in']})');
      }
    });

    test('normalizeHex', () {
      for (final e in val['normalizeHex'] as List) {
        expect(normalizeHex(e['in'] as String), e['out']);
      }
    });
  });
}
