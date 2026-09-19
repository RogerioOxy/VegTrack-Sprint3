import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/AppContext';
import { AppIcon, Card, Content, DemoBadge, Divider, MessageBanner, Page, Pill, ScreenHeader, SectionHeader, StatePanel } from '../components';
import { BorderRadius, Colors, Spacing, Typography } from '../utils/theme';
import { EspecieRestricao } from '../utils/mockData';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function monthList(species: EspecieRestricao): number[] {
  if (species.meses?.length) return species.meses;
  if (species.mesInicio <= species.mesFim) return Array.from({ length: species.mesFim - species.mesInicio + 1 }, (_, index) => species.mesInicio + index);
  return [...Array.from({ length: 13 - species.mesInicio }, (_, index) => species.mesInicio + index), ...Array.from({ length: species.mesFim }, (_, index) => index + 1)];
}

function SpeciesCard({ species, currentMonth }: { species: EspecieRestricao; currentMonth: number }) {
  const [expanded, setExpanded] = useState(false);
  const activeMonths = monthList(species);
  const active = activeMonths.includes(currentMonth);
  return (
    <Card onPress={() => setExpanded(value => !value)} accessibilityLabel={`${species.nomePopular}, ${active ? 'restrição ativa' : 'restrição fora do mês'}, ${expanded ? 'recolher' : 'expandir'} detalhes`} style={[styles.speciesCard, active && styles.activeCard]}>
      <View style={styles.speciesHeader}>
        <View style={[styles.speciesIcon, { backgroundColor: active ? Colors.nivel3Bg : Colors.primaryLight }]}><AppIcon name="leaf-outline" color={active ? Colors.nivel3 : Colors.primary} /></View>
        <View style={styles.speciesCopy}><Text style={styles.speciesName}>{species.nomePopular}</Text><Text style={styles.scientific}>{species.nome}</Text></View>
        <View style={styles.speciesStatus}><Pill label={active ? 'Ativa' : 'Fora do mês'} tone={active ? 'red' : 'green'} /><AppIcon name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textTertiary} /></View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendar} nestedScrollEnabled>
        {MONTHS.map((label, index) => {
          const month = index + 1; const restricted = activeMonths.includes(month); const current = month === currentMonth;
          return <View key={label} style={styles.monthCell}><View style={[styles.monthBar, restricted && styles.monthRestricted, current && styles.monthCurrent]} /><Text style={[styles.monthLabel, current && styles.monthLabelCurrent]}>{label}</Text></View>;
        })}
      </ScrollView>
      {expanded ? <View style={styles.details}><Divider /><View style={styles.detailRow}><AppIcon name="calendar-outline" size={19} color={Colors.primary} /><View style={styles.detailCopy}><Text style={styles.detailLabel}>Período demonstrativo</Text><Text style={styles.detailValue}>{species.periodoRestricao}</Text></View></View><View style={styles.detailRow}><AppIcon name="ban-outline" size={19} color={Colors.alertaAmbiental} /><View style={styles.detailCopy}><Text style={styles.detailLabel}>Restrição operacional</Text><Text style={styles.detailValue}>{species.tipoRestricao}</Text></View></View><View style={styles.detailRow}><AppIcon name="location-outline" size={19} color={Colors.primary} /><View style={styles.detailCopy}><Text style={styles.detailLabel}>Trechos associados</Text><Text style={styles.detailValue}>{species.kmAfetados}</Text></View></View><View style={styles.detailRow}><AppIcon name="pulse-outline" size={19} color={species.nivelRisco === 'alto' ? Colors.nivel3 : Colors.nivel2} /><View style={styles.detailCopy}><Text style={styles.detailLabel}>Nível de atenção</Text><Text style={styles.detailValue}>{species.nivelRisco === 'alto' ? 'Alto' : 'Médio'}</Text></View></View></View> : null}
    </Card>
  );
}

export default function FaunaScreen() {
  const { state, error, retry } = useAppStore();
  const active = state.fauna.filter(species => monthList(species).includes(state.config.mes));
  return (
    <Page>
      <ScreenHeader title="Restrições de fauna" subtitle={`Calendário demonstrativo · mês ${String(state.config.mes).padStart(2, '0')}`} right={<DemoBadge label="Dados fictícios" />} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Content style={styles.content}>
          {error ? <MessageBanner tone="error" title="Calendário indisponível" message={error} actionLabel="Tentar novamente" onAction={retry} /> : null}
          {active.length ? <MessageBanner tone="warning" title={`${active.length} restrição(ões) ativa(s) no mês selecionado`} message="Consulte as espécies e os trechos antes de iniciar uma intervenção. As regras abaixo são dados de demonstração." /> : <MessageBanner tone="success" title="Nenhuma restrição ativa no mês" message="O acompanhamento continua disponível. Esta indicação usa somente os dados fictícios do protótipo." />}
          <Card style={styles.legendCard}><SectionHeader title="Como ler o calendário" /><View style={styles.legendRow}><View style={[styles.legendBox, { backgroundColor: Colors.nivel3 }]} /><Text style={styles.legendText}>Mês com restrição demonstrativa</Text></View><View style={styles.legendRow}><View style={[styles.legendBox, { backgroundColor: Colors.borderStrong }]} /><Text style={styles.legendText}>Mês fora do período</Text></View><View style={styles.legendRow}><View style={[styles.legendBox, styles.legendCurrent]} /><Text style={styles.legendText}>Mês selecionado nas configurações</Text></View></Card>
          <SectionHeader title="Espécies monitoradas" subtitle={`${state.fauna.length} registro(s) no intervalo gerenciado`} />
          <View style={styles.list}>{state.fauna.map(species => <SpeciesCard key={species.id} species={species} currentMonth={state.config.mes} />)}
            {!state.fauna.length ? <StatePanel icon="leaf-outline" title="Nenhuma espécie no cenário atual" message="A lista vazia é intencional e permanece navegável. Altere o cenário ou o intervalo em Mais." /> : null}
          </View>
          <MessageBanner message="Notificações em segundo plano ainda dependem de integração futura. Nesta Sprint, a caixa de entrada usa eventos simulados e visíveis." />
        </Content>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.xxxl }, content: { gap: Spacing.xl }, legendCard: { gap: Spacing.sm }, legendRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }, legendBox: { width: 20, height: 12, borderRadius: 3 }, legendCurrent: { backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.primary }, legendText: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 20 }, list: { gap: Spacing.md },
  speciesCard: { gap: Spacing.md }, activeCard: { borderColor: Colors.nivel3, borderWidth: 1.5 }, speciesHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.md }, speciesIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }, speciesCopy: { flexGrow: 1, flexShrink: 1, flexBasis: 180, minWidth: 160 }, speciesName: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.extrabold }, scientific: { color: Colors.textTertiary, fontSize: Typography.size.xs, fontStyle: 'italic', marginTop: 2 }, speciesStatus: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  calendar: { minWidth: 520, gap: 5, paddingVertical: Spacing.xs }, monthCell: { width: 38, alignItems: 'center', gap: 5 }, monthBar: { width: 34, height: 18, borderRadius: 4, backgroundColor: Colors.borderStrong }, monthRestricted: { backgroundColor: Colors.nivel3 }, monthCurrent: { borderWidth: 2, borderColor: Colors.primaryDark }, monthLabel: { color: Colors.textTertiary, fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold }, monthLabelCurrent: { color: Colors.primaryDark, fontWeight: Typography.weight.extrabold },
  details: { gap: Spacing.md }, detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm }, detailCopy: { flex: 1 }, detailLabel: { color: Colors.textTertiary, fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, marginBottom: 2 }, detailValue: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 21 },
});
