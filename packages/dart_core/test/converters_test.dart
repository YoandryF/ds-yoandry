import 'package:ds_yoandry_core/ds_yoandry_core.dart';
import 'package:test/test.dart';

void main() {
  group('hexToRgb', () {
    test('convierte hex con # a RGB', () {
      expect(hexToRgb('#4357AD'), const RGB(r: 67, g: 87, b: 173));
    });

    test('convierte hex sin # a RGB', () {
      expect(hexToRgb('4357AD'), const RGB(r: 67, g: 87, b: 173));
    });

    test('convierte blanco correctamente', () {
      expect(hexToRgb('#FFFFFF'), const RGB(r: 255, g: 255, b: 255));
    });

    test('convierte negro correctamente', () {
      expect(hexToRgb('#000000'), const RGB(r: 0, g: 0, b: 0));
    });

    test('retorna null para hex inválido', () {
      expect(hexToRgb('invalid'), isNull);
      expect(hexToRgb('#GGG'), isNull);
      expect(hexToRgb(''), isNull);
    });

    test('es case-insensitive', () {
      expect(hexToRgb('#ff0000'), hexToRgb('#FF0000'));
    });
  });

  group('rgbToHex', () {
    test('convierte RGB a hex', () {
      expect(rgbToHex(67, 87, 173), '#4357ad');
    });

    test('convierte negro a #000000', () {
      expect(rgbToHex(0, 0, 0), '#000000');
    });

    test('convierte blanco a #ffffff', () {
      expect(rgbToHex(255, 255, 255), '#ffffff');
    });

    test('normaliza valores fuera de rango', () {
      expect(rgbToHex(300, -10, 128), '#ff0080');
    });

    test('roundtrip hex → rgb → hex', () {
      const original = '#4357ad';
      final rgb = hexToRgb(original)!;
      expect(rgbToHex(rgb.r, rgb.g, rgb.b), original);
    });
  });

  group('hexToRgba', () {
    test('genera rgba con opacidad', () {
      expect(hexToRgba('#4357AD', 0.5), 'rgba(67, 87, 173, 0.5)');
    });

    test('genera rgba con opacidad 0', () {
      expect(hexToRgba('#000000', 0), 'rgba(0, 0, 0, 0)');
    });

    test('genera rgba con opacidad 1', () {
      expect(hexToRgba('#FFFFFF', 1), 'rgba(255, 255, 255, 1)');
    });

    test('retorna fallback para hex inválido', () {
      expect(hexToRgba('invalid', 0.5), 'rgba(0, 0, 0, 0.5)');
    });
  });

  group('rgbToHsl', () {
    test('convierte rojo puro', () {
      final hsl = rgbToHsl(255, 0, 0);
      expect(hsl.h, closeTo(0, 0.01));
      expect(hsl.s, closeTo(100, 0.01));
      expect(hsl.l, closeTo(50, 0.01));
    });

    test('convierte verde puro', () {
      final hsl = rgbToHsl(0, 255, 0);
      expect(hsl.h, closeTo(120, 0.01));
      expect(hsl.s, closeTo(100, 0.01));
      expect(hsl.l, closeTo(50, 0.01));
    });

    test('convierte azul puro', () {
      final hsl = rgbToHsl(0, 0, 255);
      expect(hsl.h, closeTo(240, 0.01));
      expect(hsl.s, closeTo(100, 0.01));
      expect(hsl.l, closeTo(50, 0.01));
    });

    test('convierte gris a saturación 0', () {
      final hsl = rgbToHsl(128, 128, 128);
      expect(hsl.s, closeTo(0, 0.01));
      expect(hsl.l, closeTo(50, 1));
    });

    test('convierte negro', () {
      expect(rgbToHsl(0, 0, 0).l, closeTo(0, 0.01));
    });

    test('convierte blanco', () {
      expect(rgbToHsl(255, 255, 255).l, closeTo(100, 0.01));
    });
  });

  group('hslToRgb', () {
    test('convierte rojo puro', () {
      final rgb = hslToRgb(0, 100, 50);
      expect(rgb.r.round(), 255);
      expect(rgb.g.round(), 0);
      expect(rgb.b.round(), 0);
    });

    test('convierte verde puro', () {
      final rgb = hslToRgb(120, 100, 50);
      expect(rgb.r.round(), 0);
      expect(rgb.g.round(), 255);
      expect(rgb.b.round(), 0);
    });

    test('convierte gris (s=0)', () {
      final rgb = hslToRgb(0, 0, 50);
      expect(rgb.r.round(), 128);
      expect(rgb.g.round(), 128);
      expect(rgb.b.round(), 128);
    });

    test('roundtrip rgb → hsl → rgb', () {
      const original = RGB(r: 67, g: 87, b: 173);
      final hsl = rgbToHsl(original.r, original.g, original.b);
      final back = hslToRgb(hsl.h, hsl.s, hsl.l);
      expect(back.r.round(), original.r);
      expect(back.g.round(), original.g);
      expect(back.b.round(), original.b);
    });
  });
}
