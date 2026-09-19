import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppStore } from '../store/AppContext';
import { Card, Content, FilterChip, LabelValue, MessageBanner, Page, PrimaryButton, ScreenHeader, SectionHeader, StatePanel } from '../components';
import { BorderRadius, Colors, Spacing, Typography } from '../utils/theme';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function ConfiguracoesScreen({ navigation }: { navigation: any }) {
  const { state, saveConfig, busy } = useAppStore();
  const [start, setStart] = useState(String(state.config.kmInicial));
  const [end, setEnd] = useState(String(state.config.kmFinal));
  const [month, setMonth] = useState(state.config.mes);
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  if (state.user?.perfil !== 'supervisor') return <Page><ScreenHeader title="Configurações" onBack={() => navigation.goBack()} /><Content><StatePanel icon="lock-closed-outline" title="Acesso do Supervisor" message="A alteração do intervalo gerenciado está disponível apenas no perfil Supervisor." actionLabel="Voltar" onAction={() => navigation.goBack()} /></Content></Page>;
  const startNumber = Number(start.replace(',', '.')); const endNumber = Number(end.replace(',', '.'));
  const valid = Number.isFinite(startNumber) && Number.isFinite(endNumber) && startNumber >= 0 && endNumber > startNumber && month >= 1 && month <= 12;
  const save = async () => { if (!valid) return; setMessage(null); try { await saveConfig({ kmInicial: startNumber, kmFinal: endNumber, mes: month }); setMessage({ tone: 'success', text: 'Intervalo e mês atualizados. As listas agora refletem o novo contexto.' }); } catch (err) { setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Não foi possível salvar a configuração.' }); } };
  return (
    <Page>
      <ScreenHeader title="Configurações do trecho" subtitle="Recorte usado em listas, alertas e relatórios" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled"><Content form style={styles.content}>
        <MessageBanner tone="warning" title="Configuração demonstrativa" message="O intervalo deve conter segmentos completos já existentes na base. Esta tela não cria novos trechos." />
        {message ? <MessageBanner tone={message.tone} message={message.text} /> : null}
        <Card><SectionHeader title="Intervalo gerenciado" subtitle="Quilometragem da via demonstrativa" /><View style={styles.kmRow}><View style={styles.field}><Text style={styles.label}>KM inicial</Text><TextInput accessibilityLabel="KM inicial" value={start} onChangeText={setStart} keyboardType="decimal-pad" placeholder="23" placeholderTextColor={Colors.textTertiary} style={styles.input} /></View><Text style={styles.separator}>até</Text><View style={styles.field}><Text style={styles.label}>KM final</Text><TextInput accessibilityLabel="KM final" value={end} onChangeText={setEnd} keyboardType="decimal-pad" placeholder="67" placeholderTextColor={Colors.textTertiary} style={styles.input} /></View></View>{!valid ? <Text style={styles.validation}>Informe números válidos e mantenha o KM final maior que o inicial.</Text> : null}</Card>
        <Card><SectionHeader title="Mês da simulação" subtitle="Controla o calendário e as restrições ambientais" /><View style={styles.months}>{MONTHS.map((label, index) => <FilterChip key={label} label={label} selected={month === index + 1} onPress={() => setMonth(index + 1)} />)}</View></Card>
        <Card><SectionHeader title="Prévia do contexto" /><LabelValue label="Intervalo" value={valid ? `KM ${startNumber} a ${endNumber}` : 'Corrija os valores'} /><LabelValue label="Mês selecionado" value={`${String(month).padStart(2, '0')} · ${MONTHS[month - 1]}`} /><LabelValue label="Trechos atuais" value={String(state.trechos.length)} /></Card>
        <PrimaryButton label="Salvar configuração" icon="save-outline" onPress={save} loading={busy} disabled={!valid} />
      </Content></ScrollView></KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, scroll: { paddingBottom: Spacing.xxxl }, content: { gap: Spacing.xl }, kmRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm }, field: { flex: 1, gap: 6 }, label: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold }, input: { minHeight: 54, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.borderStrong, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, color: Colors.textPrimary, fontSize: Typography.size.base }, separator: { color: Colors.textTertiary, fontSize: Typography.size.sm, paddingBottom: 17 }, validation: { color: Colors.danger, fontSize: Typography.size.xs, lineHeight: 18, marginTop: Spacing.sm }, months: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
