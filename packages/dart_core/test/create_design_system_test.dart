import 'package:ds_yoandry_core/ds_yoandry_core.dart';
import 'package:test/test.dart';

const testPalette = BrandPalette(
  primary: '#4357AD',
  secondary: '#48A9A6',
  background: '#E4DFDA',
  warning: '#D4B483',
  danger: '#C1666B',
);

void main() {
  setUp(clearDesignSystemCache);

  group('createDesignSystem - paleta', () {
    test('respeta el primary de la paleta', () {
      final system = createDesignSystem(testPalette);
      expect(system.colors.variants.primary.main, testPalette.primary);
      expect(system.colors.brand.primary, testPalette.primary);
    });

    test('acepta hex sin #', () {
      final system = createDesignSystem(
        testPalette.copyWith(primary: '4357AD'),
        skipCache: true,
      );
      expect(system.colors.variants.primary.main, '#4357AD');
    });

    test('genera success automáticamente si no se provee', () {
      final system = createDesignSystem(testPalette, skipCache: true);
      expect(system.colors.brand.success, isNotEmpty);
      expect(RegExp(r'^#[a-fA-F0-9]{6}$').hasMatch(system.colors.brand.success),
          isTrue);
    });

    test('respeta el success personalizado', () {
      final system = createDesignSystem(
        testPalette.copyWith(success: '#06D6A0'),
        skipCache: true,
      );
      expect(system.colors.brand.success, '#06D6A0');
    });

    test('usa kDefaultPalette correctamente', () {
      final system = createDesignSystem(kDefaultPalette, skipCache: true);
      expect(system.colors.brand.primary, kDefaultPalette.primary);
    });
  });

  group('createDesignSystem - accesibilidad WCAG AA', () {
    test('onPrimary tiene contraste >= 4.5 sobre primary', () {
      final c = createDesignSystem(testPalette).colors;
      expect(getContrastRatio(c.text.onPrimary, testPalette.primary),
          greaterThanOrEqualTo(4.5));
    });

    test('onSecondary tiene contraste >= 4.5 sobre secondary', () {
      final c = createDesignSystem(testPalette).colors;
      expect(getContrastRatio(c.text.onSecondary, testPalette.secondary),
          greaterThanOrEqualTo(4.5));
    });

    test('onDanger tiene contraste >= 4.4 sobre danger', () {
      final c = createDesignSystem(testPalette).colors;
      expect(getContrastRatio(c.text.onDanger, testPalette.danger),
          greaterThanOrEqualTo(4.4));
    });

    test('onWarning tiene contraste >= 4.5 sobre warning', () {
      final c = createDesignSystem(testPalette).colors;
      expect(getContrastRatio(c.text.onWarning, testPalette.warning),
          greaterThanOrEqualTo(4.5));
    });

    test('onSuccess tiene contraste >= 4.5 sobre success', () {
      final c = createDesignSystem(testPalette).colors;
      expect(getContrastRatio(c.text.onSuccess, c.brand.success),
          greaterThanOrEqualTo(4.5));
    });
  });

  group('createDesignSystem - escala de grises', () {
    test('gray[50] es más claro que gray[900]', () {
      final c = createDesignSystem(testPalette).colors;
      final l50 = int.parse(c.gray[50].substring(1), radix: 16);
      final l900 = int.parse(c.gray[900].substring(1), radix: 16);
      expect(l50, greaterThan(l900));
    });

    test('text.primary usa gray[900]', () {
      final c = createDesignSystem(testPalette).colors;
      expect(c.text.primary, c.gray[900]);
    });

    test('text.secondary usa gray[700]', () {
      final c = createDesignSystem(testPalette).colors;
      expect(c.text.secondary, c.gray[700]);
    });
  });

  group('createDesignSystem - caché', () {
    test('retorna el mismo objeto para la misma paleta', () {
      final s1 = createDesignSystem(testPalette);
      final s2 = createDesignSystem(testPalette);
      expect(identical(s1, s2), isTrue);
    });

    test('retorna objeto diferente con skipCache', () {
      final s1 = createDesignSystem(testPalette);
      final s2 = createDesignSystem(testPalette, skipCache: true);
      expect(identical(s1, s2), isFalse);
    });

    test('retorna objeto diferente para paletas distintas', () {
      final s1 = createDesignSystem(testPalette);
      final s2 = createDesignSystem(testPalette.copyWith(primary: '#FF0000'));
      expect(identical(s1, s2), isFalse);
    });
  });

  group('createDesignSystem - validaciones', () {
    test('lanza error para hex inválido', () {
      expect(
        () => createDesignSystem(testPalette.copyWith(primary: 'not-a-color')),
        throwsArgumentError,
      );
    });
  });

  group('validators', () {
    test('isValidHex', () {
      expect(isValidHex('#4357AD'), isTrue);
      expect(isValidHex('4357AD'), isTrue);
      expect(isValidHex('#435'), isFalse);
      expect(isValidHex('invalid'), isFalse);
      expect(isValidHex(''), isFalse);
      expect(isValidHex(null), isFalse);
    });

    test('normalizeHex', () {
      expect(normalizeHex('4357AD'), '#4357AD');
      expect(normalizeHex('#4357AD'), '#4357AD');
    });
  });

  group('generateSuccessColor', () {
    test('secundario verdoso (hue 80-160) retorna Emerald', () {
      // #4CAF50 tiene hue ~122° → dentro del rango verdoso.
      expect(generateSuccessColor('#4CAF50'), '#22C55E');
    });

    test('secundario teal (hue ~178) genera verde propio, no Emerald', () {
      // #48A9A6 tiene hue ~178° → fuera del rango, genera verde derivado.
      final result = generateSuccessColor('#48A9A6');
      expect(RegExp(r'^#[a-fA-F0-9]{6}$').hasMatch(result), isTrue);
      expect(result, isNot('#22C55E'));
    });

    test('retorna hex válido para secundario no verdoso', () {
      final result = generateSuccessColor('#FF5722');
      expect(RegExp(r'^#[a-fA-F0-9]{6}$').hasMatch(result), isTrue);
    });
  });
}
