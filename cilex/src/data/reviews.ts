// Recensioni dei clienti: SOLO recensioni REALI, con il consenso dell'autore a pubblicarle.
// Vietato inventarle o riscriverle (direttiva UE "Omnibus", Allegato I punto 23c; Apple App Review 5.6.3).
// Fonte consigliata: content.json → "reviews" (si aggiornano senza nuova versione dell'app).
// Formato: { id, name: "Nome + iniziale", text: "testo originale", date: "YYYY-MM-DD",
//            rating?: 1-5, source: "google" | "trustpilot" | "tripadvisor" | "whatsapp" | "email" | "app", consent: true }
// Senza recensioni la sezione in Home non compare.
export type ReviewSource = 'google' | 'trustpilot' | 'tripadvisor' | 'whatsapp' | 'email' | 'app';
export const REVIEW_SOURCES: ReviewSource[] = ['google', 'trustpilot', 'tripadvisor', 'whatsapp', 'email', 'app'];
export type Review = { id: string; name: string; text: string; date: string; rating?: number; source: ReviewSource; consent: true };

export const bundledReviews: Review[] = [];

