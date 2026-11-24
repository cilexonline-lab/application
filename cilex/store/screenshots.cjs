// Screenshot per App Store generati dall'anteprima web (BOZZA: da sostituire con catture da iPhone vero prima dell'invio).
// Uso (dalla cartella cilex):
//   npx expo export --platform web --output-dir /tmp/dist --clear
//   node store/screenshots.cjs /tmp/dist store/screenshots
// Formati Apple (verificati il 24/11/2026 su developer.apple.com, "Screenshot specifications"):
//   iPhone 6,9" → 1320 x 2868 (440 x 956 pt @3x)   iPhone 6,5" → 1284 x 2778 (428 x 926 pt @3x)
// Richiede Playwright (già presente nell'ambiente di sviluppo).
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const [, , DIST = '/tmp/dist', OUT = 'store/screenshots'] = process.argv;
const SIZES = { '6.9': { width: 440, height: 956 }, '6.5': { width: 428, height: 926 } };
const LANGS = { it: { beach: 'Mare', table: 'Voglio un tavolo VIP' }, en: { beach: 'Beach', table: 'I want a VIP table' }, es: { beach: 'Playa', table: 'Quiero una mesa VIP' } };
const ONLY = (process.env.SIZES || '6.9').split(',');

const types = { '.html': 'text/html', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.json': 'application/json' };
const srv = http.createServer((q, r) => {
  const p = decodeURIComponent(q.url.split('?')[0]).replace(/^\/application/, '');
  let f = path.join(DIST, p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html');
  r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(r);
}).listen(8099);

(async () => {
  const b = await chromium.launch();
  const errors = [];
  for (const size of ONLY) {
    for (const [lang, L] of Object.entries(LANGS)) {
      const dir = path.join(OUT, `${size}-${lang}`);
      fs.mkdirSync(dir, { recursive: true });
      const ctx = await b.newContext({ viewport: SIZES[size], deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: lang });
      const pg = await ctx.newPage();
      pg.on('pageerror', (e) => errors.push(`${size}-${lang}: ${e.message}`));
      ctx.on('page', (p) => p.close().catch(() => {}));
      await pg.goto(`http://localhost:8099/application/?lang=${lang}`);
      await pg.waitForTimeout(2500);
      const tabs = pg.getByRole('tab');
      const shot = async (n) => { await pg.waitForTimeout(1200); await pg.screenshot({ path: path.join(dir, `${n}.jpg`), type: 'jpeg', quality: 88 }); };
      const vis = (l) => l.locator('visible=true').first();
      await shot('1-home');
      await tabs.nth(1).click(); await shot('2-club');
      await vis(pg.getByText(L.beach, { exact: true })).click(); await shot('3-selezione');
      await tabs.nth(2).click(); await shot('4-mappa');
      await tabs.nth(3).click(); await vis(pg.getByText(L.table, { exact: true })).click(); await shot('5-chiedi');
      await tabs.nth(5).click(); await shot('6-richiedi');
      await ctx.close();
    }
  }
  await b.close();
  srv.close();
  console.log(errors.length ? 'ERRORI JS:\n' + errors.join('\n') : 'Screenshot fatti, nessun errore JS');
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
