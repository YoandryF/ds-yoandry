/// Definiciones de tipos del Design System Core (port de types.ts).
///
/// El core trabaja con colores en formato hexadecimal (String) para replicar
/// exactamente la lógica del paquete original `@yoandryf/core`. La capa de
/// theming de Flutter (`DsThemeController`) expone objetos [Color] nativos.
library;

/// Objeto RGB con valores 0-255.
class RGB {
  const RGB({required this.r, required this.g, required this.b});

  final double r;
  final double g;
  final double b;

  @override
  bool operator ==(Object other) =>
      other is RGB && other.r == r && other.g == g && other.b == b;

  @override
  int get hashCode => Object.hash(r, g, b);

  @override
  String toString() => 'RGB(r: $r, g: $g, b: $b)';
}

/// Objeto HSL con H(0-360), S(0-100), L(0-100).
class HSL {
  HSL({required this.h, required this.s, required this.l});

  double h;
  double s;
  double l;

  @override
  String toString() => 'HSL(h: $h, s: $s, l: $l)';
}

/// Paleta de colores de entrada (5-6 colores en formato hex).
class BrandPalette {
  const BrandPalette({
    required this.primary,
    required this.secondary,
    required this.background,
    required this.warning,
    required this.danger,
    this.success,
  });

  final String primary;
  final String secondary;
  final String background;
  final String warning;
  final String danger;

  /// Opcional — se genera automáticamente a partir de [secondary] si es null.
  final String? success;

  BrandPalette copyWith({
    String? primary,
    String? secondary,
    String? background,
    String? warning,
    String? danger,
    String? success,
  }) {
    return BrandPalette(
      primary: primary ?? this.primary,
      secondary: secondary ?? this.secondary,
      background: background ?? this.background,
      warning: warning ?? this.warning,
      danger: danger ?? this.danger,
      success: success ?? this.success,
    );
  }

  /// Iterador de entradas no nulas, como `Object.entries` en JS.
  Map<String, String> toMap() {
    return <String, String>{
      'primary': primary,
      'secondary': secondary,
      'background': background,
      'warning': warning,
      'danger': danger,
      if (success != null) 'success': success!,
    };
  }
}

/// Paleta completa (con success siempre presente).
class FullPalette {
  const FullPalette({
    required this.primary,
    required this.secondary,
    required this.background,
    required this.warning,
    required this.danger,
    required this.success,
  });

  final String primary;
  final String secondary;
  final String background;
  final String warning;
  final String danger;
  final String success;
}

/// Escala de grises estilo Tailwind (50-900).
class GrayScale {
  const GrayScale({
    required this.shade50,
    required this.shade100,
    required this.shade200,
    required this.shade300,
    required this.shade400,
    required this.shade500,
    required this.shade600,
    required this.shade700,
    required this.shade800,
    required this.shade900,
  });

  final String shade50;
  final String shade100;
  final String shade200;
  final String shade300;
  final String shade400;
  final String shade500;
  final String shade600;
  final String shade700;
  final String shade800;
  final String shade900;

  /// Acceso por índice numérico, como `gray[500]` en JS.
  String operator [](int shade) {
    switch (shade) {
      case 50:
        return shade50;
      case 100:
        return shade100;
      case 200:
        return shade200;
      case 300:
        return shade300;
      case 400:
        return shade400;
      case 500:
        return shade500;
      case 600:
        return shade600;
      case 700:
        return shade700;
      case 800:
        return shade800;
      case 900:
        return shade900;
      default:
        throw ArgumentError('Gray shade $shade no existe. Usa 50-900.');
    }
  }
}

/// Escala de opacidades (5%-90%) en formato rgba().
class AlphaScale {
  const AlphaScale({
    required this.a5,
    required this.a10,
    required this.a20,
    required this.a30,
    required this.a40,
    required this.a50,
    required this.a60,
    required this.a70,
    required this.a80,
    required this.a90,
  });

  final String a5;
  final String a10;
  final String a20;
  final String a30;
  final String a40;
  final String a50;
  final String a60;
  final String a70;
  final String a80;
  final String a90;

  /// Acceso por índice, como `alpha.black[50]` en JS.
  String operator [](int step) {
    switch (step) {
      case 5:
        return a5;
      case 10:
        return a10;
      case 20:
        return a20;
      case 30:
        return a30;
      case 40:
        return a40;
      case 50:
        return a50;
      case 60:
        return a60;
      case 70:
        return a70;
      case 80:
        return a80;
      case 90:
        return a90;
      default:
        throw ArgumentError('Alpha step $step no existe. Usa 5-90.');
    }
  }
}

/// Variantes de un color para estados de UI.
class ColorVariants {
  const ColorVariants({
    required this.light,
    required this.main,
    required this.dark,
    required this.disabled,
  });

  /// 15% más claro — estado hover.
  final String light;

  /// Color original — estado normal.
  final String main;

  /// 12% más oscuro — estado pressed/active.
  final String dark;

  /// Mezclado con background — estado disabled.
  final String disabled;
}

/// Colores semánticos de texto.
class TextColors {
  const TextColors({
    required this.primary,
    required this.secondary,
    required this.tertiary,
    required this.disabled,
    required this.onPrimary,
    required this.onSecondary,
    required this.onDanger,
    required this.onWarning,
    required this.onSuccess,
  });

  final String primary;
  final String secondary;
  final String tertiary;
  final String disabled;
  final String onPrimary;
  final String onSecondary;
  final String onDanger;
  final String onWarning;
  final String onSuccess;

  TextColors copyWith({
    String? primary,
    String? secondary,
    String? tertiary,
    String? disabled,
    String? onPrimary,
    String? onSecondary,
    String? onDanger,
    String? onWarning,
    String? onSuccess,
  }) {
    return TextColors(
      primary: primary ?? this.primary,
      secondary: secondary ?? this.secondary,
      tertiary: tertiary ?? this.tertiary,
      disabled: disabled ?? this.disabled,
      onPrimary: onPrimary ?? this.onPrimary,
      onSecondary: onSecondary ?? this.onSecondary,
      onDanger: onDanger ?? this.onDanger,
      onWarning: onWarning ?? this.onWarning,
      onSuccess: onSuccess ?? this.onSuccess,
    );
  }
}

/// Colores de superficie para modo claro.
class SurfaceColors {
  const SurfaceColors({
    required this.background,
    required this.surface,
    required this.surfaceHover,
    required this.surfaceActive,
    required this.elevated,
  });

  final String background;
  final String surface;
  final String surfaceHover;
  final String surfaceActive;
  final String elevated;
}

/// Colores para modo oscuro.
class DarkModeColors {
  const DarkModeColors({
    required this.background,
    required this.surface,
    required this.surfaceHover,
    required this.surfaceActive,
    required this.elevated,
    required this.textPrimary,
    required this.textSecondary,
    required this.textTertiary,
    required this.divider,
  });

  final String background;
  final String surface;
  final String surfaceHover;
  final String surfaceActive;
  final String elevated;
  final String textPrimary;
  final String textSecondary;
  final String textTertiary;
  final String divider;
}

/// Variantes de todos los colores de marca.
class BrandVariants {
  const BrandVariants({
    required this.primary,
    required this.secondary,
    required this.danger,
    required this.warning,
    required this.success,
  });

  final ColorVariants primary;
  final ColorVariants secondary;
  final ColorVariants danger;
  final ColorVariants warning;
  final ColorVariants success;
}

/// Colores con escalas de opacidad.
class AlphaColors {
  const AlphaColors({
    required this.black,
    required this.white,
    required this.primary,
  });

  final AlphaScale black;
  final AlphaScale white;
  final AlphaScale primary;
}

/// Todos los colores del Design System.
class DesignSystemColors {
  const DesignSystemColors({
    required this.brand,
    required this.gray,
    required this.variants,
    required this.text,
    required this.surface,
    required this.dark,
    required this.alpha,
  });

  final FullPalette brand;
  final GrayScale gray;
  final BrandVariants variants;
  final TextColors text;
  final SurfaceColors surface;
  final DarkModeColors dark;
  final AlphaColors alpha;

  DesignSystemColors copyWith({
    TextColors? text,
    SurfaceColors? surface,
  }) {
    return DesignSystemColors(
      brand: brand,
      gray: gray,
      variants: variants,
      text: text ?? this.text,
      surface: surface ?? this.surface,
      dark: dark,
      alpha: alpha,
    );
  }
}

/// Propiedades de sombra (agnóstico de plataforma).
class ShadowStyle {
  const ShadowStyle({
    this.shadowOpacity,
    this.shadowRadius,
    this.shadowOffsetX,
    this.shadowOffsetY,
    this.shadowColor,
    this.elevation,
  });

  final double? shadowOpacity;
  final double? shadowRadius;
  final double? shadowOffsetX;
  final double? shadowOffsetY;
  final String? shadowColor;
  final double? elevation;
}

/// Sombras predefinidas (none/sm/md/lg/xl).
class PlatformShadows {
  const PlatformShadows({
    required this.none,
    required this.sm,
    required this.md,
    required this.lg,
    required this.xl,
  });

  final ShadowStyle none;
  final ShadowStyle sm;
  final ShadowStyle md;
  final ShadowStyle lg;
  final ShadowStyle xl;
}

/// Configuración de ripple (feedback táctil).
class RippleConfig {
  const RippleConfig({required this.color, required this.borderless});
  final String color;
  final bool borderless;
}

/// Configuración de highlight (feedback táctil).
class HighlightConfig {
  const HighlightConfig({required this.underlayColor});
  final String underlayColor;
}

/// Feedback táctil por color.
class PlatformFeedback {
  const PlatformFeedback({required this.ripple, required this.highlight});
  final RippleConfig? ripple;
  final HighlightConfig? highlight;
}

/// Feedback por color de marca.
class FeedbackColors {
  const FeedbackColors({
    required this.primary,
    required this.secondary,
    required this.danger,
  });

  final PlatformFeedback primary;
  final PlatformFeedback secondary;
  final PlatformFeedback danger;
}

/// Utilidades específicas por plataforma.
class PlatformSpecific {
  const PlatformSpecific({required this.shadow, required this.feedback});
  final PlatformShadows shadow;
  final FeedbackColors feedback;
}

/// Sistema de diseño completo.
class DesignSystem {
  const DesignSystem({required this.colors, required this.platform});
  final DesignSystemColors colors;
  final PlatformSpecific platform;

  DesignSystem copyWith({DesignSystemColors? colors}) {
    return DesignSystem(
      colors: colors ?? this.colors,
      platform: platform,
    );
  }
}
