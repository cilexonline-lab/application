// Luoghi oltre ai club: beach club, spiagge, ristoranti, attività di giorno, tramonti.
// I dati inclusi sono la "Selezione Cilex" (src/data/places.ts): solo luoghi reali, verificati su fonti
// citate nel file. Il JSON remoto (chiave places), se presente, li sostituisce.
import { SHOW_DEMO_DATA } from './config';
import { selectionPlaces } from './data/places';

export type PlaceKind = 'beachclub' | 'beach' | 'restaurant' | 'day' | 'sunset';
export const PLACE_KINDS: PlaceKind[] = ['beachclub', 'beach', 'restaurant', 'day', 'sunset'];

export type Place = {
  id: string;
  kind: PlaceKind;
  name: string;
  area?: string; // es. "Playa d'en Bossa" – solo se confermata
  description: string;
  link?: string; // sito / menù / prenotazione (solo http/https)
  mapQuery?: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  bookable?: boolean; // true = mostra "Richiedi via Cilex" (solo dove avete un accordo/servizio reale)
  demo?: boolean;
};

// Ibiza + Formentera: scarta coordinate fuori zona (errori di battitura nel JSON)
export const validCoord = (lat: unknown, lng: unknown): boolean =>
  typeof lat === 'number' && typeof lng === 'number' && lat >= 38.6 && lat <= 39.2 && lng >= 1.1 && lng <= 1.7;

export const safeUrl = (u: unknown): string | undefined => (typeof u === 'string' && /^https?:\/\/\S+$/i.test(u.trim()) ? u.trim() : undefined);

const isStr = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;

export function sanitizePlaces(raw: unknown): Place[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: Place[] = [];
  for (const p of raw as any[]) {
    if (!p || !isStr(p.id) || !isStr(p.name) || !PLACE_KINDS.includes(p.kind) || seen.has(p.id)) continue;
    seen.add(p.id);
    const ok = validCoord(p.lat, p.lng);
    out.push({
      id: p.id, kind: p.kind, name: p.name.trim(),
      area: isStr(p.area) ? p.area.trim() : undefined,
      description: typeof p.description === 'string' ? p.description : '',
      link: safeUrl(p.link),
      mapQuery: isStr(p.mapQuery) ? p.mapQuery : undefined,
      lat: ok ? p.lat : undefined,
      lng: ok ? p.lng : undefined,
      imageUrl: safeUrl(p.imageUrl),
      bookable: p.bookable === true,
    });
  }
  return out;
}

// Esempio rimasto solo per "Giorno" (non ancora coperto dalla Selezione Cilex).
const demo: Place[] = [
  { id: 'demo-day', kind: 'day', name: 'Attività di esempio', description: 'Qui andranno attività di giorno: barca, escursioni, relax.', demo: true },
];
export const bundledPlaces: Place[] = [...selectionPlaces, ...(SHOW_DEMO_DATA ? demo : [])];
