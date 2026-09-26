import 'package:ds_yoandry_flutter/ds_yoandry_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues(<String, Object>{});
    clearDesignSystemCache();
  });

  group('hexToColor', () {
    test('convierte hex a Color opaco', () {
      expect(hexToColor('#4357AD'), const Color(0xFF4357AD));
      expect(hexToColor('FFFFFF'), const Color(0xFFFFFFFF));
    });
  });

  group('rgbaToColor', () {
    test('convierte rgba a Color con opacidad', () {
      final c = rgbaToColor('rgba(0, 0, 0, 0.5)');
      expect(c.red, 0);
      expect(c.green, 0);
      expect(c.blue, 0);
      // 0.5 * 255 ≈ 128
      expect(c.alpha, closeTo(128, 1));
    });
  });

  group('DsThemeController', () {
    test('modo por defecto e isDark', () {
      final c = DsThemeController(
        initialMode: DsThemeMode.light,
        persist: false,
      );
      expect(c.mode, DsThemeMode.light);
      expect(c.isDark, isFalse);
      c.dispose();
    });

    test('toggleTheme alterna claro/oscuro', () async {
      final c = DsThemeController(
        initialMode: DsThemeMode.light,
        persist: false,
      );
      await c.toggleTheme();
      expect(c.mode, DsThemeMode.dark);
      expect(c.isDark, isTrue);
      c.dispose();
    });

    test('setPalette cambia la paleta', () async {
      final c = DsThemeController(persist: false);
      expect(c.paletteName, PaletteName.defaultPalette);
      await c.setPalette(PaletteName.ocean);
      expect(c.paletteName, PaletteName.ocean);
      expect(c.designSystem.colors.brand.primary, '#0077B6');
      c.dispose();
    });

    test('paleta personalizada ignora setPalette', () async {
      final c = DsThemeController(
        customPalette: const BrandPalette(
          primary: '#FF6B35',
          secondary: '#F7C59F',
          background: '#FFFAF5',
          warning: '#FFD166',
          danger: '#EF476F',
        ),
        persist: false,
      );
      await c.setPalette(PaletteName.ocean);
      expect(c.designSystem.colors.brand.primary, '#FF6B35');
      c.dispose();
    });

    test('theme expone colores resueltos', () {
      final c = DsThemeController(
        initialMode: DsThemeMode.light,
        persist: false,
      );
      expect(c.theme.primary, const Color(0xFF4357AD));
      c.dispose();
    });
  });

  group('DsThemeProvider + DsTheme.of', () {
    testWidgets('expone el tema al árbol y toggle funciona', (tester) async {
      await tester.pumpWidget(
        DsThemeProvider(
          defaultMode: DsThemeMode.light,
          persist: false,
          child: Builder(
            builder: (context) {
              final t = DsTheme.of(context);
              return MaterialApp(
                home: Scaffold(
                  backgroundColor: t.bg,
                  body: Text('dark=${t.isDark}'),
                ),
              );
            },
          ),
        ),
      );

      expect(find.text('dark=false'), findsOneWidget);

      // Cambiar a oscuro via controller y re-renderizar.
      final context = tester.element(find.byType(Scaffold));
      await DsTheme.read(context).toggleTheme();
      await tester.pump();

      expect(find.text('dark=true'), findsOneWidget);
    });
  });
}
