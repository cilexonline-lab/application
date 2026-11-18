# Cilex App

Expo / React Native (TypeScript). iOS + Android.

## Avvio (Mac)
    npm install
    npx expo start        # "i" = simulatore iOS, oppure Expo Go con il QR

## Cosa compilare (src/config.ts)
- WHATSAPP_NUMBER: solo cifre, formato internazionale (es. 34600000000)
- CONTENT_URL: URL del JSON con eventi/news/club → aggiornamenti SENZA nuova versione su App Store
- PRIVACY_URL e SUPPORT_URL: obbligatori per l'App Store
- SHOW_DEMO_DATA: false al lancio

## Aggiornare eventi senza App Store
1. Copia `content/content.example.json`, compila clubs / events / news.
2. Pubblicalo su un URL https pubblico (es. file sul tuo sito, GitHub raw, hosting statico).
3. Metti l'URL in CONTENT_URL e rilascia l'app UNA volta.
4. Da lì in poi modifichi solo il JSON: l'app lo scarica all'apertura e col pull-to-refresh, e lo tiene in cache offline.
Un JSON sbagliato non rompe l'app: le voci non valide vengono ignorate e si usa la cache/i dati inclusi.
Campi: date = YYYY-MM-DD; ticketUrl dell'evento ha priorità su quello del club; imageUrl solo con permesso del club.

## Funzioni pensate per la stagione
- **Stasera / Weekend / Settimana**: filtri in Home + card dorata "Stasera" quando c'è un evento in giornata.
- **Artisti seguiti**: il cliente segue un artista e vede i suoi show in Home.
- **Piano viaggio**: date arrivo/partenza, countdown, giorni raggruppati, avviso se due programmi sulla stessa sera, condivisione del piano col gruppo.
- **Tracciamento richieste**: ogni richiesta WhatsApp parte con un ID (es. CX-4F7K), l'origine "Cilex App" e il **codice PR** del cliente. Serve a sapere quante richieste arrivano dall'app e a quale PR attribuirle (commissioni).
- **Concierge**: argomenti suggeriti in `CONCIERGE_TOPICS` (src/config.ts). Togli quelli che Cilex non offre.
- **Good to know**: consigli (`tips`) e regole dei club (`rules`) gestiti dal JSON.
- Il codice PR viene ricordato dall'app; per far arrivare il codice al cliente giusto va dato dal PR (a voce o con QR).

## Assistente IA "Ask"
La tab Ask risponde alle domande sui clienti su Ibiza. **La chiave dell'IA non sta mai nell'app**: passa da un piccolo server (`backend/ai-worker`).
1. Crea una chiave API Anthropic e **imposta un limite di spesa mensile** nella console.
2. `cd backend/ai-worker && npx wrangler deploy` poi `npx wrangler secret put ANTHROPIC_API_KEY` (e opzionalmente `APP_TOKEN`).
3. In `wrangler.toml` metti `CONTENT_URL` (lo stesso JSON dell'app): l'assistente così conosce eventi, regole dei club e consigli UFFICIALI.
4. Crea un KV `RL` per i limiti giornalieri (40 domande/dispositivo, 150/IP) e decommenta il blocco in `wrangler.toml`.
5. In `src/config.ts` metti `AI_ENDPOINT` (URL del worker) e, se usi `APP_TOKEN`, `AI_APP_TOKEN`.
Finché `AI_ENDPOINT` è vuoto la tab mostra "in arrivo".
Test del server: `cd backend/ai-worker && node test.mjs` (usa un'API simulata).
**Per App Store:** la privacy policy deve dire che le domande dei clienti sono inviate a un servizio di IA (Anthropic) per generare le risposte. L'app mostra già il consenso al primo uso e un link "Segnala questa risposta".

## Logo
Sostituire il Wordmark testuale in `src/components/ui.tsx` con il logo CILEX; icona/splash in `assets/` e `app.json`.

## Pubblicazione
Account Apple Developer → `npx eas-cli build -p ios` → App Store Connect.

## Esplora: luoghi, mappa, promemoria

**Tab Esplora** (ex Club): Club · Mare (beach club + spiagge) · Cibo · Giorno.

**Tab Mappa** (sezione a sé, 6ª tab della barra; scorciatoia anche da una card in Home).
- I luoghi vivono nel JSON remoto, chiave `places` (vedi `content/content.example.json`): `kind` = `beachclub | beach | restaurant | day`. Nel codice ci sono solo 4 esempi marcati *demo* (spariscono con `SHOW_DEMO_DATA = false`). Nessun luogo reale è inventato.
- `bookable: true` mostra "Richiedi via Cilex" (apre la richiesta concierge con il nome del luogo): attivalo SOLO dove avete davvero il servizio. I `link` accettano solo http/https.
- **Mappa** (`Map3DScreen` + `src/components/IbizaMap.tsx`): mappa illustrata stile poster di Ibiza, uguale su iPhone/Android/web (nessuna chiave, nessun costo, nessun permesso). Le immagini `assets/ibiza-map.jpg` (giorno) e `assets/ibiza-map-night.jpg` (notte, con luci dorate sui paesi; pulsante ☀/☾) sono generate da `tools/make_map.py` (contorno isola © OpenStreetMap contributors, rilievo Copernicus DEM via Open-Meteo; colori, alberi, onde e barche sono illustrazione, **non** topografia esatta; le scritte dei paesi sono nell'immagine e le loro posizioni sono da verificare). Case dei paesi, saline e nuvole sono decorative. Per rigenerarle: `python3 tools/make_map.py day` e `python3 tools/make_map.py night` (una alla volta: servono ~4 GB di RAM ciascuna) (numpy, scipy, pillow). I pin si posizionano per `lat`/`lng` sull'immagine (stessa proiezione dello script; devono cadere su Ibiza), con trascinamento, pizzico per zoom, pulsanti +/−/⌂, filtri e scheda con Dettagli / Apri in Mappe. Coordinate dei club da OpenStreetMap, controllate il 17/11/2026: **da verificare sul posto**. SWAG non risultava: nessun pin finché non fornisci `lat`/`lng` nel JSON. Non verificata su un iPhone reale.
- **Promemoria** (notifiche LOCALI, senza server): alle 12:00 del giorno di un evento con un artista seguito o nel Piano. Il permesso si chiede solo al tap su "Attiva i promemoria". Max 40 in coda. Gli eventi nuovi vengono recepiti quando l'utente apre l'app: per avvisare chi ha l'app chiusa servono notifiche push remote (server + token), non incluse.


## Brand
Logo ufficiale CILEX (da `LOGO-CILEX-blue+nero.pdf`): azzurro **#00DBFF** su nero. Il logo è vettoriale in `src/components/Logo.tsx` (`LogoWordmark`, `LogoMark`, `LogoOval`); i colori sono in `src/theme.ts` (`colors.brand`). Icona, splash, icone Android e favicon sono generati dal logo in `assets/`; la mappa (`tools/make_map.py`) ha il logo nel mare e le luci notturne azzurre. Il simbolo ® del file originale non è usato nell'app: aggiungilo solo se il marchio è registrato.

## Ville e appartamenti
Sezione `Stays` (Home → Appartamenti / Ville): elenco filtrabile per tipo e zona, scheda dettaglio con camere/bagni/ospiti, punti di forza, prezzo e pulsanti *Richiedi questo soggiorno* (precompila il modulo con il nome dell'immobile) e WhatsApp. Gli immobili vivono nel JSON remoto, chiave `stays` (vedi `content/content.example.json`); nel codice ci sono solo 2 esempi marcati *demo* (spariscono con `SHOW_DEMO_DATA = false`). Se manca `priceNote` l'app scrive "Prezzo su richiesta": nessun prezzo né disponibilità sono inventati. Disponibilità e prezzi li conferma il team su WhatsApp.
