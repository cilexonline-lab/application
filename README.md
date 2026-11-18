# Cilex — Ibiza Luxury Concierge

App iOS/Android/web (Expo SDK 58 / React Native) di Cilex Ibiza.

## Struttura
- `cilex/` — **codice sorgente dell'app** (vedi `cilex/CLAUDE.md` e `cilex/README.md`)
- `backend/ai-worker/` — Cloudflare Worker per l'assistente IA ("Ask")
- `index.html` — build web pubblicata su GitHub Pages: https://cilexonline-lab.github.io/application/

## Sviluppo
```bash
cd cilex
npm install
npx expo start
```
Typecheck: `npx tsc --noEmit` · Build web: `npx expo export --platform web`
