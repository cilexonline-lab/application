@AGENTS.md

# CILEX — app iOS/Android (Expo / React Native)

App per Ibiza di **Cilex Ibiza Luxury Concierge** (CEO: Francesco): eventi e club, mappa illustrata di Ibiza, assistente "Chiedi" (IA), piano personale con promemoria, richieste via WhatsApp (tavolo VIP, barca, concierge, appartamenti, ville) e sezione Ville e appartamenti. Da pubblicare su App Store. Funzionalmente simile ad ACCO Ibiza ma **nostra**: non copiare codice, testi, immagini, icona o nome di ACCO.

Lingua dell'utente: **italiano** (scrive veloce, con errori: interpreta l'intento). L'app è in EN/IT/ES (`src/i18n.ts`, ogni testo nuovo va nelle 3 lingue). Il Mac è il computer principale: istruzioni per macOS.

## Regole non negoziabili
- **Mai inventare** prezzi, disponibilità, commissioni, immobili, luoghi, persone, guestlist, orari. Dato mancante = non mostrarlo ("Prezzo su richiesta") e segnalarlo. I dati d'esempio sono marcati DEMO (`SHOW_DEMO_DATA` in `src/config.ts`).
- **Niente guestlist**: è stata rimossa di proposito dall'app. Non reintrodurla.
- Foto e testi dei club/locali solo con permesso scritto. Il ® del logo non è usato.
- Contraddire le idee deboli dell'utente con motivazioni, non assecondare.
- Usa Firecrawl (se disponibile) per ricerche e dati esterni.
- Distingui sempre STORICO / ATTUALE / DA VERIFICARE.

## Brand
Logo ufficiale in `design/LOGO-CILEX-bluenero.pdf` (azzurro **#00DBFF** su nero). Vettoriale in `src/components/Logo.tsx`; colori in `src/theme.ts` (`colors.brand`). Icone/splash in `assets/` generate dal logo.

## Comandi (macOS)
```bash
npm install
npx expo start            # poi scansiona il QR con Expo Go su iPhone
npx tsc --noEmit          # typecheck (deve restare pulito)
npx expo export --platform ios --output-dir /tmp/ios-dist   # controllo bundle iOS
```
Anteprima web: `npx expo export --platform web` (con `EXPO_PUBLIC_AI_MOCK=1` per l'IA finta).
Prima di scrivere codice Expo/RN controlla la versione in `package.json` (Expo SDK 58) e le docs su https://docs.expo.dev/llms.txt (le API cambiano).

## Struttura
- `App.tsx` — tab: Home, Esplora (`Clubs`), Mappa (`Map3D`), Chiedi (`Ask`), Piano, Richiedi; stack: dettagli, `Stays`, `StayDetail`, `Request`, `Info`. `WhatsAppFab` = widget WhatsApp fisso in ogni schermata.
- `src/content.tsx` — contenuti da JSON remoto (`CONTENT_URL`) con cache e fallback ai dati inclusi; chiavi: clubs, events, news, tips, places, **stays**, faq. Esempio: `content/content.example.json`.
- `src/stays.ts`, `src/places.ts` — modelli e sanitizzazione (JSON sbagliato non rompe l'app).
- `src/components/IbizaMap.tsx` + `src/screens/Map3DScreen.tsx` — mappa illustrata (immagine `assets/ibiza-map.jpg` giorno / `ibiza-map-night.jpg` notte) con pin, zoom, pan. Le immagini si rigenerano con `python3 tools/make_map.py day` e `... night` (una alla volta, ~4 GB RAM; servono numpy, scipy, pillow). Contorno isola © OpenStreetMap contributors, rilievo Copernicus DEM; colori/alberi/casette/nuvole sono illustrazione. Le posizioni di paesi/saline nell'immagine sono approssimative: **da verificare**. Le coordinate dei club vengono da OpenStreetMap: **da verificare sul posto** (SWAG senza coordinate = nessun pin).
- `src/screens/RequestScreen.tsx` — richieste che aprono WhatsApp con messaggio precompilato (`src/whatsapp.ts`).
- `src/screens/AskScreen.tsx`, `src/ai.ts`, `src/intents.ts`, `backend/ai-worker/` — tab Chiedi. Con `AI_ENDPOINT`: assistente IA via Cloudflare Worker (SDK Anthropic, output strutturato `{reply, actions}`; chiave solo sul server; test in `backend/ai-worker/test.mjs`, `eval.mjs`; FAQ di base `faq-app.json`, FAQ del team in `content.json` → `faq`, modello `faq-template.json`). Senza `AI_ENDPOINT`: modalità locale (`src/intents.ts`) che riconosce la richiesta e propone i pulsanti verso la sezione giusta o il team. Le azioni (tavolo, barca, concierge, ville, appartamenti, club, evento, esplora, mappa, piano, WhatsApp) diventano pulsanti sotto la risposta.
- `src/notify.ts`, `RemindersSync.tsx` — promemoria locali (solo iPhone/Android, non web).

## Stato (23/11/2026)
Fatto e verificato solo su anteprima web + export iOS: tutto quanto sopra.
- Mappa: all'apertura l'isola intera è centrata fra filtri (125 pt, 165 sotto i 360 pt) e pannello (215 pt); zoom minimo = copertura dello schermo; ⌂ torna lì; tocco su pin = 1,8× la vista iniziale.
- Esplora: vetrine nere a tutta larghezza (`ClubCard`), luce nel colore del club dietro al logo bianco, zona + pillola "N eventi"/"Date in arrivo". Pagine club ed evento con testata a tutto schermo (`ClubHero`) e intestazione trasparente. Loghi Pacha/Amnesia in versione bianca (`assets/logo-*-white.png`, ricavati dagli originali). Nessun logo per SWAG (si vede il nome).
- Anteprima web: `public/index.html` = modello con `viewport-fit=cover`, `100dvh` e, sopra i 600 px, cornice da telefono 400×860.

**Mai provato su un iPhone vero**: priorità 1 = provarlo con Expo Go (posizione del widget WhatsApp sopra la tab bar, safe area in alto, mappa a due dita, notifiche).

## Da fare (richiede dati/azioni dell'utente)
1. `WHATSAPP_NUMBER` in `src/config.ts` è compilato: confermare che sia il numero aziendale (il repository è pubblico).
2. Contenuti reali nel JSON remoto (`CONTENT_URL`): eventi con link biglietti, club, luoghi (beach club/ristoranti/attività con zona, link, coordinate), **immobili `stays`** (nome, zona generica, camere, bagni, ospiti, punti di forza, foto con permesso; prezzo solo se pubblico), FAQ reali (30–50 domande dei clienti). Poi `SHOW_DEMO_DATA = false`.
3. `PRIVACY_URL`, `SUPPORT_URL` (obbligatori per App Store).
4. Account Apple Developer (99 $/anno), bundle `com.cilex.ibiza`, build con EAS, schede App Store, screenshot.
5. IA: account Cloudflare (gratuito) + chiave Anthropic con limite di spesa, deploy del worker (`backend/ai-worker/README.md`), poi `AI_ENDPOINT`/`AI_APP_TOKEN`. FAQ sul servizio (pagamenti, cancellazioni, orari del team, lingue): le scrive il team in `content.json` → serve `CONTENT_URL` pubblico.
6. Coordinate e logo ufficiale di SWAG; verifica sul posto delle coordinate dei club. Permesso scritto di ogni club per loghi/foto (Apple 5.2).
7. Idee non fatte: FAQ locale (menu a tocco + ricerca) senza IA, deep link/QR per PR, richiesta recensione, biglietti offline, push remote (serve server).
