import React from 'react';
import {
  ActivityIndicator, Pressable, SafeAreaView, StatusBar, StyleProp,
  StyleSheet, Text, TextStyle, View, ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadow, MIN_TOUCH, MIN_BUTTON_HEIGHT, Layout } from '../utils/theme';
import { SeverityLevel, OSStatus } from '../utils/mockData';
import { nivelColor, nivelLabel } from '../store/AppContext';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function AppIcon({ name, size = 22, color = Colors.textPrimary }: { name: IconName; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export function Page({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={[styles.pageInner, style]}>{children}</View>
    </SafeAreaView>
  );
}

export function Content({ children, style, form = false }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; form?: boolean }) {
  return <View style={[styles.content, form && styles.formContent, style]}>{children}</View>;
}

export function ScreenHeader({ title, subtitle, onBack, right }: { title: string; subtitle?: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        {onBack ? <IconButton icon="chevron-back" label="Voltar" onPress={onBack} /> : null}
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
        {right ? <View style={styles.headerRight}>{right}</View> : onBack ? <View style={styles.headerSpacer} /> : null}
      </View>
    </View>
  );
}

export function IconButton({ icon, label, onPress, badge, disabled }: { icon: IconName; label: string; onPress: () => void; badge?: number; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed, disabled && styles.disabledControl]}>
      <AppIcon name={icon} color={disabled ? Colors.disabledText : Colors.primary} />
      {badge ? <View style={styles.iconBadge}><Text style={styles.iconBadgeText}>{badge > 99 ? '99+' : badge}</Text></View> : null}
    </Pressable>
  );
}

export function NivelBadge({ nivel, compact = false }: { nivel: SeverityLevel; compact?: boolean }) {
  const bgColor = nivel === 1 ? Colors.nivel1Bg : nivel === 2 ? Colors.nivel2Bg : Colors.nivel3Bg;
  return <View style={[styles.badge, { backgroundColor: bgColor }, compact && styles.badgeCompact]}><View style={[styles.badgeDot, { backgroundColor: nivelColor(nivel) }]} /><Text style={[styles.badgeText, { color: nivelColor(nivel) }]}>{compact ? `N${nivel}` : nivelLabel(nivel)}</Text></View>;
}

const statusConfig: Record<OSStatus, { label: string; bg: string; color: string }> = {
  pendente: { label: 'Pendente', bg: Colors.pendenteBg, color: Colors.pendente },
  em_execucao: { label: 'Em execução', bg: Colors.emExecucaoBg, color: Colors.emExecucao },
  concluida: { label: 'Concluída', bg: Colors.concluidaBg, color: Colors.concluida },
  bloqueada: { label: 'Bloqueada', bg: Colors.bloqueadaBg, color: Colors.bloqueada },
};

export function StatusBadge({ status }: { status: OSStatus }) {
  const cfg = statusConfig[status];
  return <View style={[styles.badge, { backgroundColor: cfg.bg }]}><Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text></View>;
}

export function Pill({ label, tone = 'neutral', icon }: { label: string; tone?: 'neutral' | 'green' | 'amber' | 'red' | 'blue'; icon?: IconName }) {
  const tones = {
    neutral: { bg: Colors.surfaceElevated, fg: Colors.textSecondary }, green: { bg: Colors.primaryLight, fg: Colors.primary },
    amber: { bg: Colors.alertaAmbientalBg, fg: Colors.alertaAmbiental }, red: { bg: Colors.nivel3Bg, fg: Colors.nivel3 },
    blue: { bg: Colors.pendenteBg, fg: Colors.pendente },
  };
  const cfg = tones[tone];
  return <View style={[styles.pill, { backgroundColor: cfg.bg }]}>{icon ? <AppIcon name={icon} size={14} color={cfg.fg} /> : null}<Text style={[styles.pillText, { color: cfg.fg }]}>{label}</Text></View>;
}

export function Card({ children, style, onPress, accessibilityLabel }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; accessibilityLabel?: string }) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed, style]}>{children}</Pressable>;
}

export function PrimaryButton({ label, onPress, loading, disabled, variant = 'default', icon, compact = false, style }: {
  label: string; onPress: () => void; loading?: boolean; disabled?: boolean; variant?: 'default' | 'danger' | 'warning' | 'outline' | 'ghost'; icon?: IconName; compact?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const palette = variant === 'danger' ? { bg: Colors.danger, fg: Colors.white, border: Colors.danger }
    : variant === 'warning' ? { bg: Colors.alertaAmbiental, fg: Colors.white, border: Colors.alertaAmbiental }
      : variant === 'outline' ? { bg: Colors.surface, fg: Colors.primary, border: Colors.primary }
        : variant === 'ghost' ? { bg: 'transparent', fg: Colors.primary, border: 'transparent' }
          : { bg: Colors.primary, fg: Colors.white, border: Colors.primary };
  const isDisabled = !!disabled || !!loading;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: isDisabled, busy: !!loading }} onPress={onPress} disabled={isDisabled}
      style={({ pressed }) => [styles.button, compact && styles.buttonCompact, { backgroundColor: palette.bg, borderColor: palette.border }, pressed && !isDisabled && styles.buttonPressed, isDisabled && styles.buttonDisabled, style]}>
      {loading ? <ActivityIndicator color={Colors.disabledText} size="small" /> : <>{icon ? <AppIcon name={icon} size={20} color={isDisabled ? Colors.disabledText : palette.fg} /> : null}<Text style={[styles.buttonText, { color: isDisabled ? Colors.disabledText : palette.fg }]}>{label}</Text></>}
    </Pressable>
  );
}

export function FilterChip({ label, selected, onPress, count }: { label: string; selected: boolean; onPress: () => void; count?: number }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={({ pressed }) => [styles.filterChip, selected && styles.filterChipSelected, pressed && styles.pressed]}>
      <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
      {typeof count === 'number' ? <View style={[styles.filterCount, selected && styles.filterCountSelected]}><Text style={[styles.filterCountText, selected && styles.filterCountTextSelected]}>{count}</Text></View> : null}
    </Pressable>
  );
}

export function MessageBanner({ tone = 'info', title, message, actionLabel, onAction }: { tone?: 'info' | 'success' | 'warning' | 'error'; title?: string; message: string; actionLabel?: string; onAction?: () => void }) {
  const cfg = tone === 'success' ? { bg: Colors.successBg, border: Colors.success, fg: Colors.success, icon: 'checkmark-circle' as IconName }
    : tone === 'warning' ? { bg: Colors.alertaAmbientalBg, border: Colors.alertaAmbientalBorder, fg: Colors.alertaAmbiental, icon: 'warning' as IconName }
      : tone === 'error' ? { bg: Colors.dangerBg, border: Colors.danger, fg: Colors.danger, icon: 'alert-circle' as IconName }
        : { bg: Colors.infoBg, border: Colors.info, fg: Colors.info, icon: 'information-circle' as IconName };
  return (
    <View accessibilityRole="alert" style={[styles.banner, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <AppIcon name={cfg.icon} size={22} color={cfg.fg} />
      <View style={styles.bannerCopy}>{title ? <Text style={[styles.bannerTitle, { color: cfg.fg }]}>{title}</Text> : null}<Text style={[styles.bannerText, { color: cfg.fg }]}>{message}</Text>
        {actionLabel && onAction ? <Pressable onPress={onAction} style={styles.bannerAction} accessibilityRole="button"><Text style={[styles.bannerActionText, { color: cfg.fg }]}>{actionLabel}</Text></Pressable> : null}
      </View>
    </View>
  );
}

export function AlertaAmbiental({ especie }: { especie: string }) {
  return <MessageBanner tone="warning" title="Restrição ambiental ativa" message={`Período demonstrativo de ${especie}. A roçada mecanizada não está disponível para este trecho.`} />;
}

export function StatePanel({ icon, title, message, actionLabel, onAction, loading }: { icon?: IconName; title: string; message?: string; actionLabel?: string; onAction?: () => void; loading?: boolean }) {
  return <View style={styles.statePanel}>{loading ? <ActivityIndicator size="large" color={Colors.primary} /> : <AppIcon name={icon || 'leaf-outline'} size={42} color={Colors.primary} />}<Text style={styles.stateTitle}>{title}</Text>{message ? <Text style={styles.stateMessage}>{message}</Text> : null}{actionLabel && onAction ? <PrimaryButton compact label={actionLabel} onPress={onAction} variant="outline" /> : null}</View>;
}

export function EmptyState({ title, subtitle }: { icon?: string; title: string; subtitle?: string }) { return <StatePanel icon="file-tray-outline" title={title} message={subtitle} />; }

export function StatCard({ value, label, color, bgColor, icon }: { value: number | string; label: string; color: string; bgColor: string; icon?: IconName }) {
  return <View style={[styles.statCard, { backgroundColor: bgColor }]}><View style={styles.statTop}>{icon ? <AppIcon name={icon} size={18} color={color} /> : null}<Text style={[styles.statValue, { color }]}>{value}</Text></View><Text style={[styles.statLabel, { color }]}>{label}</Text></View>;
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) { return <View style={[styles.divider, style]} />; }

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <View style={styles.sectionHeader}><View style={styles.sectionCopy}><Text style={styles.sectionTitle}>{title}</Text>{subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}</View>{action}</View>;
}

export function LabelValue({ label, value, valueStyle }: { label: string; value: string; valueStyle?: StyleProp<TextStyle> }) {
  return <View style={styles.labelValue}><Text style={styles.labelValueLabel}>{label}</Text><Text style={[styles.labelValueText, valueStyle]}>{value}</Text></View>;
}

export function DemoBadge({ label = 'Demonstração acadêmica' }: { label?: string }) { return <Pill label={label} tone="amber" icon="flask-outline" />; }

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.background }, pageInner: { flex: 1 },
  content: { width: '100%', maxWidth: Layout.contentMax, alignSelf: 'center', padding: Spacing.base }, formContent: { maxWidth: Layout.formMax },
  header: { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerInner: { width: '100%', maxWidth: Layout.contentMax, alignSelf: 'center', minHeight: 72, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerCopy: { flex: 1 }, headerTitle: { fontSize: Typography.size.xl, fontWeight: Typography.weight.extrabold, color: Colors.textPrimary, lineHeight: 30 },
  headerSubtitle: { fontSize: Typography.size.sm, color: Colors.textTertiary, marginTop: 2, lineHeight: 20 }, headerRight: { marginLeft: Spacing.sm }, headerSpacer: { width: MIN_TOUCH },
  iconButton: { minWidth: MIN_TOUCH, minHeight: MIN_TOUCH, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconBadge: { position: 'absolute', top: 1, right: 0, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, backgroundColor: Colors.nivel3, borderWidth: 2, borderColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  iconBadgeText: { color: Colors.white, fontSize: Typography.size.xs, fontWeight: Typography.weight.extrabold }, pressed: { opacity: 0.74 }, disabledControl: { backgroundColor: Colors.disabledBg },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 28, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full, alignSelf: 'flex-start' },
  badgeCompact: { minHeight: 24, paddingVertical: 2 }, badgeDot: { width: 7, height: 7, borderRadius: 4 }, badgeText: { fontSize: Typography.size.xs, fontWeight: Typography.weight.bold },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', minHeight: 28, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 4 }, pillText: { fontSize: Typography.size.xs, fontWeight: Typography.weight.bold },
  card: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg, padding: Spacing.base, ...Shadow.sm }, cardPressed: { backgroundColor: Colors.surfaceElevated, transform: [{ scale: 0.995 }] },
  button: { minHeight: MIN_BUTTON_HEIGHT, borderRadius: BorderRadius.lg, borderWidth: 1.5, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm }, buttonCompact: { minHeight: MIN_TOUCH, alignSelf: 'flex-start', paddingHorizontal: Spacing.base }, buttonPressed: { opacity: 0.88, transform: [{ scale: 0.995 }] }, buttonDisabled: { backgroundColor: Colors.disabledBg, borderColor: Colors.disabledBg }, buttonText: { fontSize: Typography.size.base, fontWeight: Typography.weight.bold, textAlign: 'center' },
  filterChip: { minHeight: MIN_TOUCH, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }, filterChipSelected: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary }, filterText: { fontSize: Typography.size.sm, color: Colors.textSecondary, fontWeight: Typography.weight.semibold }, filterTextSelected: { color: Colors.primaryDark, fontWeight: Typography.weight.bold },
  filterCount: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 5, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' }, filterCountSelected: { backgroundColor: Colors.primary }, filterCountText: { fontSize: Typography.size.xs, color: Colors.textTertiary, fontWeight: Typography.weight.bold }, filterCountTextSelected: { color: Colors.white },
  banner: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm }, bannerCopy: { flex: 1 }, bannerTitle: { fontSize: Typography.size.sm, fontWeight: Typography.weight.extrabold, marginBottom: 2 }, bannerText: { fontSize: Typography.size.sm, lineHeight: 20 }, bannerAction: { minHeight: MIN_TOUCH, justifyContent: 'center', alignSelf: 'flex-start', marginTop: 4 }, bannerActionText: { fontSize: Typography.size.sm, fontWeight: Typography.weight.extrabold, textDecorationLine: 'underline' },
  statePanel: { minHeight: 260, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xxxl, alignItems: 'center', justifyContent: 'center', gap: Spacing.md }, stateTitle: { fontSize: Typography.size.md, color: Colors.textPrimary, fontWeight: Typography.weight.bold, textAlign: 'center' }, stateMessage: { fontSize: Typography.size.base, lineHeight: 24, color: Colors.textTertiary, textAlign: 'center', maxWidth: 520 },
  statCard: { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, height: 92, borderRadius: BorderRadius.md, padding: Spacing.md, justifyContent: 'space-between' }, statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.xs }, statValue: { fontSize: Typography.size.xxl, fontWeight: Typography.weight.extrabold }, statLabel: { fontSize: Typography.size.xs, lineHeight: 17, fontWeight: Typography.weight.semibold, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: Spacing.md, marginBottom: Spacing.md }, sectionCopy: { flex: 1 }, sectionTitle: { fontSize: Typography.size.lg, fontWeight: Typography.weight.bold, color: Colors.textPrimary, lineHeight: 26 }, sectionSubtitle: { fontSize: Typography.size.sm, color: Colors.textTertiary, lineHeight: 20, marginTop: 2 },
  labelValue: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.md, paddingVertical: 7 }, labelValueLabel: { flex: 1, fontSize: Typography.size.sm, lineHeight: 20, color: Colors.textTertiary }, labelValueText: { flex: 1.5, fontSize: Typography.size.sm, lineHeight: 20, color: Colors.textPrimary, fontWeight: Typography.weight.semibold, textAlign: 'right' },
});
