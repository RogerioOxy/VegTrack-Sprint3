import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatarDataHora, useAppStore } from '../store/AppContext';
import { AppIcon, Card, Content, MessageBanner, Page, PrimaryButton, ScreenHeader, StatePanel } from '../components';
import { BorderRadius, Colors, Spacing, Typography } from '../utils/theme';

export default function NotificacoesScreen({ navigation }: { navigation: any }) {
  const { state, markNotification, simulateNotification, busy } = useAppStore();
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const run = async (action: () => Promise<void>, success?: string) => { setMessage(null); try { await action(); if (success) setMessage({ tone: 'success', text: success }); } catch (err) { setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'A operação não foi concluída.' }); } };
  return (
    <Page>
      <ScreenHeader title="Notificações" subtitle={`${state.notifications.filter(item => !item.lida).length} não lida(s)`} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}><Content form style={styles.content}>
        <MessageBanner message="Caixa de entrada local para a Sprint 3. Push em segundo plano permanece como integração futura explicitamente pendente." />
        {message ? <MessageBanner tone={message.tone} message={message.text} /> : null}
        {state.user?.perfil !== 'gestor' ? <PrimaryButton label="Simular alerta ambiental" icon="notifications-outline" variant="outline" loading={busy} onPress={() => run(simulateNotification, 'Notificação demonstrativa adicionada à caixa de entrada.')} /> : null}
        <View style={styles.list}>{state.notifications.map(item => {
          const open = async () => {
            if (state.user?.perfil !== 'gestor' && !item.lida) await run(() => markNotification(item.id));
            if (item.trechoId) navigation.navigate('DetalheTrecho', { trechoId: item.trechoId });
          };
          return <Card key={item.id} onPress={open} accessibilityLabel={`${item.lida ? 'Lida' : 'Não lida'}: ${item.titulo}`} style={[styles.notification, !item.lida && styles.unread]}><View style={[styles.icon, { backgroundColor: item.lida ? Colors.surfaceElevated : Colors.alertaAmbientalBg }]}><AppIcon name={item.lida ? 'mail-open-outline' : 'notifications'} color={item.lida ? Colors.textTertiary : Colors.alertaAmbiental} /></View><View style={styles.copy}><View style={styles.top}><Text style={styles.title}>{item.titulo}</Text>{!item.lida ? <View style={styles.dot} /> : null}</View><Text style={styles.body}>{item.mensagem}</Text><Text style={styles.meta}>{item.trechoId ? 'Toque para consultar o trecho' : item.lida ? 'Lida' : state.user?.perfil === 'gestor' ? 'Não lida' : 'Toque para marcar como lida'}</Text></View>{item.trechoId ? <AppIcon name="chevron-forward" size={18} color={Colors.textTertiary} /> : null}</Card>;
        })}
          {!state.notifications.length ? <StatePanel icon="notifications-off-outline" title="Nenhuma notificação" message="Use o botão acima para criar um evento demonstrativo ou restaure o cenário normal." /> : null}
        </View>
      </Content></ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.xxxl }, content: { gap: Spacing.lg }, list: { gap: Spacing.sm }, notification: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md }, unread: { borderColor: Colors.alertaAmbientalBorder, backgroundColor: '#fffbeb' }, icon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1 }, top: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' }, title: { flex: 1, color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: Typography.weight.extrabold }, dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.nivel3 }, body: { color: Colors.textSecondary, fontSize: Typography.size.sm, lineHeight: 21, marginTop: 4 }, meta: { color: Colors.textTertiary, fontSize: Typography.size.xs, marginTop: Spacing.sm },
});
