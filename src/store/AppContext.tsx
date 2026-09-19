import React, { createContext, ReactNode, useContext, useEffect, useReducer, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VegTrackStore } from '../domain/engine';
import { calcularNivelArtesp as calcularNivel } from '../domain/rules';
import type { SeverityLevel } from '../utils/mockData';
export type { AppState, AppConfig, Scenario, Notification, AuditEntry } from '../domain/engine';

type StoreValue = Pick<VegTrackStore, 'state' | 'ready' | 'busy' | 'error' | 'scenario' | 'setScenario' | 'retry' | 'login' | 'logout' | 'registerSurvey' | 'startOrder' | 'finishOrder' | 'escalateOrder' | 'saveConfig' | 'markNotification' | 'simulateNotification' | 'sync' | 'resetDemo'>;
const AppContext = createContext<StoreValue | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [, render] = useReducer((revision: number) => revision + 1, 0);
  const mounted = useRef(false);
  const ref = useRef<VegTrackStore | null>(null);
  if (!ref.current) ref.current = new VegTrackStore(AsyncStorage, () => { if (mounted.current) render(); });
  const store = ref.current;
  useEffect(() => {
    mounted.current = true;
    void store.hydrate().catch(() => { /* O erro permanece disponível para recuperação explícita na interface. */ });
    return () => { mounted.current = false; };
  }, [store]);
  const value: StoreValue = {
    state: store.state, ready: store.ready, busy: store.busy, error: store.error, scenario: store.scenario,
    setScenario: store.setScenario, retry: store.retry, login: store.login, logout: store.logout,
    registerSurvey: store.registerSurvey, startOrder: store.startOrder, finishOrder: store.finishOrder,
    escalateOrder: store.escalateOrder, saveConfig: store.saveConfig, markNotification: store.markNotification,
    simulateNotification: store.simulateNotification, sync: store.sync, resetDemo: store.resetDemo,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useAppStore(): StoreValue {
  const store = useContext(AppContext);
  if (!store) throw new Error('O estado da aplicação precisa estar dentro do AppProvider.');
  return store;
}
export function calcularNivelArtesp(alturaCm: number): SeverityLevel { return calcularNivel(alturaCm); }
export function nivelColor(nivel: SeverityLevel): string { return nivel === 1 ? '#16a34a' : nivel === 2 ? '#d97706' : '#dc2626'; }
export function nivelLabel(nivel: SeverityLevel): string { return nivel === 1 ? 'Nível 1: conforme' : nivel === 2 ? 'Nível 2: atenção' : 'Nível 3: crítico'; }
export function formatarData(iso: string): string { return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
export function formatarDataHora(iso: string): string { return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
