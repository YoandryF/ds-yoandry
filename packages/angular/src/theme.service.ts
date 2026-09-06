/**
 * @fileoverview Servicio de tema para Angular 20+
 * @module @yoandryf/angular/theme.service
 *
 * @author Yoandry
 * @version 4.2.0
 */

import {
    Injectable,
    signal,
    computed,
    effect,
    inject,
    PLATFORM_ID,
    DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createDesignSystem, DEFAULT_PALETTE } from '@yoandryf/core';
import type { BrandPalette, DesignSystem, GrayScale } from '@yoandryf/core';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Colores aplanados del tema actual.
 * API idéntica al hook `useTheme()` de React.
 */
export interface ThemeColors {
    bg: string;
    surface: string;
    surfaceElevated: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    textDisabled: string;
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
    onPrimary: string;
    onSecondary: string;
    onDanger: string;
    onSuccess: string;
    onWarning: string;
    gray: GrayScale;
    border: string;
    divider: string;
}

/**
 * Servicio de tema para Angular 20+.
 *
 * Usa la API moderna de Signals de Angular 20:
 * - `signal()` para estado mutable
 * - `computed()` para derivaciones reactivas
 * - `effect()` para efectos secundarios (CSS vars, persistencia)
 * - `input()` en directivas
 *
 * @example
 * // Proveer en main.ts
 * import { provideDesignSystem } from '@yoandryf/angular';
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
 *             <p [style.color]="theme.colors().text">Hola</p>
 *             <button (click)="theme.toggleTheme()">
 *                 {{ theme.isDark() ? '☀️' : '🌙' }}
 *             </button>
 *         </div>
 *     `
 * })
 * export class AppComponent {
 *     protected theme = injectTheme();
 * }
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly destroyRef = inject(DestroyRef);
    private readonly storageKey = 'ds-yoandry-theme';
    private readonly designSystem: DesignSystem;

    // =========================================================================
    // ESTADO
    // =========================================================================

    private readonly _themeMode = signal<ThemeMode>('system');
    private readonly _systemPrefersDark = signal(false);

    /** true si el tema activo es oscuro */
    readonly isDark = computed(() => {
        const mode = this._themeMode();
        return mode === 'system' ? this._systemPrefersDark() : mode === 'dark';
    });

    /** Modo actual: 'light' | 'dark' | 'system' */
    readonly themeMode = this._themeMode.asReadonly();

    /** Colores aplanados del tema activo — reactivo a cambios */
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
     * Cambia el modo de tema y lo persiste en localStorage.
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
     * Retorna el Design System completo para acceso avanzado.
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

        const handler = (e: MediaQueryListEvent) => {
            this._systemPrefersDark.set(e.matches);
        };
        media.addEventListener('change', handler);

        // Limpiar listener al destruir el servicio
        this.destroyRef.onDestroy(() => {
            media.removeEventListener('change', handler);
        });
    }

    private loadSavedTheme(): void {
        const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
        if (saved && (['light', 'dark', 'system'] as ThemeMode[]).includes(saved)) {
            this._themeMode.set(saved);
        }
    }

    private initCSSEffect(): void {
        // En Angular 20, effect() en el constructor se vincula automáticamente
        // al contexto de inyección — no necesita injector explícito
        effect(() => {
            const c = this.colors();
            const root = document.documentElement;

            const vars: Record<string, string> = {
                '--ds-bg':               c.bg,
                '--ds-surface':          c.surface,
                '--ds-surface-elevated': c.surfaceElevated,
                '--ds-text':             c.text,
                '--ds-text-secondary':   c.textSecondary,
                '--ds-text-muted':       c.textMuted,
                '--ds-primary':          c.primary,
                '--ds-primary-light':    c.primaryLight,
                '--ds-primary-dark':     c.primaryDark,
                '--ds-secondary':        c.secondary,
                '--ds-danger':           c.danger,
                '--ds-success':          c.success,
                '--ds-warning':          c.warning,
                '--ds-border':           c.border,
                '--ds-divider':          c.divider,
            };

            for (const [prop, value] of Object.entries(vars)) {
                root.style.setProperty(prop, value);
            }

            document.body.classList.toggle('ds-dark', this.isDark());
            document.body.classList.toggle('ds-light', !this.isDark());
        });
    }
}
