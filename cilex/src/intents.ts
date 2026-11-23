// Azioni che l'assistente "Chiedi" può proporre: ognuna diventa un pulsante che apre la sezione giusta dell'app.
// Le stesse azioni arrivano dal server IA (backend/ai-worker) o, senza IA, dal riconoscimento locale qui sotto.
import type { Club } from './data/clubs';
import type { EventItem } from './data/events';

export type ActionType = 'table' | 'boat' | 'concierge' | 'villa' | 'apartment' | 'club' | 'event' | 'explore' | 'map' | 'plan' | 'whatsapp';
export type AskAction = { type: ActionType; target: string };
const TYPES: ActionType[] = ['table', 'boat', 'concierge', 'villa', 'apartment', 'club', 'event', 'explore', 'map', 'plan', 'whatsapp'];

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
const has = (q: string, words: string[]) => words.some((w) => new RegExp(`(^|[^a-z])${w}`).test(q));

// Parole chiave (inizio parola) in IT / EN / ES.
const KW = {
  table: ['tavol', 'table', 'mesa', 'vip', 'bottle', 'botell', 'prive'],
  boat: ['barc', 'boat', 'yacht', 'yate', 'catamar', 'gommon', 'velier', 'velero', 'motoscaf'],
  villa: ['villa', 'ville\\b', 'villas'],
  apartment: ['appartament', 'apartment', 'apartament', 'flat\\b', 'alloggi', 'dove dormire', 'where to stay', 'donde dormir', 'hotel'],
  concierge: ['transfer', 'autista', 'driver', 'chofer', 'conductor', 'chef', 'cuoco', 'fotograf', 'photograph', 'concierge', 'aeroport', 'airport', 'macchina con', 'noleggio auto', 'car rental', 'alquiler de coche'],
  events: ['event', 'serat', 'party', 'fiesta', 'line ?up', 'stasera', 'tonight', 'esta noche', 'weekend', 'fine settimana', 'fin de semana', 'dj\\b', 'bigliett', 'ticket', 'entrad', 'capodanno', 'new year', 'nochevieja', 'fin de ano'],
  map: ['mappa', 'map\\b', 'mapa', 'dove si trova', 'where is', 'donde esta', 'come arrivo', 'how do i get to'],
  plan: ['piano\\b', 'my plan', 'mi plan', 'promemoria', 'reminder', 'recordatorio', 'agenda'],
  beach: ['spiagg', 'beach', 'playa', 'cala\\b', 'calas'],
  restaurant: ['ristorant', 'restaurant', 'restaurante', 'cena\\b', 'ceno\\b', 'cenare', 'dinner', 'mangi', 'comer\\b', 'where to eat', 'donde comer', 'pranzo', 'lunch'],
  human: ['parlare con', 'operatore', 'talk to', 'human', 'hablar con', 'whatsapp', 'prezz', 'cost', 'price', 'precio', 'quanto', 'how much', 'cuanto', 'disponibil', 'availab', 'disponib'],
};

// Riconosce i club per nome (es. "pacha", "hi ibiza", "ushuaia").
function clubsIn(q: string, clubs: Club[]): Club[] {
  return clubs.filter((c) => {
    const n = norm(c.name).replace(/[^a-z0-9 ]/g, '').trim();
    const first = n.split(' ')[0];
    return n.length > 1 && (q.includes(n) || (first.length > 2 && new RegExp(`(^|[^a-z])${first}([^a-z]|$)`).test(q)) || q.includes(c.id.replace(/-/g, ' ')));
  });
}

// Evento più pertinente: parole del titolo nella domanda, Capodanno → 31/12, altrimenti il prossimo.
function pickEvent(q: string, list: EventItem[]): EventItem | undefined {
  const nye = has(q, ['capodanno', 'new year', 'nochevieja', 'fin de ano']);
  const score = (e: EventItem) =>
    norm(e.title).split(/[^a-z0-9]+/).filter((w) => w.length > 3 && q.includes(w)).length * 2 + (nye && e.date.endsWith('-12-31') ? 3 : 0);
  return [...list].sort((a, b) => score(b) - score(a) || a.date.localeCompare(b.date))[0];
}

// Riconoscimento locale (senza IA): restituisce fino a 3 azioni utili per la domanda.
export function detectActions(text: string, clubs: Club[], upcoming: EventItem[]): AskAction[] {
  const q = norm(text);
  const out: AskAction[] = [];
  const add = (type: ActionType, target = '') => { if (!out.some((a) => a.type === type && a.target === target)) out.push({ type, target }); };
  const named = clubsIn(q, clubs);
  if (has(q, KW.table)) add('table', named[0]?.id ?? '');
  if (has(q, KW.boat)) add('boat');
  if (has(q, KW.villa)) add('villa');
  if (has(q, KW.apartment)) add('apartment');
  if (has(q, KW.concierge)) add('concierge');
  named.slice(0, 2).forEach((c) => {
    const ev = pickEvent(q, upcoming.filter((e) => e.clubId === c.id));
    if (has(q, KW.events) && ev) add('event', ev.id);
    add('club', c.id);
  });
  if (!named.length && has(q, KW.events) && !has(q, KW.restaurant) && !has(q, KW.beach)) add('explore', 'club');
  if (has(q, KW.beach)) add('explore', 'beach');
  if (has(q, KW.restaurant)) add('explore', 'restaurant');
  if (has(q, KW.map)) add('map');
  if (has(q, KW.plan)) add('plan');
  if (has(q, KW.human) || (out.length > 0 && out.every((a) => ['table', 'boat', 'villa', 'apartment', 'concierge'].includes(a.type)))) add('whatsapp');
  return out.slice(0, 3);
}

// Azioni arrivate dal server: tiene solo quelle che l'app sa aprire (club ed eventi devono esistere qui).
export function resolveActions(raw: unknown, clubs: Club[], events: EventItem[]): AskAction[] {
  const byName = (t: string) => clubs.find((c) => c.id === t || norm(c.name) === norm(t));
  const out: AskAction[] = [];
  for (const a of Array.isArray(raw) ? raw : []) {
    const type = a?.type as ActionType;
    const target = typeof a?.target === 'string' ? a.target : '';
    if (!TYPES.includes(type)) continue;
    if (type === 'club') { const c = byName(target); if (c) out.push({ type, target: c.id }); continue; }
    if (type === 'table') { out.push({ type, target: byName(target)?.id ?? '' }); continue; }
    if (type === 'event') { if (events.some((e) => e.id === target)) out.push({ type, target }); continue; }
    if (type === 'explore') { out.push({ type, target: ['club', 'beach', 'restaurant', 'day'].includes(target) ? target : '' }); continue; }
    out.push({ type, target: '' });
  }
  return out.filter((a, i) => out.findIndex((b) => b.type === a.type && b.target === a.target) === i).slice(0, 3);
}
