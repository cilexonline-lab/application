// Chiedi / barra Home: nessuna IA. La domanda del cliente (alla lettera) parte su WhatsApp verso il team.
import { requestRef } from './utils';
import { getLang } from './i18n';
import { openWhatsApp } from './whatsapp';

export function buildAskMessage(ref: string, question: string, lang: string, prCode: string, langLabel: string): string {
  return [
    `Cilex App · ${ref}`,
    `${langLabel}: ${lang.toUpperCase()}`,
    prCode.trim() ? `PR: ${prCode.trim()}` : '',
    '',
    question,
  ].filter((l, i) => l !== '' || i === 3).join('\n');
}

type Store = { prCode: string; addRequest: (r: { ref: string; at: string; kind: string; msg: string; q?: string }) => void };
type T = (k: string) => string;

export async function sendQuestion(question: string, store: Store, t: T) {
  const q = question.trim();
  if (!q) return false;
  const ref = requestRef();
  const msg = buildAskMessage(ref, q, getLang(), store.prCode || '', t('cqLang'));
  store.addRequest({ ref, at: new Date().toISOString(), kind: 'cqKind', msg, q });
  await openWhatsApp(msg, t('waMissing'));
  return true;
}
