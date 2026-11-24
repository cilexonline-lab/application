// Genera content.json dai dati inclusi nell'app + FAQ del team (content/faq-team.json).
// Serve all'assistente IA (CONTENT_URL del server) e, in futuro, all'app per aggiornarsi senza App Store.
// Uso: npm run content -- <file di uscita>   (lo fa già npm run build:pages)
// Script Node (eseguito con esbuild, vedi npm run content): niente tipi Node nel progetto dell'app.
declare const require: any;
declare const process: any;
const { writeFileSync } = require('node:fs');
import { bundledClubs } from '../src/data/clubs';
import { bundledEvents } from '../src/data/events';
import { bundledNews } from '../src/data/news';
import { bundledTips } from '../src/data/tips';
import { bundledPlaces } from '../src/places';
import { bundledStays } from '../src/stays';
import { bundledReviews } from '../src/data/reviews';
import faqTeam from '../content/faq-team.json';

const out = process.argv[2] || 'content.json';
const noDemo = <T extends { demo?: boolean }>(l: T[]) => l.filter((x) => !x.demo);
// Solo le risposte compilate: una domanda senza risposta non va all'IA.
const faq = (faqTeam.faq as { q: string; a: string }[]).filter((f) => f.q?.trim() && f.a?.trim());
const data = {
  _info: 'Generato da cilex/tools/export-content.ts – non modificare a mano: cambia i dati in cilex/src/data o cilex/content/faq-team.json.',
  generated: new Date().toISOString(),
  clubs: bundledClubs,
  events: noDemo(bundledEvents),
  news: noDemo(bundledNews),
  tips: noDemo(bundledTips),
  places: noDemo(bundledPlaces),
  stays: noDemo(bundledStays),
  reviews: bundledReviews.filter((r) => r.consent === true),
  faq,
};
writeFileSync(out, JSON.stringify(data, null, 1));
console.log(`content.json: ${data.clubs.length} club, ${data.events.length} eventi, ${data.tips.length} consigli, ${faq.length} FAQ → ${out}`);
