# Testes manuais da Sprint 3

## Ambiente e alcance

Os testes foram realizados em 19/09/2026, primeiro no React Native Web e depois em um emulador Android 14 com perfil Pixel 5, Expo Go 2.31.2, Expo SDK 51 e React Native 0.74.5. A execução nativa usou a aplicação aberta pelo Expo Go. No início, o deep link direto exigiu abrir a Home do Expo Go antes de retornar ao projeto. Depois disso, não houve travamento durante os fluxos registrados.

Os dados são fictícios e ficam no armazenamento local do protótipo. A fotografia anexada é uma imagem real de exemplo, com autoria e licença registradas em [CREDITOS.md](CREDITOS.md). Ela não foi capturada pelo grupo nem representa o trecho selecionado.

## Resultados no navegador

Os onze fluxos abaixo foram percorridos no navegador integrado, em 390 x 844, 1024 x 768 e 1440 x 900. Eles permanecem como histórico complementar e não substituem a validação nativa.

| ID | Cenário | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|
| TM01 | Senha errada e acesso como supervisor | Exibir erro e aceitar credencial correta | O erro apareceu e o mapa abriu após a correção | Passou |
| TM02 | Filtro de críticos e detalhe do KM 23 a 23,5 | Exibir histórico e tendência | O detalhe apresentou três medições e a ordem relacionada | Passou |
| TM03 | Medição negativa e depois crítica com evidência | Recusar valor inválido e gerar OS crítica | O valor negativo bloqueou o envio. Com 35 cm, uma OS foi criada | Passou |
| TM04 | Calendário e OS com restrição ambiental | Exibir restrição e permitir método manual | A restrição da Jararaca apareceu e a OS iniciou como manual | Passou |
| TM05 | Filtros, início e conclusão sem e com foto | Exigir foto antes de concluir | Sem foto, a conclusão ficou indisponível. Com foto, a OS foi concluída com data, GPS e auditoria | Passou |
| TM07 | Intervalo KM 31,5 a 32 | Limitar o contexto ao segmento inteiro | O mapa passou a exibir um trecho, uma OS aberta e uma restrição | Passou |
| TM08 | Notificação ambiental e leitura | Relacionar aviso ao trecho e ao mês | O contador foi zerado e o detalhe correto foi aberto | Passou |
| TM09 | Cenário de erro e nova tentativa | Recuperar sem confundir erro e vazio | O banner apareceu e a tentativa restaurou o contexto | Passou |
| TM10 | Cenário vazio e retorno ao normal | Exibir listas vazias sem apagar a base | As listas ficaram vazias e os dados voltaram no cenário normal | Passou |
| TM11 | Operação offline, recarga e sincronização | Preservar fila e sincronizar depois | A fila permaneceu após recarga e chegou a zero após a sincronização | Passou |
| TM12 | Acesso como gestor | Permitir consulta e impedir alterações | O perfil ficou somente leitura e não exibiu ações de edição | Passou |

## Resultados no Android

| ID | Cenário | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|
| AN01 | Abrir dashboard no viewport de aproximadamente 393dp | Exibir mapa, indicadores e navegação sem travar | Dashboard carregado no emulador Android | Passou |
| AN02 | Abrir detalhe e histórico de trecho | Exibir histórico e tendência | O histórico foi exibido no detalhe do trecho | Passou |
| AN03 | Registrar 35 cm no KM 23,5 a 24 e gerar OS | Salvar levantamento crítico e gerar OS | A medição gerou uma OS de demonstração | Passou |
| AN04 | Filtrar OS e abrir detalhe | Aplicar filtros e exibir dados da OS | Filtros e detalhe funcionaram | Passou |
| AN05 | Tentar concluir sem foto e concluir com foto e GPS | Bloquear sem foto e concluir com evidência | O botão ficou desabilitado sem foto. Depois, a OS foi concluída | Passou |
| AN06 | Calendário, alerta ambiental e início manual | Bloquear método mecanizado e permitir método manual | O alerta apareceu e a OS manual foi iniciada | Passou |
| AN07 | Configurar intervalo e consultar mapa | Atualizar o recorte | O intervalo KM 31,5 a 32 foi salvo e mostrou um trecho | Passou |
| AN08 | Cenários vazio, erro, retry, offline, recarga e sync | Recuperar estados e preservar fila | O vazio e o erro foram recuperados; a fila permaneceu após reinício e chegou a zero após sincronizar | Passou |
| AN09 | Perfil gestor | Manter consulta sem ações de alteração | O gestor entrou em modo somente leitura | Passou |
| AN10 | Exportar relatório concluído | Gerar e compartilhar PDF com uma página e foto | O arquivo foi salvo a partir do menu de compartilhamento do Android. Confirmamos uma página, uma foto embutida, créditos e rodapé | Passou |

## Observações e limites

- A validação nativa foi feita em emulador Android. Não representa teste em aparelho físico ou em iOS.
- O PDF validado é demonstrativo e usa dados, GPS e regras ambientais fictícios, além de uma fotografia real de exemplo. Ele não comprova conformidade regulatória.
- O push em segundo plano, a câmera e o GPS reais continuam fora do escopo das integrações desta Sprint.
- A revisão visual nativa foi aprovada nos três tamanhos retrato usados. As larguras nativas verificadas foram aproximadamente 393dp, 1067dp e 1440dp, sempre em retrato. Isso não representa teste em tablet físico, iOS ou produção.
- Os testes automatizados complementares estão registrados em [VALIDACAO.md](VALIDACAO.md).

## Problemas encontrados e ajustes

- O espaçamento dos indicadores no Android foi ajustado para evitar sobreposição.
- O limiar de criação de OS foi conferido no limite de 30 cm.
- O relatório foi compactado para impedir que o rodapé ficasse sozinho em uma segunda página. A nova exportação foi salva e conferida.
- O banner de sincronização foi atualizado para não exibir texto incorreto ao gestor.
- O cadastro, a persistência e as transições usam o mesmo motor validado pelos testes automatizados.

## Pendências para a entrega

1. Vídeo gravado e montado com 2min55s, dentro do limite de três minutos.
2. Publicar o vídeo como não listado e conferir o acesso pelo link.
3. O repositório já está publicado. Preencher o TXT final com esse endereço e o link real do vídeo.

## Evidências incluídas no repositório

- [Dashboard no Android](imagens/dashboard-android.png).
- [Histórico e limite de 30 cm](imagens/historico-android.png).
- [Confirmação de conclusão](imagens/conclusao-android.png).
- [PDF produzido no Android](EXEMPLO-RELATORIO.pdf).

A gravação final percorre os mesmos caminhos com a base demonstrativa restaurada. O vídeo foi editado em dois trechos contínuos do emulador, com legendas e aceleração leve para respeitar os três minutos.
