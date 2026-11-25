// Itinerari Cilex: percorsi di 4–6 tappe, ogni tappa è un luogo già presente nell'app (stessi id di
// src/data/places.ts per ref 'place', di src/data/clubs.ts per ref 'club').
// Regole: niente prezzi, orari, disponibilità o recensioni; solo ciò che i dati dell'app già confermano.
// L'ordine delle tappe segue la geografia dell'isola (coordinate di places.ts / clubs.ts).
// Tutti i locali sono stagionali: a novembre sono chiusi per l'inverno (vedi nota in places.ts).
export type L3 = { it: string; en: string; es: string };
export type ItineraryStop = {
  ref: 'place' | 'club';
  id: string;
  role: 'beach' | 'lunch' | 'sunset' | 'dinner' | 'night' | 'afternoon';
  note?: L3; // una riga, solo fatti già confermati nei dati
};
// season: indicazione di stagione indicativa (le date esatte cambiano per locale e per anno: DA VERIFICARE prima di promettere un'apertura).
export type Itinerary = { id: string; title: L3; intro: L3; season: L3; stops: ItineraryStop[] };

export const itineraries: Itinerary[] = [
  {
    id: 'una-giornata-a-ibiza',
    title: { it: 'Una giornata a Ibiza', en: 'A day in Ibiza', es: 'Un día en Ibiza' },
    intro: {
      it: "Dal mare del sud al tramonto sulla costa ovest, poi cena a Sant Antoni.",
      en: 'From the southern sea to sunset on the west coast, then dinner in Sant Antoni.',
      es: 'Del mar del sur al atardecer en la costa oeste y cena en Sant Antoni.',
    },
    season: { it: 'Stagione indicativa: da maggio a ottobre.', en: 'Indicative season: May to October.', es: 'Temporada orientativa: de mayo a octubre.' },
    stops: [
      { ref: 'place', id: 'ses-salines', role: 'beach' },
      { ref: 'place', id: 'sa-trinxa', role: 'lunch', note: { it: 'Beach bar su Ses Salines.', en: 'Beach bar on Ses Salines.', es: 'Beach bar en Ses Salines.' } },
      { ref: 'place', id: 'cafe-del-mar', role: 'sunset', note: { it: 'Tramonto a Sant Antoni.', en: 'Sunset in Sant Antoni.', es: 'Atardecer en Sant Antoni.' } },
      { ref: 'place', id: 'sa-capella', role: 'dinner' },
    ],
  },
  {
    id: 'notte-al-pacha',
    title: { it: 'Notte al Pacha', en: 'A night at Pacha', es: 'Noche en Pacha' },
    intro: {
      it: "Pomeriggio a Playa d'en Bossa, cena a Talamanca, poi Ibiza Città: Pacha e Chinois sono vicini.",
      en: "Afternoon in Playa d'en Bossa, dinner in Talamanca, then Ibiza Town: Pacha and Chinois are close to each other.",
      es: 'Tarde en Playa d\'en Bossa, cena en Talamanca y después Ibiza Ciudad: Pacha y Chinois están cerca.',
    },
    season: { it: 'Stagione indicativa: da maggio a ottobre.', en: 'Indicative season: May to October.', es: 'Temporada orientativa: de mayo a octubre.' },
    stops: [
      { ref: 'place', id: 'nassau', role: 'afternoon' },
      { ref: 'place', id: 'sa-punta', role: 'dinner', note: { it: 'Ristorante a Talamanca.', en: 'Restaurant in Talamanca.', es: 'Restaurante en Talamanca.' } },
      { ref: 'club', id: 'pacha', role: 'night', note: { it: 'Le date e i biglietti sono nella sezione Eventi.', en: 'Dates and tickets are in the Events section.', es: 'Fechas y entradas están en la sección Eventos.' } },
      { ref: 'club', id: 'chinois', role: 'night', note: { it: 'Per chi vuole una notte intera: seconda tappa a Marina Ibiza.', en: 'For those who want a full night: a second stop at Marina Ibiza.', es: 'Para quien quiere una noche entera: segunda parada en Marina Ibiza.' } },
    ],
  },
  {
    id: 'mare-e-tramonto',
    title: { it: 'Giorno di mare e tramonto', en: 'Sea and sunset day', es: 'Día de mar y atardecer' },
    intro: {
      it: 'Le calette della costa ovest, una dopo l’altra, fino al tramonto.',
      en: 'The coves of the west coast, one after another, until sunset.',
      es: 'Las calas de la costa oeste, una tras otra, hasta el atardecer.',
    },
    season: { it: 'Stagione indicativa: da maggio a ottobre.', en: 'Indicative season: May to October.', es: 'Temporada orientativa: de mayo a octubre.' },
    stops: [
      { ref: 'place', id: 'cala-bassa', role: 'beach' },
      { ref: 'place', id: 'cbbc', role: 'lunch', note: { it: 'Beach club sulla stessa spiaggia.', en: 'Beach club on the same beach.', es: 'Beach club en la misma playa.' } },
      { ref: 'place', id: 'cala-comte', role: 'beach' },
      { ref: 'place', id: 'sunset-cala-conta', role: 'sunset', note: { it: 'Già Sunset Ashram.', en: 'Formerly Sunset Ashram.', es: 'Antes Sunset Ashram.' } },
    ],
  },
];
