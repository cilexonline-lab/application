// Luoghi oltre ai club: beach club, spiagge, ristoranti, attività di giorno.
// Contenuti gestiti dal JSON remoto. Il codice NON contiene luoghi "veri" inventati:
// i dati inclusi sono solo esempi marcati demo.
import { SHOW_DEMO_DATA } from './config';

export type PlaceKind = 'beachclub' | 'beach' | 'restaurant' | 'day';
export const PLACE_KINDS: PlaceKind[] = ['beachclub', 'beach', 'restaurant', 'day'];

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

const demo: Place[] = [
  { id: 'demo-beachclub', kind: 'beachclub', name: 'Beach club di esempio', description: 'Qui andranno i beach club che consigliate, con testo e link confermati da voi.', demo: true },
  { id: 'demo-beach', kind: 'beach', name: 'Spiaggia di esempio', description: 'Qui andranno le spiagge, con note su parcheggio, accesso e servizi (solo se verificati).', demo: true },
  { id: 'demo-restaurant', kind: 'restaurant', name: 'Ristorante di esempio', description: 'Qui andranno i ristoranti, con link a menù o prenotazione.', demo: true },
  { id: 'demo-day', kind: 'day', name: 'Attività di esempio', description: 'Qui andranno attività di giorno: barca, escursioni, relax.', demo: true },
];
export const bundledPlaces: Place[] = SHOW_DEMO_DATA ? demo : [];
