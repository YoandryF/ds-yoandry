/**
 * @fileoverview Servicio de tema para Angular con Signals
 * @module @ds-yoandry/angular/theme.service
 *
 * @author Yoandry
 * @version 4.2.0
 */

import { Injectable, signal, computed, effect, Injector, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createDesignSystem, DEFAULT_PALETTE } from '@ds-yoandry/core';
import type { BrandPalette, DesignSystem, GrayScale } from '@ds-yoandry/core';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Colores aplanados del tema actual.
 * Misma API simplificada que el hook de React.
 */
export interface ThemeColors {
    // Fondos
    bg: string;
    surface: string;
    surfaceElevated: string;
    surfaceHover: string;
    // Texto
    text: string;
    textSecondary: string;
    textMuted: string;
    textDisabled: string;
    // Colores de marca
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    danger: string;
    dangerLight: string;
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    // Texto sobre colores
    onPrimary: string;
    onSecondary: string;
    onDanger: string;
    onSuccess: string;
    onWarning: string;
    // Utilidades
    gray: GrayScale;
    border: string;
    divider: string;
}

/**
 * Servicio de tema para Angular 16+ con soporte completo de Signals.
 *
 * Características:
 * - Detecta preferencia del sistema via matchMedia
 * - Persiste la selección en localStorage
 * - Aplica CSS custom properties al :root automáticamente
 * - API de colores aplanada idéntica al hook de React
 *
 * @example
 * // Proveer en AppModule o bootstrapApplication
 * import { provideDesignSystem } from '@ds-yoandry/angular';
 *
 * bootstrapApplication(AppComponent, {
 *     providers: [provideDesignSystem()]
 * });
 *
 * @example
 * // Usar en componente
 * @Component({
 *     template: `
 *         <div [style.background]="theme.colors().bg">
 *             <p [style.color]="theme.colors().text">Hola mundo</p>
 *             <button
 *                 [style.background]="theme.colors().primary"
 *                 [style.color]="theme.colors().onPrimary"
 *                 (click)="theme.toggleTheme()"
 *             >
 *                 {{ theme.isDark() ? '☀️ Claro' : '🌙 Oscuro' }}
 *             </button>
 *         </div>
 *     `
 * })
 * export class AppComponent {
 *     theme = inject(ThemeService);
 * }
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly injector = inject(Injector);
    private readonly storageKey = 'ds-yoandry-theme';
    private readonly designSystem: DesignSystem;

    // =========================================================================
    // ESTADO (Signals)
    // =========================================================================

    private readonly _themeMode = signal<ThemeMode>('system');
    private readonly _systemPrefersDark = signal(false);

    /** true si el tema activo es oscuro */
    readonly isDark = computed(() => {
        const mode = this._themeMode();
        return mode === 'system' ? this._systemPrefersDark() : mode === 'dark';
    });

    /** Modo de tema actual: 'light' | 'dark' | 'system' */
    readonly themeMode = this._themeMode.asReadonly();

    /** Colores aplanados del tema activo */
    readonly colors = computed((): ThemeColors => {
        const ds = this.designSystem.colors;
        const dark = this.isDark();
        const gray = ds.gray as unknown as Record<number, string>;

        return {
            bg: dark ? ds.dark.background : ds.surface.background,
            surface: dark ? ds.dark.surface : ds.surface.surface,
            surfaceElevated: dark ? ds.dark.elevated : ds.surface.elevated,
            surfaceHover: dark ? ds.dark.surfaceHover : ds.surface.surfaceHover,

            text: dark ? ds.dark.textPrimary : ds.text.primary,
            textSecondary: dark ? ds.dark.textSecondary : ds.text.secondary,
            textMuted: dark ? ds.dark.textTertiary : ds.text.tertiary,
            textDisabled: ds.text.disabled,

            primary: ds.variants.primary.main,
            primaryLight: ds.variants.primary.light,
            primaryDark: ds.variants.primary.dark,
            secondary: ds.variants.secondary.main,
            secondaryLight: ds.variants.secondary.light,
            danger: ds.variants.danger.main,
            dangerLight: ds.variants.danger.light,
            success: ds.variants.success.main,
            successLight: ds.variants.success.light,
            warning: ds.variants.warning.main,
            warningLight: ds.variants.warning.light,

            onPrimary: ds.text.onPrimary,
            onSecondary: ds.text.onSecondary,
            onDanger: ds.text.onDanger,
            onSuccess: ds.text.onSuccess,
            onWarning: ds.text.onWarning,

            gray: ds.gray,
            border: gray[200],
            divider: dark ? gray[700] : gray[200],
        };
    });

    /** Sombras del Design System */
    readonly shadow = computed(() => this.designSystem.platform.shadow);

    constructor(palette: BrandPalette = DEFAULT_PALETTE) {
        this.designSystem = createDesignSystem(palette);

        if (isPlatformBrowser(this.platformId)) {
            this.initSystemDetection();
            this.loadSavedTheme();
            this.initCSSEffect();
        }
    }

    // =========================================================================
    // MÉTODOS PÚBLICOS
    // =========================================================================

    /**
     * Cambia el modo de tema.
     *
     * @example
     * theme.setTheme('dark');
     * theme.setTheme('system');
     */
    setTheme(mode: ThemeMode): void {
        this._themeMode.set(mode);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.storageKey, mode);
        }
    }

    /**
     * Alterna entre modo claro y oscuro.
     *
     * @example
     * theme.toggleTheme();
     */
    toggleTheme(): void {
        this.setTheme(this.isDark() ? 'light' : 'dark');
    }

    /**
     * Retorna el Design System completo para casos avanzados.
     */
    getDesignSystem(): DesignSystem {
        return this.designSystem;
    }

    // =========================================================================
    // PRIVADOS
    // =========================================================================

    private initSystemDetection(): void {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        this._systemPrefersDark.set(media.matches);
        media.addEventListener('change', (e) => {
            this._systemPrefersDark.set(e.matches);
        });
    }

    private loadSavedTheme(): void {
        const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
            this._themeMode.set(saved);
        }
    }

    private initCSSEffect(): void {
        // Aplica CSS custom properties al :root para usarlas en stylesheets
        effect(() => {
            const c = this.colors();
            const root = document.documentElement;

            const properties: Record<string, string> = {
                '--ds-bg': c.bg,
                '--ds-surface': c.surface,
                '--ds-surface-elevated': c.surfaceElevated,
                '--ds-text': c.text,
                '--ds-text-secondary': c.textSecondary,
                '--ds-text-muted': c.textMuted,
                '--ds-primary': c.primary,
                '--ds-primary-light': c.primaryLight,
                '--ds-secondary': c.secondary,
                '--ds-danger': c.danger,
                '--ds-success': c.success,
                '--ds-warning': c.warning,
                '--ds-border': c.border,
                '--ds-divider': c.divider,
            };

            for (const [prop, value] of Object.entries(properties)) {
                root.style.setProperty(prop, value);
            }

            // Clase en el body para CSS convencional
            document.body.classList.toggle('ds-dark', this.isDark());
            document.body.classList.toggle('ds-light', !this.isDark());
        }, { injector: this.injector });
    }
}
