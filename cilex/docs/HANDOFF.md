# HANDOFF — stato al 24/11/2026

## Pubblicato su main
- #18 verifica 40 luoghi · #21 pin SWAG + link Es Torrent · #22 "Prenota con Cilex" · #23 rifiniture (tocco 44 pt, tasti indietro, date Piano)
- Ramo `lab/2026-11-24-eccezioni`: Atzaró Beach e Brula tolti dalla Selezione Cilex (non partner); "Prenota con Cilex" attivo su tutti i ristoranti e beach club (flag `bookable` impostato in `cilex/src/data/places.ts`).
- Sito rigenerato con `cd cilex && npm run build:pages`.

## Aggiunto dopo (autonomia concessa da Alex)
- "Le tue preferenze" (Piano): allergie, musica, occasione. Salvate solo sul telefono (AsyncStorage), aggiunte in coda ai messaggi WhatsApp della schermata Richiesta, solo se compilate. Funzione 2 di `proposte-concorrenza.md` (PR #20).
- Promemoria: allergie = dato sensibile; campo facoltativo, mai inviato a server, solo nel messaggio che l'utente stesso invia.

## Pubblicato: sostituti (PR #24, ok di Alex)
- Sa Trinxa (beach club, Ses Salines) al posto di Atzaró Beach; Sa Caleta (ristorante, Es Bol Nou) al posto di Brula. Entrambi con "Prenota con Cilex". Coordinate da verificare sul posto.

- "Le tue richieste" (schermata Richiesta): ultime 10 richieste inviate (ID CX-…, data, servizio), salvate solo sul telefono, con "Riapri WhatsApp" e "Svuota elenco". Nessuno stato "confermata": serve un server. Funzione 4 di `proposte-concorrenza.md`.

## IA spenta, Chiedi = WhatsApp diretto (25/11, richiesta di Alex)
- Tab Chiedi = "Scrivi al tuo concierge" (`AskScreen.tsx`): campo, "Invia su WhatsApp", 5 suggerimenti che riempiono il campo. Barra Home idem (invio diretto).
- Messaggio: `Cilex App · CX-…`, lingua app, `PR:` se presente, domanda alla lettera (`src/askWhatsApp.ts`). Salvato in "Le tue richieste" con il testo.
- Nessun riferimento all'IA nella UI. Codice IA conservato e spento: `src/screens/AskScreenAI.tsx` (non collegato), `src/ai.ts`, `src/intents.ts`, `backend/ai-worker/`. Per riaccendere: in `App.tsx` usare AskScreenAI e rimettere la barra Home.
- Promessa "24 ore su 24" scritta in app: assicurarsi che il team risponda davvero di notte.

## Lotto pubblicato il 25/11 (su "pubblica" di Alex)
- Uniti in un solo lotto: #37 link luoghi · #34+#38 Itinerari (dati + schermata) · #35 Vedi foto · #36 Invita un amico · #39+#42 calendario (Piano e Richiesta) · #40 testo Prenota + frase cancellazioni · #41 contatti Info · #43+#44 Home pulita + Prodotti (Standard/Luxury, due palette in `theme.ts`).
- Menu: nuova voce "Prodotti" (Standard e Luxury); "Esplora" resta nelle rotte ma fuori dalla barra.
- Ancora da fare: animazioni tra sezioni (passo 3: Standard scorrimento+glow azzurro, Luxury dissolvenza+luce oro, max 400–600 ms, Riduci movimento); testi Luxury veri da CONTENUTI (chiave `luxury`); statistiche anonime; mappa offline; meteo/mare; notifiche (solo progettazione).
- In attesa di Alex: #19 FAQ (23 scelte, solo italiano), #17 kit App Store, #20 documento concorrenza.
- Da sistemare: `SHARE_URL` ancora il sito di prova; il tasto indietro di Luxury è azzurro; coordinate di Sa Trinxa/Sa Caleta da verificare sul posto.

### Cosa ha funzionato / cosa è andato storto / regola nuova
- Ha funzionato: PR piccole + test Playwright su 4 formati; rilettura incrociata CONTENUTI/DEVELOPER (ha preso errori di nota e link).
- Andato storto: i18n.ts toccato da quasi tutte le PR nello stesso punto → conflitti a catena; test con selettori sbagliati (pagine nascoste restano nel DOM).
- Regola nuova: nuove chiavi i18n in coda al dizionario, non in testa; nei test usare `.last()` per i tab e controllare il testo visibile.

## In attesa (NON unire senza ok di Alex)
- #19 BOZZA 30 FAQ: Alex deve sceglierne 20–25.
- #17 BOZZA kit App Store.
- #20 documento concorrenza (solo testo).

## Decisioni di Alex (24/11)
1. Ordine di pubblicazione #18, #21, #22, #23, poi sito.
2. Prenota su tutti i ristoranti/beach club della Selezione; eccezioni Atzaró Beach e Brula (fuori).
3. "Risposta entro 15 minuti" vale 24/7: nei testi (`replyPromise`, EN/IT/ES) non ci sono limiti d'orario, quindi nessuna modifica necessaria.
4. Pin Café del Mar, Mambo, Cala Jondal, Cala Bassa, CBbC: confermati.
5. Numero WhatsApp `+39 392 368 9968` (`src/config.ts`) corretto.
6. Recensioni false: rifiutate; solo recensioni vere.

## Note tecniche
- Verifica: `npx tsc --noEmit` OK; export web con `EXPO_PUBLIC_AI_MOCK=1` OK. Il bundle usa il prefisso `/application/`: per provarlo in locale servire la cartella sotto quel percorso.
- Contesto: aprire una sessione nuova per risparmiare.
