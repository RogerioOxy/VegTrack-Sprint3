// ============================================================
// VEGTRACK: Design tokens
// Tema claro e utilitário para uso em campo.
// ============================================================

export const Colors = {
  primary: '#15803d', primaryPressed: '#166534', primaryLight: '#dcfce7',
  primarySoft: '#f0fdf4', primaryDark: '#14532d',
  background: '#f8fafc', surface: '#ffffff', surfaceElevated: '#f1f5f9',
  surfacePressed: '#e2e8f0', border: '#e2e8f0', borderStrong: '#cbd5e1', focus: '#22c55e',
  nivel1: '#15803d', nivel1Bg: '#dcfce7', nivel2: '#a16207', nivel2Bg: '#fef3c7', nivel3: '#b91c1c', nivel3Bg: '#fee2e2',
  pendente: '#1d4ed8', pendenteBg: '#dbeafe', emExecucao: '#6d28d9', emExecucaoBg: '#ede9fe',
  concluida: '#15803d', concluidaBg: '#dcfce7', bloqueada: '#a16207', bloqueadaBg: '#fef3c7',
  alertaAmbiental: '#92400e', alertaAmbientalBg: '#fef3c7', alertaAmbientalBorder: '#d97706',
  info: '#1d4ed8', infoBg: '#eff6ff', success: '#15803d', successBg: '#f0fdf4', danger: '#b91c1c', dangerBg: '#fef2f2',
  textPrimary: '#0f172a', textSecondary: '#475569', textTertiary: '#64748b', textMuted: '#64748b', textInverse: '#ffffff',
  white: '#ffffff', black: '#000000', overlay: 'rgba(15, 23, 42, 0.56)', disabledBg: '#e2e8f0', disabledText: '#64748b',
};

export const Typography = {
  fontFamily: { regular: 'System', medium: 'System', bold: 'System', mono: 'monospace' },
  size: { xs: 12, sm: 14, base: 16, md: 18, lg: 20, xl: 24, xxl: 28, display: 34 },
  weight: { regular: '400' as const, medium: '500' as const, semibold: '600' as const, bold: '700' as const, extrabold: '800' as const },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.7 },
};

export const Spacing = { xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48 };
export const BorderRadius = { sm: 6, md: 10, lg: 14, xl: 20, full: 9999 };

export const Shadow = {
  sm: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  md: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  lg: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.14, shadowRadius: 14, elevation: 7 },
};

export const Layout = { contentMax: 1180, formMax: 680, tablet: 768, desktop: 1120 };
export const MIN_TOUCH = 48;
export const MIN_BUTTON_HEIGHT = 56;
