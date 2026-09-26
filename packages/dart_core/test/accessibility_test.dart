import 'package:ds_yoandry_core/ds_yoandry_core.dart';
import 'package:test/test.dart';

void main() {
  group('getRelativeLuminance', () {
    test('blanco tiene luminancia 1', () {
      expect(getRelativeLuminance('#FFFFFF'), closeTo(1, 0.01));
    });

    test('negro tiene luminancia 0', () {
      expect(getRelativeLuminance('#000000'), closeTo(0, 0.01));
    });

    test('luminancia está entre 0 y 1', () {
      const colors = ['#4357AD', '#48A9A6', '#C1666B', '#D4B483', '#22C55E'];
      for (final color in colors) {
        final l = getRelativeLuminance(color);
        expect(l, greaterThanOrEqualTo(0));
        expect(l, lessThanOrEqualTo(1));
      }
    });

    test('retorna 0 para color inválido', () {
      expect(getRelativeLuminance('invalid'), 0);
    });

    test('colores claros > oscuros', () {
      expect(getRelativeLuminance('#FFFFFF'),
          greaterThan(getRelativeLuminance('#000000')));
      expect(getRelativeLuminance('#EEEEEE'),
          greaterThan(getRelativeLuminance('#222222')));
    });
  });

  group('getContrastRatio', () {
    test('negro sobre blanco tiene ratio 21', () {
      expect(getContrastRatio('#000000', '#FFFFFF'), closeTo(21, 0.01));
    });

    test('blanco sobre blanco tiene ratio 1', () {
      expect(getContrastRatio('#FFFFFF', '#FFFFFF'), closeTo(1, 0.01));
    });

    test('ratio es simétrico', () {
      final r1 = getContrastRatio('#4357AD', '#FFFFFF');
      final r2 = getContrastRatio('#FFFFFF', '#4357AD');
      expect(r1, closeTo(r2, 0.001));
    });

    test('primary sobre blanco cumple AA (> 4.5)', () {
      expect(getContrastRatio('#4357AD', '#FFFFFF'), greaterThan(4.5));
    });
  });

  group('meetsContrastAA', () {
    test('negro sobre blanco cumple AA', () {
      expect(meetsContrastAA('#000000', '#FFFFFF'), isTrue);
    });

    test('blanco sobre blanco no cumple AA', () {
      expect(meetsContrastAA('#FFFFFF', '#FFFFFF'), isFalse);
    });

    test('gris medio no cumple AA texto normal', () {
      expect(meetsContrastAA('#777777', '#FFFFFF'), isFalse);
    });

    test('gris medio cumple AA texto grande', () {
      expect(meetsContrastAA('#777777', '#FFFFFF', true), isTrue);
    });
  });

  group('meetsContrastAAA', () {
    test('negro sobre blanco cumple AAA', () {
      expect(meetsContrastAAA('#000000', '#FFFFFF'), isTrue);
    });

    test('gris oscuro #333 cumple AAA', () {
      expect(meetsContrastAAA('#333333', '#FFFFFF'), isTrue);
    });

    test('gris medio #666 no cumple AAA texto normal', () {
      expect(meetsContrastAAA('#666666', '#FFFFFF'), isFalse);
    });

    test('gris medio #666 cumple AAA texto grande', () {
      expect(meetsContrastAAA('#666666', '#FFFFFF', true), isTrue);
    });
  });

  group('getContrastColor', () {
    test('retorna blanco sobre fondos oscuros', () {
      expect(getContrastColor('#000000'), '#FFFFFF');
      expect(getContrastColor('#4357AD'), '#FFFFFF');
    });

    test('retorna oscuro sobre fondos claros', () {
      expect(getContrastColor('#FFFFFF'), '#1A1A1A');
      expect(getContrastColor('#E4DFDA'), '#1A1A1A');
      expect(getContrastColor('#D4B483'), '#1A1A1A');
    });

    test('usa colores personalizados', () {
      expect(getContrastColor('#000000', '#F0F0F0', '#0A0A0A'), '#F0F0F0');
    });
  });

  group('ensureContrast', () {
    test('retorna el mismo color si ya cumple', () {
      expect(ensureContrast('#000000', '#FFFFFF'), '#000000');
    });

    test('ajusta un gris que no cumple AA contra blanco', () {
      final adjusted = ensureContrast('#888888', '#FFFFFF');
      expect(getContrastRatio(adjusted, '#FFFFFF'), greaterThanOrEqualTo(4.5));
    });

    test('ajusta un color claro que no cumple AA', () {
      final adjusted = ensureContrast('#CCCCCC', '#FFFFFF');
      expect(getContrastRatio(adjusted, '#FFFFFF'), greaterThanOrEqualTo(4.5));
    });

    test('ajusta para contraste personalizado (ratio 3)', () {
      final adjusted = ensureContrast('#888888', '#FFFFFF', 3);
      expect(getContrastRatio(adjusted, '#FFFFFF'), greaterThanOrEqualTo(3));
    });
  });

  group('findBestContrast', () {
    test('encuentra blanco como mejor contraste sobre negro', () {
      final result =
          findBestContrast('#000000', ['#FFFFFF', '#888888', '#CCCCCC']);
      expect(result.color, '#FFFFFF');
      expect(result.ratio, closeTo(21, 0.01));
    });

    test('encuentra negro como mejor contraste sobre blanco', () {
      final result =
          findBestContrast('#FFFFFF', ['#000000', '#888888', '#CCCCCC']);
      expect(result.color, '#000000');
    });

    test('retorna el primer candidato si solo hay uno', () {
      expect(findBestContrast('#FFFFFF', ['#FF0000']).color, '#FF0000');
    });
  });
}
