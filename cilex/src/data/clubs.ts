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
  // Zona dell'isola (mostrata nella scheda e usata dai filtri di Esplora).
  area?: string;
  // Colore di marca del club (luce dietro al logo in Esplora e nelle testate).
  accent?: string;
  // Opzionali: coordinate per la mappa nell'app (solo se verificate).
  lat?: number;
  lng?: number;
};

// Coordinate: OpenStreetMap (nightclub), controllate il 17/11/2026 – DA VERIFICARE sul posto. SWAG: non trovato, nessun punto sulla mappa.
// ticketUrl, descrizioni e indirizzi: dai siti ufficiali dei club, verificati il 18/11/2026. Testi scritti da noi (da approvare).
export const bundledClubs: Club[] = [
  { id: 'unvrs', area: "Sant Rafel", accent: '#7B5CFF', lat: 38.9579007, lng: 1.4083039, name: 'UNVRS', ticketUrl: 'https://www.unvrs.com/', description: "The world's first \"hyperclub\", in Sant Rafel on the former Privilege site. Opened in 2025, voted DJ Mag #1 Club in the World 2026.", mapQuery: "UNVRS Ibiza, Sant Rafel de sa Creu" },
  { id: 'hi-ibiza', area: "Platja d'en Bossa", accent: '#1966FF', lat: 38.8859868, lng: 1.4038551, name: 'Hï Ibiza', ticketUrl: 'https://www.hiibiza.com/', description: "Superclub in Playa d'en Bossa, voted DJ Mag #1 Club in the World four times (2022\u20132025). House, techno and electronic music.", mapQuery: "H\u00ef Ibiza, Platja d'en Bossa" },
  { id: 'ushuaia', area: "Platja d'en Bossa", accent: '#E02112', lat: 38.8851417, lng: 1.4051087, name: 'Ushuaïa', ticketUrl: 'https://www.theushuaiaexperience.com/', description: "Open-air venue in Playa d'en Bossa: the world's biggest DJs and day-into-night parties since 2011.", mapQuery: "Ushua\u00efa Ibiza, Platja d'en Bossa" },
  { id: 'amnesia', area: "Sant Rafel", accent: '#FE0850', lat: 38.9476598, lng: 1.408229, name: 'Amnesia', ticketUrl: 'https://www.amnesia.es/', description: "Historic temple of electronic music in Sant Rafel, on the Ibiza\u2013Sant Antoni road. Two huge rooms.", mapQuery: "Amnesia Ibiza, Sant Rafel de sa Creu" },
  { id: 'pacha', area: "Ibiza Town", accent: '#C21E3D', lat: 38.9184411, lng: 1.4433152, name: 'Pacha', ticketUrl: 'https://pacha.com/events', description: "Ibiza's most iconic nightclub, in Ibiza Town near the marina. Open beyond the summer season too.", mapQuery: "Pacha Ibiza, Avinguda 8 d'Agost, Eivissa" },
  { id: 'chinois', area: "Marina Ibiza", accent: '#E2484B', lat: 38.9164923, lng: 1.4414606, name: 'Chinois', ticketUrl: 'https://chinois.com/', description: "Club in Marina Ibiza: a dancefloor-first alternative to the superclubs, with world-class residents. Defected's Ibiza home since 2026.", mapQuery: "Chinois Ibiza, Marina Ibiza" },
  { id: 'swag', area: "Platja d'en Bossa", accent: '#F53DD3', name: 'SWAG', ticketUrl: 'https://swagibizaoficial.com/', description: "Urban music club in Playa d'en Bossa since 2014: reggaeton, hip-hop, dembow, R&B and more, a different party every night.", mapQuery: "Carrer de la Murtra 5, Sant Josep de sa Talaia, Ibiza" },
];
