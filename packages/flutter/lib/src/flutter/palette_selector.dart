/// Selector de paletas (port del PaletteSelector de React).
library;

import 'package:flutter/material.dart';

import 'color_utils.dart';
import 'ds_theme_provider.dart';

/// Fila de swatches para cambiar la paleta activa en runtime.
///
/// ```dart
/// const DsPaletteSelector()
/// ```
class DsPaletteSelector extends StatelessWidget {
  const DsPaletteSelector({super.key, this.size = 40, this.spacing = 12});

  /// Diámetro de cada swatch.
  final double size;

  /// Espacio entre swatches.
  final double spacing;

  @override
  Widget build(BuildContext context) {
    final controller = DsTheme.controller(context);
    final active = controller.paletteName;

    return Wrap(
      spacing: spacing,
      runSpacing: spacing,
      children: controller.availablePalettes.map((info) {
        final selected = info.name == active;
        return GestureDetector(
          onTap: () => controller.setPalette(info.name),
          child: Tooltip(
            message: info.label,
            child: Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                color: hexToColor(info.swatch),
                shape: BoxShape.circle,
                border: Border.all(
                  color: selected
                      ? hexToColor(info.swatch)
                      : Colors.transparent,
                  width: 3,
                ),
                boxShadow: selected
                    ? <BoxShadow>[
                        BoxShadow(
                          color: hexToColor(info.swatch)
                              .withOpacity(0.4),
                          blurRadius: 8,
                          spreadRadius: 1,
                        ),
                      ]
                    : null,
              ),
              child: selected
                  ? const Icon(Icons.check, color: Colors.white, size: 20)
                  : null,
            ),
          ),
        );
      }).toList(),
    );
  }
}
