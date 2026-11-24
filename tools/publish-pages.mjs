// Copia la build web (site-build/) nella radice del repo, servita da GitHub Pages su /application/.
import { cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'site-build');
for (const p of ['index.html', '_expo', 'assets', 'favicon.ico', 'metadata.json', 'content.json']) {
  rmSync(join(root, p), { recursive: true, force: true });
  if (existsSync(join(src, p))) cpSync(join(src, p), join(root, p), { recursive: true });
}
rmSync(src, { recursive: true, force: true });
console.log('Build web pubblicata nella radice del repo.');
