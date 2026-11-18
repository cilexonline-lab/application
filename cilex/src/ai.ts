import { AI_APP_TOKEN, AI_ENDPOINT } from './config';

declare const process: any;

export type ChatMsg = { role: 'user' | 'assistant'; content: string };
export type AiErrorKind = 'not_configured' | 'rate_limited' | 'network' | 'server';
export class AiError extends Error {
  kind: AiErrorKind;
  constructor(kind: AiErrorKind) { super(kind); this.kind = kind; }
}

// Solo per l'ANTEPRIMA nel browser (EXPO_PUBLIC_AI_MOCK=1 in fase di build): risposta simulata ed esplicitamente etichettata.
const MOCK = !!process.env.EXPO_PUBLIC_AI_MOCK;
export const AI_AVAILABLE = MOCK || !!AI_ENDPOINT;

export async function askAI(messages: ChatMsg[], deviceId: string): Promise<string> {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 900));
    return '[Risposta simulata – solo anteprima] Qui l’assistente risponderà alle domande su Ibiza usando i dati ufficiali Cilex. Per prezzi, orari e disponibilità ti indirizzerà al team su WhatsApp.';
  }
  if (!AI_ENDPOINT) throw new AiError('not_configured');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const headers: Record<string, string> = { 'content-type': 'application/json', 'x-device': deviceId };
    if (AI_APP_TOKEN) headers['x-app-token'] = AI_APP_TOKEN;
    const res = await fetch(AI_ENDPOINT, {
      method: 'POST',
      signal: ctrl.signal,
      headers,
      body: JSON.stringify({ messages }),
    });
    if (res.status === 429) throw new AiError('rate_limited');
    if (!res.ok) throw new AiError('server');
    const data = await res.json();
    if (!data?.reply || typeof data.reply !== 'string') throw new AiError('server');
    return data.reply;
  } catch (e) {
    if (e instanceof AiError) throw e;
    throw new AiError('network');
  } finally {
    clearTimeout(timer);
  }
}
