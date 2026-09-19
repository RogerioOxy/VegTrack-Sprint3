import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useAppStore } from '../store/AppContext';
import { AppIcon, Card, DemoBadge, MessageBanner, PrimaryButton } from '../components';
import { BorderRadius, Colors, Layout, Shadow, Spacing, Typography } from '../utils/theme';

const perfis = [
  { label: 'Supervisor', email: 'supervisor@vegtrack.demo', icon: 'shield-checkmark-outline' as const },
  { label: 'Técnico', email: 'tecnico@vegtrack.demo', icon: 'construct-outline' as const },
  { label: 'Gestor', email: 'gestor@vegtrack.demo', icon: 'analytics-outline' as const },
];

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const { login, busy } = useAppStore();
  const [email, setEmail] = useState('supervisor@vegtrack.demo');
  const [password, setPassword] = useState('vegtrack123');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setMessage(null);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Não foi possível entrar na demonstração.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.shell, width >= 768 && styles.shellWide]}>
          <View style={styles.brandPanel}>
            <View style={styles.brandMark}><AppIcon name="leaf" size={34} color={Colors.white} /></View>
            <DemoBadge />
            <Text style={styles.brandTitle}>VegTrack</Text>
            <Text style={styles.brandSubtitle}>Inteligência de campo para conservação de rodovias</Text>
            <View style={styles.roadTag}><AppIcon name="trail-sign-outline" size={18} color={Colors.primaryLight} /><Text style={styles.roadText}>Trechos de demonstração · Motiva</Text></View>
          </View>

          <Card style={styles.formCard}>
            <Text style={styles.title}>Acesse o protótipo</Text>
            <Text style={styles.subtitle}>Escolha um perfil demonstrativo ou informe as credenciais acadêmicas.</Text>

            <View style={styles.profileRow}>
              {perfis.map(perfil => (
                <Pressable key={perfil.email} onPress={() => { setEmail(perfil.email); setPassword('vegtrack123'); setMessage(null); }}
                  accessibilityRole="button" accessibilityState={{ selected: email === perfil.email }}
                  style={({ pressed }) => [styles.profileCard, email === perfil.email && styles.profileCardSelected, pressed && styles.pressed]}>
                  <AppIcon name={perfil.icon} size={20} color={email === perfil.email ? Colors.primary : Colors.textTertiary} />
                  <Text style={[styles.profileText, email === perfil.email && styles.profileTextSelected]}>{perfil.label}</Text>
                </Pressable>
              ))}
            </View>

            {message ? <MessageBanner tone="error" title="Acesso não concluído" message={message} /> : null}

            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>
              <View style={[styles.inputShell, focusedField === 'email' && styles.inputFocused]}><AppIcon name="mail-outline" size={20} color={Colors.textTertiary} /><TextInput value={email} onChangeText={setEmail} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} placeholder="nome@vegtrack.demo" placeholderTextColor={Colors.textTertiary} style={styles.input} accessibilityLabel="E-mail" /></View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>
              <View style={[styles.inputShell, focusedField === 'password' && styles.inputFocused]}><AppIcon name="lock-closed-outline" size={20} color={Colors.textTertiary} /><TextInput value={password} onChangeText={setPassword} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} secureTextEntry={!showPassword} placeholder="Senha demonstrativa" placeholderTextColor={Colors.textTertiary} style={styles.input} accessibilityLabel="Senha" /><Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onPress={() => setShowPassword(value => !value)} style={styles.eyeButton}><AppIcon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color={Colors.primary} /></Pressable></View>
            </View>

            <PrimaryButton label="Entrar no VegTrack" icon="log-in-outline" onPress={handleLogin} loading={busy} disabled={!email.trim() || !password} />
            <Text style={styles.demoHint}>Senha para todos os perfis: <Text style={styles.demoStrong}>vegtrack123</Text>. Credenciais e dados são fictícios.</Text>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.base },
  shell: { width: '100%', maxWidth: 960, alignSelf: 'center', flexDirection: 'column', borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadow.lg },
  shellWide: { flexDirection: 'row' },
  brandPanel: { flex: 0.9, minHeight: 300, backgroundColor: Colors.primaryDark, padding: Spacing.xxl, justifyContent: 'center', alignItems: 'flex-start', gap: Spacing.md },
  brandMark: { width: 64, height: 64, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  brandTitle: { color: Colors.white, fontSize: 38, fontWeight: Typography.weight.extrabold, letterSpacing: -0.8 },
  brandSubtitle: { color: Colors.primaryLight, fontSize: Typography.size.md, lineHeight: 27, maxWidth: 360 },
  roadTag: { marginTop: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  roadText: { color: Colors.primaryLight, fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold },
  formCard: { flex: 1.1, maxWidth: Layout.formMax, borderRadius: 0, borderWidth: 0, padding: Spacing.xxl, justifyContent: 'center', gap: Spacing.lg },
  title: { fontSize: Typography.size.xxl, fontWeight: Typography.weight.extrabold, color: Colors.textPrimary },
  subtitle: { color: Colors.textTertiary, fontSize: Typography.size.base, lineHeight: 24, marginTop: -Spacing.md },
  profileRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  profileCard: { flex: 1, minWidth: 105, minHeight: 66, borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, padding: Spacing.sm, alignItems: 'center', justifyContent: 'center', gap: 3, backgroundColor: Colors.surface },
  profileCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  profileText: { color: Colors.textTertiary, fontSize: Typography.size.xs, fontWeight: Typography.weight.bold },
  profileTextSelected: { color: Colors.primaryDark }, pressed: { opacity: 0.72 },
  field: { gap: 6 }, label: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
  inputShell: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.borderStrong, borderRadius: BorderRadius.md },
  input: { flex: 1, minHeight: 50, color: Colors.textPrimary, fontSize: Typography.size.base, outlineStyle: 'none' } as any,
  inputFocused: { borderColor: Colors.primary, borderWidth: 2, backgroundColor: '#f0fdf4' },
  eyeButton: { width: 44, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  demoHint: { color: Colors.textTertiary, fontSize: Typography.size.xs, lineHeight: 18, textAlign: 'center' }, demoStrong: { color: Colors.textPrimary, fontWeight: Typography.weight.bold, fontFamily: Typography.fontFamily.mono },
});
