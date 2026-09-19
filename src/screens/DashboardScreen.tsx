import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useAppStore, formatarDataHora, nivelColor } from '../store/AppContext';
import { Card, Content, FilterChip, IconButton, MessageBanner, NivelBadge, Page, PrimaryButton, ScreenHeader, SectionHeader, StatCard, StatePanel } from '../components';
import { BorderRadius, Colors, Layout, Shadow, Spacing, Typography } from '../utils/theme';
import { Trecho } from '../utils/mockData';

function MapaEsquematico({ trechos, onSelect }: { trechos: Trecho[]; onSelect: (id: string) => void }) {
  if (!trechos.length) return <StatePanel icon="map-outline" title="Nenhum trecho no intervalo" message="Altere o cenário ou configure outro intervalo de KM para voltar a exibir o mapa esquemático." />;
  const minimo = Math.min(...trechos.map(item => item.kmInicial));
  const maximo = Math.max(...trechos.map(item => item.kmFinal));
  return (
    <Card style={styles.mapCard}>
      <View style={styles.mapTitleRow}><Text style={styles.mapEndpoint}>KM {minimo.toFixed(1)}</Text><Text style={styles.mapRoad}>Trecho Motiva · representação offline</Text><Text style={styles.mapEndpoint}>KM {maximo.toFixed(1)}</Text></View>
      <View style={styles.roadLine} />
      <View style={styles.segmentGrid}>
        {trechos.map(trecho => (
          <Pressable key={trecho.id} accessibilityRole="button" accessibilityLabel={`Abrir trecho do KM ${trecho.kmInicial} ao ${trecho.kmFinal}, nível ${trecho.nivelArtesp}`} onPress={() => onSelect(trecho.id)}
            style={({ pressed }) => [styles.segment, { borderColor: nivelColor(trecho.nivelArtesp), backgroundColor: nivelColor(trecho.nivelArtesp) + '18' }, pressed && styles.pressed]}>
            <View style={[styles.segmentDot, { backgroundColor: nivelColor(trecho.nivelArtesp) }]} />
            <Text style={styles.segmentKm}>KM {trecho.kmInicial.toFixed(1)}</Text>
            <Text style={styles.segmentHeight}>{trecho.alturaVegetacaoCm} cm</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.legend}><Text style={styles.legendText}>● <Text style={{ color: Colors.nivel1 }}>Conforme</Text></Text><Text style={styles.legendText}>● <Text style={{ color: Colors.nivel2 }}>Atenção</Text></Text><Text style={styles.legendText}>● <Text style={{ color: Colors.nivel3 }}>Crítico</Text></Text></View>
      <Text style={styles.mapNote}>Mapa esquemático para demonstração. Não representa navegação cartográfica nem posição em tempo real.</Text>
    </Card>
  );
}

function TrechoCard({ trecho, onPress }: { trecho: Trecho; onPress: () => void }) {
  return (
    <Card onPress={onPress} accessibilityLabel={`Ver detalhes do trecho KM ${trecho.kmInicial}`} style={styles.trechoCard}>
      <View style={styles.cardAccent}><View style={[styles.accentBar, { backgroundColor: nivelColor(trecho.nivelArtesp) }]} /></View>
      <View style={styles.trechoTop}><View style={styles.trechoCopy}><Text style={styles.trechoKm}>KM {trecho.kmInicial.toFixed(1)} a {trecho.kmFinal.toFixed(1)}</Text><Text style={styles.trechoFaixa}>{trecho.faixa}</Text></View><NivelBadge nivel={trecho.nivelArtesp} compact /></View>
      <View style={styles.trechoMetrics}><Text style={styles.metricValue}>{trecho.alturaVegetacaoCm} cm<Text style={styles.metricLabel}> de vegetação</Text></Text><Text style={[styles.days, trecho.diasSemRocada > 30 && styles.daysCritical]}>{trecho.diasSemRocada} dias sem roçada</Text></View>
      {trecho.restricaoAmbiental ? <View style={styles.restriction}><Text style={styles.restrictionText}>Restrição ambiental · {trecho.especieEmRestricao}</Text></View> : null}
      <Text style={styles.updated}>Atualizado em {formatarDataHora(trecho.ultimoLevantamento)}</Text>
    </Card>
  );
}

export default function DashboardScreen({ navigation }: { navigation: any }) {
  const { width } = useWindowDimensions();
  const { state, scenario, error, retry, sync, busy } = useAppStore();
  const [filtro, setFiltro] = useState<0 | 1 | 2 | 3>(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const user = state.user!;
  const filtered = filtro === 0 ? state.trechos : state.trechos.filter(item => item.nivelArtesp === filtro);
  const stats = useMemo(() => ({
    criticos: state.trechos.filter(item => item.nivelArtesp === 3).length,
    atencao: state.trechos.filter(item => item.nivelArtesp === 2).length,
    conformes: state.trechos.filter(item => item.nivelArtesp === 1).length,
    abertas: state.ordens.filter(item => item.status !== 'concluida').length,
    urgentes: state.ordens.filter(item => item.urgencia === 'critica' && item.status !== 'concluida').length,
    restricoes: state.trechos.filter(item => item.restricaoAmbiental).length,
  }), [state.trechos, state.ordens]);
  const naoLidas = state.notifications.filter(item => !item.lida).length;
  const twoColumns = width >= Layout.tablet;

  const handleSync = async () => {
    setLocalError(null); setRefreshing(true);
    try {
      if (scenario === 'offline') throw new Error('Modo offline demonstrativo: volte ao cenário normal pela área Mais antes de sincronizar.');
      if (user.perfil === 'gestor') await retry(); else await sync();
    } catch (err) { setLocalError(err instanceof Error ? err.message : 'A atualização não foi concluída.'); }
    finally { setRefreshing(false); }
  };

  return (
    <Page>
      <ScreenHeader title={`Olá, ${user.apelido}`} subtitle={`${user.rodovia} · KM ${state.config.kmInicial} a ${state.config.kmFinal}`}
        right={<IconButton icon="notifications-outline" label="Abrir notificações" badge={naoLidas} onPress={() => navigation.navigate('Notificacoes')} />} />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleSync} tintColor={Colors.primary} />} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Content style={styles.content}>
          {state.pendingSync > 0 ? <MessageBanner tone="warning" title="Alterações salvas no dispositivo" message={`${state.pendingSync} ${state.pendingSync === 1 ? 'item aguarda' : 'itens aguardam'} a sincronização demonstrativa.${user.perfil !== 'gestor' ? ' Use a área Mais para revisar a fila.' : ''}`} /> : null}
          {localError || error ? <MessageBanner tone="error" title="Operação não concluída" message={localError || error || ''} actionLabel="Tentar novamente" onAction={() => { setLocalError(null); retry(); }} /> : null}

          {twoColumns ? (
            <View style={styles.statsRow}>
              <StatCard value={stats.criticos} label="Trechos críticos" color={Colors.nivel3} bgColor={Colors.nivel3Bg} icon="alert-circle-outline" />
              <StatCard value={stats.atencao} label="Em atenção" color={Colors.nivel2} bgColor={Colors.nivel2Bg} icon="warning-outline" />
              <StatCard value={stats.conformes} label="Conformes" color={Colors.nivel1} bgColor={Colors.nivel1Bg} icon="checkmark-circle-outline" />
              <StatCard value={stats.abertas} label="OS abertas" color={Colors.pendente} bgColor={Colors.pendenteBg} icon="clipboard-outline" />
              <StatCard value={stats.urgentes} label="OS críticas" color={Colors.nivel3} bgColor={Colors.nivel3Bg} icon="flash-outline" />
              <StatCard value={stats.restricoes} label="Restrições ativas" color={Colors.alertaAmbiental} bgColor={Colors.alertaAmbientalBg} icon="leaf-outline" />
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statsRow}>
                <StatCard value={stats.criticos} label="Trechos críticos" color={Colors.nivel3} bgColor={Colors.nivel3Bg} icon="alert-circle-outline" />
                <StatCard value={stats.atencao} label="Em atenção" color={Colors.nivel2} bgColor={Colors.nivel2Bg} icon="warning-outline" />
                <StatCard value={stats.conformes} label="Conformes" color={Colors.nivel1} bgColor={Colors.nivel1Bg} icon="checkmark-circle-outline" />
              </View>
              <View style={styles.statsRow}>
                <StatCard value={stats.abertas} label="OS abertas" color={Colors.pendente} bgColor={Colors.pendenteBg} icon="clipboard-outline" />
                <StatCard value={stats.urgentes} label="OS críticas" color={Colors.nivel3} bgColor={Colors.nivel3Bg} icon="flash-outline" />
                <StatCard value={stats.restricoes} label="Restrições ativas" color={Colors.alertaAmbiental} bgColor={Colors.alertaAmbientalBg} icon="leaf-outline" />
              </View>
            </View>
          )}

          <View style={twoColumns ? styles.desktopGrid : undefined}>
            <View style={twoColumns ? styles.desktopMap : undefined}>
              <SectionHeader title="Mapa esquemático" subtitle={`Mês configurado: ${String(state.config.mes).padStart(2, '0')} · toque em um trecho para abrir`} />
              <MapaEsquematico trechos={state.trechos} onSelect={trechoId => navigation.navigate('DetalheTrecho', { trechoId })} />
            </View>
            <View style={twoColumns ? styles.desktopList : undefined}>
              <SectionHeader title="Trechos monitorados" subtitle={`${filtered.length} de ${state.trechos.length} trechos visíveis`} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                <FilterChip label="Todos" selected={filtro === 0} count={state.trechos.length} onPress={() => setFiltro(0)} />
                <FilterChip label="Críticos" selected={filtro === 3} count={stats.criticos} onPress={() => setFiltro(3)} />
                <FilterChip label="Atenção" selected={filtro === 2} count={stats.atencao} onPress={() => setFiltro(2)} />
                <FilterChip label="Conformes" selected={filtro === 1} count={stats.conformes} onPress={() => setFiltro(1)} />
              </ScrollView>
              <View style={styles.list}>{filtered.map(trecho => <TrechoCard key={trecho.id} trecho={trecho} onPress={() => navigation.navigate('DetalheTrecho', { trechoId: trecho.id })} />)}
                {!filtered.length ? <StatePanel icon="options-outline" title="Nenhum trecho neste filtro" message="Selecione outro nível ou restaure o cenário normal na área Mais." actionLabel="Mostrar todos" onAction={() => setFiltro(0)} /> : null}
              </View>
            </View>
          </View>

          {user.perfil !== 'gestor' ? <PrimaryButton label="Registrar novo levantamento" icon="add-circle-outline" onPress={() => navigation.navigate('RegistrarTab')} disabled={busy} /> : <MessageBanner message="Perfil Gestor: consulta e exportação disponíveis; ações de campo ficam ocultas." />}
        </Content>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.xxxl }, content: { gap: Spacing.xl },
  statsGrid: { gap: Spacing.sm }, statsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  desktopGrid: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xl }, desktopMap: { flex: 0.85, minWidth: 0 }, desktopList: { flex: 1.15, minWidth: 0 },
  mapCard: { padding: Spacing.lg }, mapTitleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm, alignItems: 'center' },
  mapEndpoint: { color: Colors.textPrimary, fontSize: Typography.size.xs, fontWeight: Typography.weight.bold }, mapRoad: { flex: 1, textAlign: 'center', color: Colors.textTertiary, fontSize: Typography.size.xs },
  roadLine: { height: 8, backgroundColor: Colors.borderStrong, borderRadius: 4, marginTop: Spacing.md },
  segmentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md },
  segment: { flexGrow: 1, minWidth: 96, minHeight: 76, borderRadius: BorderRadius.md, borderWidth: 1.5, padding: Spacing.sm, justifyContent: 'center' }, pressed: { opacity: 0.7 },
  segmentDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 5 }, segmentKm: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold }, segmentHeight: { color: Colors.textTertiary, fontSize: Typography.size.xs, marginTop: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginTop: Spacing.md }, legendText: { color: Colors.textTertiary, fontSize: Typography.size.xs }, mapNote: { color: Colors.textTertiary, fontSize: Typography.size.xs, lineHeight: 18, marginTop: Spacing.md },
  filters: { gap: Spacing.sm, paddingBottom: Spacing.md }, list: { gap: Spacing.sm }, trechoCard: { overflow: 'hidden', position: 'relative' },
  cardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 }, accentBar: { width: '100%', height: '100%' },
  trechoTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginLeft: 4 }, trechoCopy: { flex: 1 }, trechoKm: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.extrabold }, trechoFaixa: { color: Colors.textTertiary, fontSize: Typography.size.sm, marginTop: 2 },
  trechoMetrics: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm, marginTop: Spacing.md }, metricValue: { color: Colors.textPrimary, fontSize: Typography.size.sm, fontWeight: Typography.weight.bold }, metricLabel: { color: Colors.textTertiary, fontWeight: Typography.weight.regular }, days: { color: Colors.textTertiary, fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold }, daysCritical: { color: Colors.nivel3 },
  restriction: { backgroundColor: Colors.alertaAmbientalBg, padding: Spacing.sm, borderRadius: BorderRadius.sm, marginTop: Spacing.md }, restrictionText: { color: Colors.alertaAmbiental, fontSize: Typography.size.xs, lineHeight: 18, fontWeight: Typography.weight.semibold }, updated: { color: Colors.textTertiary, fontSize: Typography.size.xs, marginTop: Spacing.md },
});
