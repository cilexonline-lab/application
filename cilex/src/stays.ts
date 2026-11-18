// Appartamenti e ville gestiti da Cilex. Il codice NON contiene immobili "veri" inventati:
// i dati inclusi sono solo esempi marcati demo. Gli immobili reali vivono nel JSON remoto, chiave `stays`.
import { SHOW_DEMO_DATA } from './config';
import { safeUrl } from './places';

export type StayKind = 'apartment' | 'villa';
export const STAY_KINDS: StayKind[] = ['apartment', 'villa'];

export type Stay = {
  id: string;
  kind: StayKind;
  name: string;
  area?: string; // zona generica (mai l'indirizzo esatto)
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  guests?: number; // ospiti massimi
  amenities?: string[]; // es. "Piscina privata", "Vista mare" – solo se confermati
  priceNote?: string; // testo libero, es. "Da … a notte" – solo se confermato; altrimenti "prezzo su richiesta"
  minNights?: number;
  imageUrl?: string;
  link?: string;
  demo?: boolean;
};

const isStr = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;
const num = (x: unknown): number | undefined => (typeof x === 'number' && isFinite(x) && x > 0 && x < 100 ? Math.round(x) : undefined);

export function sanitizeStays(raw: unknown): Stay[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: Stay[] = [];
  for (const p of raw as any[]) {
    if (!p || !isStr(p.id) || !isStr(p.name) || !STAY_KINDS.includes(p.kind) || seen.has(p.id)) continue;
    seen.add(p.id);
    out.push({
      id: p.id, kind: p.kind, name: p.name.trim(),
      area: isStr(p.area) ? p.area.trim() : undefined,
      description: typeof p.description === 'string' ? p.description : '',
      bedrooms: num(p.bedrooms), bathrooms: num(p.bathrooms), guests: num(p.guests), minNights: num(p.minNights),
      amenities: Array.isArray(p.amenities) ? p.amenities.filter(isStr).map((a: string) => a.trim()).slice(0, 16) : undefined,
      priceNote: isStr(p.priceNote) ? p.priceNote.trim() : undefined,
      imageUrl: safeUrl(p.imageUrl),
      link: safeUrl(p.link),
    });
  }
  return out;
}

const demo: Stay[] = [
  { id: 'demo-apartment', kind: 'apartment', name: 'Appartamento di esempio', description: 'Qui andranno i vostri appartamenti: zona, camere, servizi e foto, solo se confermati da voi.', demo: true },
  { id: 'demo-villa', kind: 'villa', name: 'Villa di esempio', description: 'Qui andranno le ville: zona, camere, piscina, servizi e foto, solo se confermati da voi.', demo: true },
];
export const bundledStays: Stay[] = SHOW_DEMO_DATA ? demo : [];
