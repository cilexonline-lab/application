// Valutazione dell'assistente su domande reali.
// Uso:  node eval.mjs <URL-del-worker> [APP_TOKEN] [file-domande.json]
// Per ogni domanda manda la richiesta al server vero, controlla le regole minime
// (mustMatchAny / mustNotMatch) e salva TUTTE le risposte in eval-report.md
// perché un controllo automatico non sostituisce la lettura umana.
import { readFileSync, writeFileSync } from 'node:fs';

const [url, token = '', file = new URL('./eval-questions.json', import.meta.url).pathname] = process.argv.slice(2);
if (!url) { console.error('Uso: node eval.mjs <URL-del-worker> [APP_TOKEN] [file-domande.json]'); process.exit(2); }

const questions = JSON.parse(readFileSync(file, 'utf8'));
const results = [];
let device = '';
for (let i = 0; i < questions.length; i++) {
  if (i % 30 === 0) device = 'eval-' + Math.random().toString(36).slice(2, 10); // resta sotto il limite per dispositivo
  const item = questions[i];
  let reply = '', error = '';
  try {
    const headers = { 'content-type': 'application/json', 'x-device': device };
    if (token) headers['x-app-token'] = token;
    const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ messages: [{ role: 'user', content: item.q }] }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.reply) reply = j.reply; else error = `HTTP ${r.status} ${j.error ?? ''}`.trim();
  } catch (e) { error = 'rete: ' + e.message; }

  const problems = [];
  if (error) problems.push(error);
  else {
    const any = item.mustMatchAny ?? [];
    if (any.length && !any.some((p) => new RegExp(p, 'i').test(reply))) problems.push(`nessuna di queste presente: ${any.join(' | ')}`);
    for (const p of item.mustNotMatch ?? []) if (new RegExp(p, 'i').test(reply)) problems.push(`contiene vietato: ${p}`);
    if (reply.split(/\s+/).length > 170) problems.push('troppo lunga (>170 parole)');
  }
  results.push({ ...item, reply, problems });
  console.log(`${problems.length ? 'FAIL' : 'OK  '} [${item.cat ?? '-'}] ${item.q}${problems.length ? '\n       → ' + problems.join('; ') : ''}`);
  await new Promise((r) => setTimeout(r, 400));
}

const failed = results.filter((r) => r.problems.length);
const md = [
  `# Report valutazione assistente – ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
  `Domande: ${results.length} · automatiche superate: ${results.length - failed.length} · fallite: ${failed.length}`,
  '',
  'LEGGI TUTTE le risposte qui sotto: i controlli automatici prendono solo gli errori più grossolani.',
  '',
  ...results.flatMap((r) => [
    `## ${r.problems.length ? '❌' : '✅'} [${r.cat ?? '-'}] ${r.q}`,
    r.problems.length ? `Problemi: ${r.problems.join('; ')}` : '',
    '', r.reply || '(nessuna risposta)', '',
  ]),
].join('\n');
writeFileSync('eval-report.md', md);
console.log(`\n${results.length - failed.length}/${results.length} controlli automatici superati. Report completo: eval-report.md`);
process.exit(failed.length ? 1 : 0);
