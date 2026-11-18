export type Club = {
  id: string;
  name: string;
  // Link diretto al ticketing di questo club. Lasciare '' finché non è pronto.
  ticketUrl: string;
  // Testo breve (da scrivere/approvare). Vuoto = non mostrato.
  description: string;
  // Opzionale: regole/dress code/età (solo se confermate dal club). Mostrato come "Good to know".
  rules?: string;
  // Opzionale: URL di una foto (solo se hai il permesso del club).
  imageUrl?: string;
  // Opzionale: indirizzo per Maps. Se vuoto, la ricerca usa il nome.
  mapQuery?: string;
  // Opzionali: coordinate per la mappa nell'app (solo se verificate).
  lat?: number;
  lng?: number;
};

// Coordinate: OpenStreetMap (nightclub), controllate il 17/11/2026 – DA VERIFICARE sul posto. SWAG: non trovato, nessun punto sulla mappa.
// ticketUrl: siti ufficiali dei club, verificati il 18/11/2026. SWAG: sito ufficiale non trovato.
export const bundledClubs: Club[] = [
  { id: 'unvrs', lat: 38.9579007, lng: 1.4083039, name: 'UNVRS', ticketUrl: 'https://www.unvrs.com/', description: '' },
  { id: 'hi-ibiza', lat: 38.8859868, lng: 1.4038551, name: 'Hï Ibiza', ticketUrl: 'https://www.hiibiza.com/', description: '' },
  { id: 'ushuaia', lat: 38.8851417, lng: 1.4051087, name: 'Ushuaïa', ticketUrl: 'https://www.theushuaiaexperience.com/', description: '' },
  { id: 'amnesia', lat: 38.9476598, lng: 1.408229, name: 'Amnesia', ticketUrl: 'https://www.amnesia.es/', description: '' },
  { id: 'pacha', lat: 38.9184411, lng: 1.4433152, name: 'Pacha', ticketUrl: 'https://pacha.com/events', description: '' },
  { id: 'chinois', lat: 38.9164923, lng: 1.4414606, name: 'Chinois', ticketUrl: 'https://chinois.com/', description: '' },
  { id: 'swag', name: 'SWAG', ticketUrl: '', description: '' },
];
