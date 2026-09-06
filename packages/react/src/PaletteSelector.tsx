/**
 * @fileoverview Componente selector de paleta de colores
 * @module @yoandryf/react/PaletteSelector
 *
 * @author Yoandry
 * @version 4.3.0
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './useTheme';

/**
 * Selector de paleta de colores listo para usar.
 * Muestra las paletas disponibles como chips con una muestra del color primary.
 * Marca la paleta activa y persiste la selección automáticamente.
 *
 * @example
 * import { PaletteSelector } from '@yoandryf/react';
 *
 * function SettingsScreen() {
 *     return (
 *         <View>
 *             <Text>Elige tu paleta:</Text>
 *             <PaletteSelector />
 *         </View>
 *     );
 * }
 */
export function PaletteSelector() {
    const {
        paletteName,
        setPalette,
        availablePalettes,
        text,
        surface,
        primary,
        border,
        shadow,
    } = useTheme();

    return (
        <View style={styles.container}>
            {availablePalettes.map((p) => {
                const active = paletteName === p.name;
                return (
                    <TouchableOpacity
                        key={p.name}
                        onPress={() => setPalette(p.name)}
                        activeOpacity={0.8}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: surface,
                                borderColor: active ? primary : border,
                                borderWidth: active ? 2 : 1,
                            },
                            active && shadow.sm,
                        ]}
                    >
                        <View style={[styles.swatch, { backgroundColor: p.swatch }]} />
                        <Text style={[styles.label, { color: text }]}>{p.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        gap: 8,
    },
    swatch: {
        width: 18,
        height: 18,
        borderRadius: 9,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});
