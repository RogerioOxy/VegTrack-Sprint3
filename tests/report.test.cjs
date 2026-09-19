const test = require('node:test');
const assert = require('node:assert/strict');
const { buildReportHtml } = require('../.test-build/services/reportContent.js');

const completed = { id: 'a', numero: 'OS-001', status: 'concluida', trechoId: 't', kmInicial: 23, kmFinal: 23.5, faixa: 'Marginal', metodo: 'manual_seletiva', criadaEm: '2026-09-19T12:00:00Z', observacoes: '<script>alert(1)</script>', fotoUri: 'demo' };
const state = { user: { nome: 'Supervisor & equipe' }, config: { kmInicial: 23, kmFinal: 24, mes: 9 }, trechos: [], levantamentos: [], ordens: [completed, {...completed, id:'b', numero:'OS-NÃO-CONCLUÍDA', status:'pendente'}] };
test('relatório inclui somente concluídas e escapa conteúdo de formulário', () => {
  const html = buildReportHtml(state, undefined, 'data:image/png;base64,AA==');
  assert.match(html, /OS-001/);
  assert.doesNotMatch(html, /OS-NÃO-CONCLUÍDA/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /Supervisor &amp; equipe/);
  assert.match(html, /não comprova conformidade regulatória/);
  assert.match(html, /evidence/);
});
test('exportação sem sessão ou sem ordem concluída falha sem PDF vazio', () => {
  assert.throws(() => buildReportHtml({...state,user:null}), /Entre na conta/);
  assert.throws(() => buildReportHtml({...state,ordens:[]}), /Não há ordens/);
  assert.throws(() => buildReportHtml(state, 'inexistente'), /Não há ordens/);
});
