import { demoPhotoUri } from './demoEvidence';
import { buildReportHtml, ReportState } from './reportContent';

export async function exportReport(state: ReportState, orderId?: string): Promise<void> {
  const html = buildReportHtml(state, orderId, demoPhotoUri);
  const preview = window.open('', '_blank');
  if (!preview) throw new Error('O navegador bloqueou a janela do relatório. Permita pop-ups locais e tente novamente.');
  preview.onload = () => { preview.focus(); preview.print(); };
  preview.document.write(html);
  preview.document.close();
}
