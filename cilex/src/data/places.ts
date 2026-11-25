// Selezione Cilex: luoghi reali, scelti dal team (selezione curata, NON una classifica).
// Regole: niente prezzi/orari/recensioni; descrizione vuota (il campo non è tradotto); foto solo con permesso.
// Coordinate: OpenStreetMap via Nominatim (© OpenStreetMap contributors, ODbL), controllate il 24/11/2026.
// Accanto a ogni voce: elemento OSM e fonte che conferma l'attività nella stagione 2026.
// Senza coordinate affidabili = nessun pin (mapQuery serve solo per "Apri in Mappe").
// Link controllati il 25/11/2026 con Firecrawl (una sola scansione di 25 pagine): 20 rispondono, 1 reindirizzato (Experimental), 4 non risolvono e sono stati tolti.
// Tutti i locali sono stagionali: a novembre sono chiusi per l'inverno.
// Ricontrollo completo: cilex/docs/verifica-luoghi.md (24/11/2026).
import type { Place } from '../places';

const base: Place[] = [
  // ── Spiagge (luoghi naturali) ──
  { id: 'cala-comte', kind: 'beach', name: 'Cala Comte', area: 'Sant Josep', description: '', lat: 38.962885, lng: 1.2212672 }, // osm way/170709931
  { id: 'cala-salada', kind: 'beach', name: 'Cala Salada', area: 'Sant Antoni', description: '', lat: 39.0095323, lng: 1.2990915 }, // osm way/143217546
  { id: 'cala-dhort', kind: 'beach', name: "Cala d'Hort", area: 'Sant Josep', description: '', lat: 38.8898661, lng: 1.2245761 }, // osm way/172420703
  { id: 'ses-salines', kind: 'beach', name: 'Ses Salines', area: 'Sant Josep', description: '', lat: 38.8410652, lng: 1.391858 }, // osm way/95068828
  { id: 'es-cavallet', kind: 'beach', name: 'Es Cavallet', area: 'Ses Salines', description: '', lat: 38.8442414, lng: 1.4025454 }, // osm way/47233379
  { id: 'cala-bassa', kind: 'beach', name: 'Cala Bassa', area: 'Sant Josep', description: '', lat: 38.9680739, lng: 1.2396235 }, // osm way/119398204
  { id: 'aigues-blanques', kind: 'beach', name: 'Aigües Blanques', area: 'Santa Eulària', description: '', lat: 39.0598794, lng: 1.5891922 }, // osm way/92443897 ("Agua Blanca")
  { id: 'cala-xarraca', kind: 'beach', name: 'Cala Xarraca', area: 'Sant Joan', description: '', lat: 39.0985082, lng: 1.4963653 }, // osm way/173533487
  { id: 'cala-den-serra', kind: 'beach', name: "Cala d'en Serra", area: 'Sant Joan', description: '', lat: 39.1075884, lng: 1.5370257 }, // osm way/62263455
  { id: 'cala-tarida', kind: 'beach', name: 'Cala Tarida', area: 'Sant Josep', description: '', lat: 38.9400758, lng: 1.2357636 }, // osm way/119396811

  // ── Beach club ──
  { id: 'nikki-beach', kind: 'beachclub', name: 'Nikki Beach Ibiza', area: "S'Argamassa", description: '', link: 'https://nikkibeach.com/ibiza/', lat: 38.9923017, lng: 1.5692682 }, // osm node/3930092780 · 2026: ibiza-spotlight.com/event/nikki-beach-opening
  { id: 'blue-marlin', kind: 'beachclub', name: 'Blue Marlin Ibiza', area: 'Cala Jondal', description: '', link: 'https://www.bluemarlinibiza.com/', lat: 38.8679417, lng: 1.3176714 }, // osm node/14376960928 · 2026: sito ufficiale, opening weekend 25/04/2026
  { id: 'tropicana', kind: 'beachclub', name: 'Tropicana Ibiza', area: 'Cala Jondal', description: '', link: 'https://www.tropicanaibiza.com/en/', lat: 38.869034, lng: 1.3141041 }, // osm node/14376993059 · 2026: ibiza-spotlight.com (apertura 27/03/2026)
  { id: 'beachouse', kind: 'beachclub', name: 'Beachouse Ibiza', area: "Playa d'en Bossa", description: '', link: 'https://www.beachouseibiza.com/', lat: 38.8799649, lng: 1.4037498 }, // osm way/213884764 · 2026: beachouseibiza.com/summerclosing2026
  { id: 'nassau', kind: 'beachclub', name: 'Nassau Beach Club', area: "Playa d'en Bossa", description: '', link: 'https://www.nassaubeachclub.com/', lat: 38.8790944, lng: 1.4035407 }, // osm way/213801532 · 2026: Instagram ufficiale
  { id: 'cbbc', kind: 'beachclub', name: 'Cala Bassa Beach Club', area: 'Cala Bassa', description: '', link: 'https://cbbcgroup.com/cbbc-cala-bassa-beach-club/en/', lat: 38.9679405, lng: 1.239189 }, // osm way/242648824 · 2026: welcometoibiza.com
  { id: 'experimental-beach', kind: 'beachclub', name: 'Experimental Beach', area: 'Cap des Falcó', description: '', link: 'https://www.experimentalgroup.com/ibiza/experimental-beach-ibiza', lat: 38.8516828, lng: 1.3676351 }, // osm way/333029705 (solo "building") · 2026: white-ibiza.com
  { id: 'beso-beach', kind: 'beachclub', name: 'Beso Beach Ibiza', area: 'Ses Salines', description: '', link: 'https://besobeach.com/ibiza/', lat: 38.8424611, lng: 1.3876123 }, // osm node/9004679517 · 2026: besobeach.com (Sailing Fest 05/2026)
  { id: 'cotton-beach-club', kind: 'beachclub', name: 'Cotton Beach Club', area: 'Cala Tarida', description: '', lat: 38.9403501, lng: 1.2362461 }, // osm way/172420711 ("Cotton Club") · 2026: Instagram ufficiale · LINK RIMOSSO 25/11: dominio non risolve (DNS), forse cottonbeachclub.com (NON verificato)
  { id: 'sa-trinxa', kind: 'beachclub', name: 'Sa Trinxa', area: 'Ses Salines', description: '', link: 'https://satrinxa.com/en/', lat: 38.8401014, lng: 1.394107 }, // APPROVATO da Alex 24/11 · osm way/333029070 (amenity=restaurant) · 2026: sito ufficiale + Instagram (apertura fine aprile 2026) · sostituisce Atzaró Beach (non partner)

  // ── Ristoranti ──
  { id: 'sa-caleta', kind: 'restaurant', name: 'Sa Caleta', area: 'Es Bol Nou', description: '', link: 'https://sacaleta.es/en/', lat: 38.8686239, lng: 1.3318977 }, // APPROVATO da Alex 24/11 · osm way/316970713 · 2026: sito ufficiale, Facebook (ultima cena estate 23/10/2026) · sostituisce Brula (non partner)
  { id: 'casa-jondal', kind: 'restaurant', name: 'Casa Jondal', area: 'Cala Jondal', description: '', link: 'https://www.casajondal.es/', lat: 38.868411, lng: 1.3160642 }, // osm node/9211779317 · 2026: forbes.es (Best Chiringuito 2026)
  { id: 'es-torrent', kind: 'restaurant', name: 'Es Torrent', area: 'Porroig', description: '', link: 'https://www.instagram.com/estorrentrestaurant/', lat: 38.8751327, lng: 1.2990077 }, // osm node/6635835086 · link: Instagram ufficiale (sito estorrent.net non raggiungibile il 24/11/2026) · 2026: oneofakindtravel.com/en/blog/es-torrent
  { id: 'es-xarcu', kind: 'restaurant', name: 'Es Xarcu', area: 'Porroig', description: '', link: 'https://www.esxarcurestaurante.com/', lat: 38.8685001, lng: 1.3115214 }, // osm node/6582679585 · 2026: Instagram ufficiale
  { id: 'la-paloma', kind: 'restaurant', name: 'La Paloma', area: 'Sant Llorenç', description: '', link: 'https://palomaibiza.com/', lat: 39.0305565, lng: 1.47573 }, // osm node/4177089791 · 2026: white-ibiza.com (riapertura 12/03/2026)
  { id: 'sa-capella', kind: 'restaurant', name: 'Sa Capella', area: 'Sant Antoni', description: '', link: 'https://www.sacapellaibiza.com/en/', lat: 38.9905085, lng: 1.3087633 }, // osm way/321335339 · 2026: ultima cena 17/10/2026 (sito ufficiale)
  { id: 'es-boldado', kind: 'restaurant', name: 'Es Boldado', area: "Cala d'Hort", description: '', lat: 38.8904535, lng: 1.2212321 }, // osm node/2201362030 · 2026: Instagram ufficiale 09/2026 · LINK RIMOSSO 25/11: dominio non risolve (DNS), sito ufficiale da ritrovare
  { id: 'amante', kind: 'restaurant', name: 'Amante Ibiza', area: "Sol d'en Serra", description: '', link: 'https://www.amanteibiza.com/', lat: 38.9472743, lng: 1.5104185 }, // osm node/1844684323 · 2026: white-ibiza.com (riapertura 17/04/2026)
  { id: 'sa-punta', kind: 'restaurant', name: 'Sa Punta', area: 'Talamanca', description: '', link: 'https://www.sapuntaibiza.com/en', lat: 38.9149485, lng: 1.4634364 }, // osm node/443609622 · 2026: magicalibiza.com (stagione dal 21/04)
  { id: 'el-chiringuito', kind: 'restaurant', name: 'El Chiringuito', area: 'Es Cavallet', description: '', link: 'https://elchiringuitoibiza.com/es/', lat: 38.8479222, lng: 1.4016531 }, // osm node/1065356312 · 2026: sito/Instagram ufficiale

  // ── Tramonto ──
  { id: 'cafe-del-mar', kind: 'sunset', name: 'Café del Mar', area: 'Sant Antoni', description: '', link: 'https://cafedelmar.com/ibiza/reservations', lat: 38.9806635, lng: 1.2963639 }, // osm node/5856208286 · 2026: sito ufficiale (02/04–24/10/2026)
  { id: 'cafe-mambo', kind: 'sunset', name: 'Café Mambo', area: 'Sant Antoni', description: '', link: 'https://www.cafemamboibiza.com/', lat: 38.9809267, lng: 1.2960994 }, // osm node/1418767338 · 2026: sito ufficiale (news eclissi 12/08/2026)
  { id: 'benirras', kind: 'sunset', name: 'Cala Benirràs', area: 'Sant Joan', description: '', lat: 39.0894438, lng: 1.4539229 }, // osm way/92434594 (natural=beach)
  { id: 'torre-des-savinar', kind: 'sunset', name: 'Torre des Savinar', area: "Cala d'Hort", description: '', lat: 38.8741725, lng: 1.2283659 }, // osm way/507790845 (man_made=tower)
  { id: 'sunset-cala-conta', kind: 'sunset', name: 'Sunset Cala Conta', area: 'Cala Comte', description: '', lat: 38.9627176, lng: 1.220812 }, // ex Sunset Ashram · osm way/311929115 (ancora col vecchio nome) · 2026: apertura 02/04/2026 · LINK RIMOSSO 25/11: dominio non risolve (DNS), forse sunsetashram.com (NON verificato)
  { id: 'hostal-la-torre', kind: 'sunset', name: 'Hostal La Torre', area: 'Cap Negret', description: '', link: 'https://www.latorreibiza.com/en/', lat: 38.9981693, lng: 1.2856854 }, // osm node/3213664727 · 2026: ibiza-spotlight.com (Halloween 31/10/2026)
  { id: 'kumharas', kind: 'sunset', name: 'Kumharas', area: 'Cala de Bou', description: '', lat: 38.9721715, lng: 1.2825561 }, // osm node/5075923724 (Cala de Bou, comune di Sant Josep) · 2026: ibiza-spotlight.com (sunset sessions) · LINK RIMOSSO 25/11: dominio non risolve (DNS), sito ufficiale da ritrovare
  { id: 'sa-talaia', kind: 'sunset', name: 'Sa Talaia', area: 'Sant Josep', description: '', lat: 38.9132054, lng: 1.2758074 }, // osm node/1249786706 (natural=peak)
  { id: 'punta-sa-galera', kind: 'sunset', name: 'Punta de sa Galera', area: 'Sant Antoni', description: '', lat: 39.0044417, lng: 1.2892809 }, // osm node/12031435912 (natural=cape)
  { id: 'cala-gracio', kind: 'sunset', name: 'Cala Gració', area: 'Sant Antoni', description: '', lat: 38.9919613, lng: 1.290434 }, // osm way/31443465 ("Cala Grassio")
];

// "Prenota con Cilex" su tutti i ristoranti e i beach club della Selezione (Cilex collabora con tutti). Decisione di Alex, 24/11/2026.
export const selectionPlaces: Place[] = base.map((p) =>
  p.kind === 'restaurant' || p.kind === 'beachclub' ? { ...p, bookable: true } : p);
