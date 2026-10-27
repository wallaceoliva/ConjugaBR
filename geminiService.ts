import type { ResultadoConjugacao, TempoVerbal } from './types';

const apiUrl = (import.meta.env.VITE_CONJUGABR_API_URL || '').trim().replace(/\/$/, '');

export async function consultarConjugacao(verbo: string, tempo: TempoVerbal): Promise<ResultadoConjugacao> {
  if (!apiUrl) {
    throw new Error('O servidor de conjugação ainda não foi configurado. Consulte o guia CONFIGURAR-ANDROID.md.');
  }
  const response = await fetch(`${apiUrl}/conjugar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verbo, tempo }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Não foi possível consultar o verbo.');
  }
  return data as ResultadoConjugacao;
}
