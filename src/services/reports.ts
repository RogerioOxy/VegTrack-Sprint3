import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { demoPhotoAsset } from './demoEvidence';
import { buildReportHtml, ReportState } from './reportContent';

export async function exportReport(state: ReportState, orderId?: string): Promise<void> {
  await demoPhotoAsset.downloadAsync();
  const local = demoPhotoAsset.localUri;
  if (!local) throw new Error('Não foi possível carregar a evidência demonstrativa. Tente novamente.');
  const image = await FileSystem.readAsStringAsync(local, { encoding: FileSystem.EncodingType.Base64 });
  const html = buildReportHtml(state, orderId, `data:image/jpeg;base64,${image}`);
  const file = await Print.printToFileAsync({ html, width: 595, height: 842 });
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const exportUri = `${FileSystem.cacheDirectory}VegTrack_${orderId ? 'ordem' : 'relatorio'}_${stamp}.pdf`;
  await FileSystem.copyAsync({ from: file.uri, to: exportUri });
  if (!await Sharing.isAvailableAsync()) {
    await Print.printAsync({ uri: exportUri });
    return;
  }
  await Sharing.shareAsync(exportUri, { mimeType: 'application/pdf', dialogTitle: 'Relatório VegTrack', UTI: '.pdf' });
}
