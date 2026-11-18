# Cilex — Ibiza Luxury Concierge

App iOS/Android/web (Expo SDK 58 / React Native) di Cilex Ibiza.

## Struttura
- `cilex/` — **codice sorgente dell'app** (vedi `cilex/CLAUDE.md` e `cilex/README.md`)
- `backend/ai-worker/` — Cloudflare Worker per l'assistente IA ("Ask")
- `index.html`, `_expo/`, `assets/` — build web generata, pubblicata su GitHub Pages: https://cilexonline-lab.github.io/application/ (non modificare a mano)

## Sviluppo
```bash
cd cilex
npm install
npx expo start
```
Typecheck: `npx tsc --noEmit` · Build web: `npx expo export --platform web`

Aggiornare il sito: `cd cilex && npm run build:pages`, poi commit e push.
