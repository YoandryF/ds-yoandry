/// Sistema de caché y memoización (port de cache.ts).
library;

import 'types.dart';

/// Caché de sistemas de diseño generados, indexado por paleta.
final Map<String, DesignSystem> designSystemCache = <String, DesignSystem>{};

/// Genera una clave única para una paleta de colores.
///
/// Ordena las entradas alfabéticamente y las une con `|`, igual que el original:
/// `background:#E4DFDA|danger:#C1666B|primary:#4357AD|...`
String generateCacheKey(Map<String, String> palette) {
  final entries = palette.entries.toList()
    ..sort((a, b) => a.key.compareTo(b.key));
  return entries.map((e) => '${e.key}:${e.value}').join('|');
}

/// Estadísticas de la caché.
class CacheStats {
  const CacheStats({required this.size, required this.keys});
  final int size;
  final List<String> keys;
}

/// Limpia la caché de sistemas de diseño.
void clearDesignSystemCache() => designSystemCache.clear();

/// Obtiene estadísticas de la caché.
CacheStats getCacheStats() => CacheStats(
      size: designSystemCache.length,
      keys: designSystemCache.keys.toList(),
    );
