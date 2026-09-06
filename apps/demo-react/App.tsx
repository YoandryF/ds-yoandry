/**
 * @fileoverview Demo App - Design System Showcase
 * @description Muestra todos los colores, variantes, sombras y el toggle de tema.
 */

import { StatusBar } from 'expo-status-bar';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { ThemeProvider, useTheme } from '@ds-yoandry/react';

// =============================================================================
// ROOT
// =============================================================================

export default function App() {
    return (
        <ThemeProvider defaultTheme="system">
            <Demo />
        </ThemeProvider>
    );
}

// =============================================================================
// DEMO
// =============================================================================

function Demo() {
    const { bg, isDark } = useTheme();

    return (
        <ScrollView style={[styles.root, { backgroundColor: bg }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Header />
            <ColorsSection />
            <VariantsSection />
            <TypographySection />
            <ShadowsSection />
            <Footer />
        </ScrollView>
    );
}

// =============================================================================
// HEADER
// =============================================================================

function Header() {
    const { bg, text, textMuted, primary, isDark, toggleTheme } = useTheme();

    return (
        <View style={[styles.header, { backgroundColor: bg }]}>
            <View>
                <Text style={[styles.title, { color: text }]}>
                    🎨 Design System
                </Text>
                <Text style={[styles.subtitle, { color: textMuted }]}>
                    @ds-yoandry/react · v4.2.0
                </Text>
            </View>
            <TouchableOpacity
                style={[styles.themeBtn, { backgroundColor: primary }]}
                onPress={toggleTheme}
            >
                <Text style={styles.themeBtnText}>
                    {isDark ? '☀️' : '🌙'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// =============================================================================
// COLORES DE MARCA
// =============================================================================

function ColorsSection() {
    const { text, textMuted, primary, secondary, danger, success, warning } = useTheme();

    const brandColors = [
        { name: 'Primary', color: primary },
        { name: 'Secondary', color: secondary },
        { name: 'Danger', color: danger },
        { name: 'Success', color: success },
        { name: 'Warning', color: warning },
    ];

    return (
        <Section title="Brand Colors">
            <View style={styles.colorGrid}>
                {brandColors.map(({ name, color }) => (
                    <View key={name} style={styles.colorItem}>
                        <View style={[styles.colorSwatch, { backgroundColor: color }]} />
                        <Text style={[styles.colorName, { color: text }]}>{name}</Text>
                        <Text style={[styles.colorHex, { color: textMuted }]}>{color}</Text>
                    </View>
                ))}
            </View>
        </Section>
    );
}

// =============================================================================
// VARIANTES (estados de botón)
// =============================================================================

function VariantsSection() {
    const { text, primary, primaryLight, primaryDark, danger, dangerLight, success, successLight } = useTheme();

    return (
        <Section title="Variantes de Color">
            <VariantRow label="Primary" light={primaryLight} main={primary} dark={primaryDark} />
            <View style={styles.variantSpacer} />
            <VariantRow label="Danger" light={dangerLight} main={danger} dark={dangerLight} />
            <View style={styles.variantSpacer} />
            <VariantRow label="Success" light={successLight} main={success} dark={successLight} />
        </Section>
    );
}

function VariantRow({ label, light, main, dark }: { label: string; light: string; main: string; dark: string }) {
    const { text, textMuted } = useTheme();

    return (
        <View>
            <Text style={[styles.variantLabel, { color: textMuted }]}>{label}</Text>
            <View style={styles.variantRow}>
                {[
                    { name: 'light', color: light },
                    { name: 'main', color: main },
                    { name: 'dark', color: dark },
                ].map(({ name, color }) => (
                    <View key={name} style={styles.variantItem}>
                        <View style={[styles.variantSwatch, { backgroundColor: color }]} />
                        <Text style={[styles.variantName, { color: textMuted }]}>{name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

// =============================================================================
// TIPOGRAFÍA
// =============================================================================

function TypographySection() {
    const { text, textSecondary, textMuted, textDisabled } = useTheme();

    return (
        <Section title="Tipografía">
            <Text style={[styles.typoItem, { color: text, fontSize: 20, fontWeight: 'bold' }]}>
                text — Título principal
            </Text>
            <Text style={[styles.typoItem, { color: textSecondary, fontSize: 16 }]}>
                textSecondary — Descripción
            </Text>
            <Text style={[styles.typoItem, { color: textMuted, fontSize: 14 }]}>
                textMuted — Placeholder / hint
            </Text>
            <Text style={[styles.typoItem, { color: textDisabled, fontSize: 14 }]}>
                textDisabled — Estado deshabilitado
            </Text>
        </Section>
    );
}

// =============================================================================
// SOMBRAS
// =============================================================================

function ShadowsSection() {
    const { surfaceElevated, text, textMuted, shadow } = useTheme();

    return (
        <Section title="Sombras">
            <View style={styles.shadowGrid}>
                {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                    <View
                        key={size}
                        style={[
                            styles.shadowCard,
                            { backgroundColor: surfaceElevated },
                            shadow[size],
                        ]}
                    >
                        <Text style={[styles.shadowLabel, { color: text }]}>{size}</Text>
                        <Text style={[styles.shadowSub, { color: textMuted }]}>shadow.{size}</Text>
                    </View>
                ))}
            </View>
        </Section>
    );
}

// =============================================================================
// BOTONES DE EJEMPLO
// =============================================================================

function Footer() {
    const { primary, onPrimary, danger, onDanger, success, onSuccess, secondary, onSecondary, shadow } = useTheme();

    return (
        <Section title="Botones">
            <View style={styles.buttonGrid}>
                {[
                    { label: 'Primary', bg: primary, textColor: onPrimary },
                    { label: 'Danger', bg: danger, textColor: onDanger },
                    { label: 'Success', bg: success, textColor: onSuccess },
                    { label: 'Secondary', bg: secondary, textColor: onSecondary },
                ].map(({ label, bg, textColor }) => (
                    <TouchableOpacity
                        key={label}
                        style={[styles.button, { backgroundColor: bg }, shadow.sm]}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ height: 40 }} />
        </Section>
    );
}

// =============================================================================
// COMPONENTE AUXILIAR
// =============================================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    const { text, divider } = useTheme();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>{title}</Text>
            <View style={[styles.divider, { backgroundColor: divider }]} />
            {children}
        </View>
    );
}

// =============================================================================
// ESTILOS ESTÁTICOS
// =============================================================================

const styles = StyleSheet.create({
    root: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
    },
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 13, marginTop: 2 },
    themeBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    themeBtnText: { fontSize: 20 },

    // Section
    section: { paddingHorizontal: 20, marginBottom: 28 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
    divider: { height: 1, marginBottom: 16 },

    // Brand colors
    colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    colorItem: { alignItems: 'center', width: 64 },
    colorSwatch: { width: 56, height: 56, borderRadius: 12, marginBottom: 6 },
    colorName: { fontSize: 12, fontWeight: '600' },
    colorHex: { fontSize: 10, marginTop: 2 },

    // Variants
    variantLabel: { fontSize: 12, marginBottom: 6 },
    variantRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
    variantItem: { alignItems: 'center', flex: 1 },
    variantSwatch: { width: '100%', height: 40, borderRadius: 8, marginBottom: 4 },
    variantName: { fontSize: 11 },
    variantSpacer: { height: 12 },

    // Typography
    typoItem: { marginBottom: 8 },

    // Shadows
    shadowGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    shadowCard: { width: 72, height: 72, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    shadowLabel: { fontSize: 16, fontWeight: 'bold' },
    shadowSub: { fontSize: 10, marginTop: 2 },

    // Buttons
    buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center' },
    buttonText: { fontSize: 15, fontWeight: '600' },
});
