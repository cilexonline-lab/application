// ⚠️ DA COMPILARE PRIMA DEL LANCIO
export const BRAND_NAME = 'CILEX';
export const BRAND_TAGLINE = 'Ibiza Luxury Concierge';

// Numero WhatsApp che riceve le richieste (formato internazionale, SOLO cifre, es. 34600000000).
export const WHATSAPP_NUMBER = '393923689968';

// URL di un file JSON con eventi/news/club (vedi content/content.example.json).
// Se compilato, l'app si aggiorna da sola SENZA nuova versione su App Store.
export const CONTENT_URL = '';

// Link dove il cliente lascia una recensione (es. il link "Chiedi recensioni" del profilo Google di Cilex).
// Vuoto = il pulsante "Lascia una recensione" apre WhatsApp col team.
export const REVIEW_URL = '';

// Obbligatori per la pubblicazione su App Store.
export const PRIVACY_URL = '';
export const SUPPORT_URL = '';

// Mostra eventi di esempio (marcati DEMO). Mettere false quando si inseriscono eventi reali.
export const SHOW_DEMO_DATA = false;

// Loghi ufficiali dei club (src/data/clubLogos.ts). Marchi di terzi: false per tornare ai monogrammi.
export const SHOW_CLUB_LOGOS = true;

// Argomenti suggeriti nella richiesta Concierge (chiavi i18n). Togli quelli che Cilex NON offre.
export const CONCIERGE_TOPICS = ['topicTransfer', 'topicVilla', 'topicChef', 'topicPhoto', 'topicOther'];

// Assistente IA "Ask". URL del server (vedi backend/ai-worker). Vuoto = la sezione mostra "in arrivo".
export const AI_ENDPOINT = '';
// Token condiviso con il server (APP_TOKEN). Non è un segreto forte: i limiti veri sono sul server.
export const AI_APP_TOKEN = '';
