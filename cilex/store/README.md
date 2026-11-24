# Kit App Store – BOZZA (24/11/2026)

> **Tutto in questa cartella è una bozza.** Niente è stato inviato ad Apple. Testi e screenshot vanno approvati da Francesco prima dell'uso.

## Cosa c'è
| File | Contenuto |
|---|---|
| `metadata.json` | Nome, sottotitolo, testo promozionale, descrizione e parole chiave in IT / EN / ES, entro i limiti Apple (nome e sottotitolo 30 caratteri, promozionale 170, descrizione 4.000, parole chiave 100 byte senza spazi dopo le virgole). |
| `screenshots/6.9-{it,en,es}/` | 6 screenshot per lingua da **1320 × 2868** (iPhone 6,9", formato obbligatorio): Home, Club, Selezione Cilex, Mappa, Chiedi, Richiedi. |
| `screenshots.cjs` | Rigenera gli screenshot dall'anteprima web (`SIZES=6.9,6.5` per avere anche il 6,5" a 1284 × 2778). |

Formati verificati il 24/11/2026 su developer.apple.com ("Screenshot specifications" e "Creating your product page").

## Limiti degli screenshot attuali (da sapere)
- Sono catture dell'**anteprima web**, senza la barra di stato dell'iPhone. Prima dell'invio è meglio rifarle su un iPhone vero o sul simulatore con la build EAS.
- **Selezione Cilex** senza foto: si vedono le iniziali (CC, CS…). Con foto **con permesso** la scheda è molto più forte.
- Lo screenshot di **Chiedi** ha molto spazio vuoto: andrà rifatto quando l'IA sarà accesa, con una risposta vera.
- Gli eventi mostrati hanno una data (12/12, 31/12): rigenerare gli screenshot quando cambiano.
- Consiglio: aggiungere sopra ogni screenshot una frase breve (es. "Il tuo tavolo VIP in 3 tocchi"). Si fa con un editor grafico, senza inventare dati.

## Checklist: cosa manca prima di inviare (in ordine)
**Bloccanti (senza questi Apple rifiuta)**
- [ ] **Account Apple Developer** a nome dell'azienda (99 $/anno). Decisione e pagamento: Francesco.
- [ ] **Privacy policy** pubblica: URL in `PRIVACY_URL` (`src/config.ts`). Deve dire che: l'app salva preferenze e piano solo sul telefono; le richieste si inviano dall'utente via WhatsApp; se l'IA è attiva, le domande di Chiedi vanno al server Cilex e ad Anthropic per generare le risposte; nessuna pubblicità né tracciamento.
- [ ] **Pagina di supporto** pubblica: URL in `SUPPORT_URL` (anche una pagina semplice con contatto email).
- [ ] **Permesso scritto di ogni club** per loghi e nomi (linea guida 5.2): Pacha, Amnesia, UNVRS, Hï Ibiza, Ushuaïa, Chinois, SWAG. Senza permesso: `SHOW_CLUB_LOGOS = false`.
- [ ] **Etichetta privacy** in App Store Connect coerente con la privacy policy (vedi sotto).
- [ ] **Classificazione per età**: l'app parla di club e vita notturna (riferimenti ad alcol): probabile **18+**. Da compilare il questionario in App Store Connect.

**Importanti**
- [ ] Build iOS con EAS (`npx eas-cli build -p ios`) e prova su **iPhone vero** (mai fatta finora).
- [ ] **Esenzione crittografia**: l'app usa solo HTTPS standard → in `app.json` aggiungere `ios.infoPlist.ITSAppUsesNonExemptEncryption = false` (piccola modifica di codice, da fare in una PR).
- [ ] **Contatto per la revisione** (nome, telefono, email): Francesco.
- [ ] **Copyright**: ragione sociale esatta di Cilex (es. "© 2026 …").
- [ ] Confermare la frase "Ti rispondiamo su WhatsApp entro 15 minuti" (vale anche di notte?) o cambiarla.
- [ ] Confermare che il numero WhatsApp nell'app sia quello aziendale.
- [ ] Approvare i 40 luoghi della Selezione Cilex (sei tu che conosci Ibiza).

**Facoltativi ma utili**
- [ ] IA accesa (guida `backend/ai-worker/ACCENDI-IA.md`) prima dell'invio, così Chiedi mostra risposte vere.
- [ ] Recensioni vere (con consenso) per la sezione "Dicono di noi".
- [ ] Categoria: **Viaggi** (principale), **Stile di vita** (secondaria). Prezzo: **gratis**.

## Bozza etichetta privacy (App Store Connect → App Privacy)
Da confermare con la privacy policy definitiva:
- **Dati raccolti dal server Cilex**: solo se l'IA è attiva → *Contenuti dell'utente* (le domande scritte in Chiedi), usati solo per la funzionalità dell'app, non collegati all'identità, nessun tracciamento. Un identificativo casuale del dispositivo serve solo per i limiti giornalieri anti-abuso.
- **Dati sul telefono** (nome facoltativo, date del viaggio, codice PR, piano): restano sul dispositivo, Apple non li considera "raccolti".
- **WhatsApp**: il messaggio lo invia l'utente dalla sua app WhatsApp.
- **Nessuna** pubblicità, analisi di terze parti o tracciamento.

## Bozza note per il revisore Apple (in inglese)
> Cilex is a concierge app for Ibiza. Users browse clubs, events and a curated selection of places, and send requests (VIP table, boat, concierge, villas) to the Cilex team: the app opens WhatsApp with a pre-filled message that the user chooses to send. No account or payment is required in the app; prices and availability are confirmed by the Cilex team in the WhatsApp conversation. The "Ask" tab routes questions to the right section of the app or to the team [if AI is enabled: and answers general questions about Ibiza using an AI service; users see a consent notice before first use].
