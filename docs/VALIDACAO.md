# Registro de validação local

Data: 19/09/2026. Ambiente de desenvolvimento em Windows, Node.js 24.13.1, npm 11.8.0, Expo SDK 51, React Native 0.74.5 e TypeScript 5.3.

## Testes automatizados

Comando: `npm test`. Resultado: exit 0.

```text
tests 22
suites 0
pass 22
fail 0
cancelled 0
skipped 0
todo 0
```

São 20 testes do motor usado pelo aplicativo e 2 testes do conteúdo do relatório. Eles cobrem limites da medição, deduplicação, permissões, recorte, calendário, conclusão, persistência, ações concorrentes, operação offline e recuperação de dados corrompidos. Os testes do relatório verificam ordens concluídas, tratamento de texto e rejeição de exportação vazia.

## Tipagem e exportação web

```text
npm run typecheck: exit 0, sem erros de TypeScript.
npm run export:web: exit 0, bundle e assets exportados para dist.
```

A exportação web não equivale a APK, instalação ou execução nativa. O aviso de depreciação do módulo `punycode` não interrompeu o processo.

## Validação da interface

Os testes manuais estão em [TESTES-MANUAIS.md](TESTES-MANUAIS.md). Onze fluxos foram conferidos no navegador e dez cenários complementares no emulador Android 14 com perfil Pixel 5 e Expo Go 2.31.2. A validação nativa incluiu dashboard, histórico, levantamento, OS, restrição ambiental, conclusão, recorte, notificações, cenários de erro e vazio, fila offline, sincronização, perfil gestor e relatório em PDF.

O relatório demonstrativo foi salvo com uma página e uma fotografia de exemplo. A imagem possui crédito e licença em [CREDITOS.md](CREDITOS.md). O arquivo não representa uma evidência real de campo.

## Limites desta validação

- Android foi validado em emulador, sem alegação de teste em aparelho físico.
- iOS não foi executado.
- O vídeo da Sprint 3 foi gravado e montado com 175 segundos (2min55s). O link do YouTube está no README, com visibilidade não listada confirmada.
- O código está publicado em https://github.com/RogerioOxy/VegTrack-Sprint3.
- Push em segundo plano, câmera real, GPS real, API e autenticação de produção continuam pendentes.

O código e o vídeo estão publicados. O TXT de submissão contém somente a identificação da dupla e os links reais do GitHub e do YouTube.

## Integridade do vídeo local

Arquivo H.264, 720 x 1660, 24 fps, com 4.200 frames e 175 segundos. A decodificação integral terminou sem erro. A revisão dos quadros confirmou identificação correta da dupla, legendas legíveis e ausência de cortes materiais na interface. O vídeo usa somente a gravação do app no emulador, além das cartelas de abertura e encerramento.
