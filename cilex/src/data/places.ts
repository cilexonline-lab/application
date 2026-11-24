// Selezione Cilex: luoghi reali, scelti dal team (selezione curata, NON una classifica).
// Regole: niente prezzi/orari/recensioni; descrizione vuota o una frase fattuale; foto solo con permesso.
// Coordinate: OpenStreetMap (Nominatim, © OpenStreetMap contributors, ODbL), verificate il 24/11/2026.
// Ogni voce riporta la fonte (osm = elemento OSM). Senza coordinate affidabili = nessun pin.
import type { Place } from '../places';

export const selectionPlaces: Place[] = [
  // ── Spiagge ──
  { id: 'cala-comte', kind: 'beach', name: 'Cala Comte', area: 'Sant Josep', description: '', lat: 38.962885, lng: 1.2212672 }, // osm way 170709931
  { id: 'cala-salada', kind: 'beach', name: 'Cala Salada', area: 'Sant Antoni', description: '', lat: 39.0095323, lng: 1.2990915 }, // osm way 143217546
  { id: 'cala-dhort', kind: 'beach', name: "Cala d'Hort", area: 'Sant Josep', description: '', lat: 38.8898661, lng: 1.2245761 }, // osm way 172420703
  { id: 'ses-salines', kind: 'beach', name: 'Ses Salines', area: 'Sant Josep', description: '', lat: 38.8410652, lng: 1.391858 }, // osm way 95068828
  { id: 'cala-bassa', kind: 'beach', name: 'Cala Bassa', area: 'Sant Josep', description: '', lat: 38.9680739, lng: 1.2396235 }, // osm way 119398204
];
