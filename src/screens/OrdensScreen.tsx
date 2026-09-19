import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore, formatarDataHora } from '../store/AppContext';
import { AppIcon, Card, Content, FilterChip, MessageBanner, Page, Pill, PrimaryButton, ScreenHeader, SectionHeader, StatePanel, StatusBadge } from '../components';
import { BorderRadius, Colors, Spacing, Typography } from '../utils/theme';
import { OrdemServico, OSMethod, OSStatus } from '../utils/mockData';

type StatusFilter = 'todos' | OSStatus;
type MethodFilter = 'todos' | OSMethod;
type UrgencyFilter = 'todas' | OrdemServico['urgencia'];

const statusOptions: { key: StatusFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' }, { key: 'pendente', label: 'Pendentes' }, { key: 'em_execucao', label: 'Em execução' }, { key: 'bloqueada', label: 'Bloqueadas' }, { key: 'concluida', label: 'Concluídas' },
];
const methodOptions: { key: MethodFilter; label: string }[] = [{ key: 'todos', label: 'Todos' }, { key: 'mecanizada', label: 'Mecanizada' }, { key: 'manual_seletiva', label: 'Manual seletiva' }];
const urgencyOptions: { key: UrgencyFilter; label: string }[] = [{ key: 'todas', label: 'Todas' }, { key: 'critica', label: 'Crítica' }, { key: 'urgente', label: 'Urgente' }, { key: 'normal', label: 'Normal' }];

function OrderCard({ order, onPress }: { order: OrdemServico; onPress: () => void }) {
  const urgencyTone = order.urgencia === 'critica' ? 'red' : order.urgencia === 'urgente' ? 'amber' : 'neutral';
  return (
    <Card onPress={onPress} accessibilityLabel={`Abrir ${order.numero}`} style={[styles.card, order.status === 'bloqueada' && styles.blockedCard]}>
      <View style={styles.cardHeader}><View style={styles.cardCopy}><Text style={styles.number}>{order.numero}</Text><Text style={styles.km}>KM {order.kmInicial.toFixed(1)} a {order.kmFinal.toFixed(1)} · {order.faixa}</Text></View><StatusBadge status={order.status} /></View>
      <View style={styles.metaRow}><Pill label={order.metodo === 'mecanizada' ? 'Roçada mecanizada' : 'Manual seletiva'} tone={order.metodo === 'manual_seletiva' ? 'amber' : 'green'} icon={order.metodo === 'mecanizada' ? 'cog-outline' : 'hand-left-outline'} /><Pill label={`${order.prazoHoras} h`} tone={urgencyTone} icon="time-outline" /></View>
      {order.status === 'bloqueada' && order.motivaBloqueio ? <Text style={styles.blockReason} numberOfLines={2}>{order.motivaBloqueio}</Text> : null}
      <View style={styles.cardFooter}><Text style={styles.date}>Emitida em {formatarDataHora(order.criadaEm)}</Text><View style={styles.openHint}><Text style={styles.openText}>Abrir detalhes</Text><AppIcon name="chevron-forward" size={17} color={Colors.primary} /></View></View>
    </Card>
  );
}

export default function OrdensScreen({ navigation }: { navigation: any }) {
  const { state, error, retry } = useAppStore();
  const [status, setStatus] = useState<StatusFilter>('todos');
  const [method, setMethod] = useState<MethodFilter>('todos');
  const [urgency, setUrgency] = useState<UrgencyFilter>('todas');
  const filtered = useMemo(() => state.ordens.filter(order =>
    (status === 'todos' || order.status === status) && (method === 'todos' || order.metodo === method) && (urgency === 'todas' || order.urgencia === urgency)
  ), [state.ordens, status, method, urgency]);
  const hasFilters = status !== 'todos' || method !== 'todos' || urgency !== 'todas';
  const clear = () => { setStatus('todos'); setMethod('todos'); setUrgency('todas'); };
  const abertas = state.ordens.filter(order => order.status !== 'concluida').length;

  return (
    <Page>
      <ScreenHeader title="Ordens de serviço" subtitle={`${abertas} abertas · ${state.ordens.length} no contexto visível`} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Content style={styles.content}>
          {error ? <MessageBanner tone="error" title="Dados indisponíveis" message={error} actionLabel="Tentar novamente" onAction={retry} /> : null}
          <View style={styles.filterPanel}>
            <SectionHeader title="Filtros" subtitle={`${filtered.length} resultado(s)`} action={hasFilters ? <PrimaryButton compact variant="ghost" label="Limpar" icon="close-circle-outline" onPress={clear} /> : undefined} />
            <Text style={styles.filterLabel}>Status</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{statusOptions.map(option => <FilterChip key={option.key} label={option.label} selected={status === option.key} onPress={() => setStatus(option.key)} count={option.key === 'todos' ? state.ordens.length : state.ordens.filter(order => order.status === option.key).length} />)}</ScrollView>
            <Text style={styles.filterLabel}>Método</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{methodOptions.map(option => <FilterChip key={option.key} label={option.label} selected={method === option.key} onPress={() => setMethod(option.key)} />)}</ScrollView>
            <Text style={styles.filterLabel}>Urgência</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{urgencyOptions.map(option => <FilterChip key={option.key} label={option.label} selected={urgency === option.key} onPress={() => setUrgency(option.key)} />)}</ScrollView>
          </View>

          <View style={styles.orders}>
            {filtered.map(order => <OrderCard key={order.id} order={order} onPress={() => navigation.navigate('DetalheOrdem', { orderId: order.id })} />)}
            {!filtered.length ? <StatePanel icon="filter-outline" title={hasFilters ? 'Nenhuma OS combina com os filtros' : 'Nenhuma ordem no cenário atual'} message={hasFilters ? 'Limpe os filtros ou altere um dos critérios para ver outras ordens.' : 'O cenário vazio mantém a navegação disponível para teste.'} actionLabel={hasFilters ? 'Limpar filtros' : undefined} onAction={hasFilters ? clear : undefined} /> : null}
          </View>

          {state.user?.perfil !== 'gestor' ? <PrimaryButton label="Registrar levantamento" icon="add-circle-outline" onPress={() => navigation.navigate('RegistrarTab')} /> : null}
        </Content>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.xxxl }, content: { gap: Spacing.xl },
  filterPanel: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg, padding: Spacing.base },
  filterLabel: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, marginTop: Spacing.sm, marginBottom: 6 },
  filterRow: { gap: Spacing.sm, paddingBottom: Spacing.xs }, orders: { gap: Spacing.md },
  card: { gap: Spacing.md }, blockedCard: { borderColor: Colors.alertaAmbientalBorder, borderWidth: 1.5 }, cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md }, cardCopy: { flex: 1 },
  number: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.mono, fontSize: Typography.size.base, fontWeight: Typography.weight.extrabold }, km: { color: Colors.textTertiary, fontSize: Typography.size.sm, lineHeight: 20, marginTop: 3 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }, blockReason: { backgroundColor: Colors.alertaAmbientalBg, color: Colors.alertaAmbiental, fontSize: Typography.size.xs, lineHeight: 18, borderRadius: BorderRadius.sm, padding: Spacing.sm },
  cardFooter: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.md }, date: { color: Colors.textTertiary, fontSize: Typography.size.xs }, openHint: { flexDirection: 'row', alignItems: 'center' }, openText: { color: Colors.primary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold },
});
