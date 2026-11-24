# Cilex AI proxy

Server minimo (Cloudflare Worker) tra l'app e l'API Anthropic.

- La **chiave API** e le **regole dell'assistente** stanno solo qui.
- Il contesto (eventi, regole club, consigli) viene scaricato dal server da `CONTENT_URL`: il client non può alterarlo né cambiare le regole (il campo `system` inviato dal client viene ignorato).
- Validazione input (max 500 caratteri a messaggio, max 8 turni), limiti giornalieri per dispositivo e IP (serve il KV `RL`), errori senza dettagli verso il client.
- Regole principali: non inventa prezzi/orari/disponibilità/line-up/servizi Cilex; non conferma prenotazioni; resta su Ibiza; risponde nella lingua dell'utente; non parla di guestlist.
- **Pulsanti verso l'app**: la risposta è JSON strutturato `{ reply, actions }` (SDK Anthropic, `messages.parse` + schema Zod). `actions` (max 3) apre le sezioni dell'app: `table` (con club), `boat`, `concierge`, `villa`, `apartment`, `club`, `event`, `explore`, `map`, `plan`, `whatsapp`. Il server scarta azioni sconosciute e club/eventi che non esistono nei dati ufficiali; l'app le ricontrolla.
- **FAQ di base** (`faq-app.json`): risposte vere su come funziona l'app (come chiedere tavolo, barca, ville, biglietti, promemoria). Le FAQ del team in `content.json` hanno la precedenza.

## Deploy (serve un account Cloudflare gratuito e una chiave API Anthropic)
    npm install              # SDK Anthropic + zod (il bundle lo fa wrangler; serve compatibility_flags = ["nodejs_compat"], già impostato)
    npx wrangler login
    npx wrangler deploy
    npx wrangler secret put ANTHROPIC_API_KEY
    npx wrangler secret put APP_TOKEN      # facoltativo
Poi nell'app (`cilex/src/config.ts`): `AI_ENDPOINT` = URL stampato da wrangler (es. `https://cilex-ai.<nome>.workers.dev`) e, se usato, `AI_APP_TOKEN`.
Finché `AI_ENDPOINT` è vuoto la tab Chiedi funziona lo stesso in modalità locale: riconosce la richiesta (tavolo, barca, villa, eventi, club…) e apre la sezione giusta o il team su WhatsApp.
    # solo per provare l'app nel BROWSER (non serve su iPhone): ALLOW_ORIGIN = "http://localhost:8081" in [vars]

## Test
    npm install && node test.mjs     # API simulata, nessun costo

## Limiti noti (onesti)
- `APP_TOKEN` è dentro l'app, quindi non è un vero segreto: scoraggia l'abuso casuale. La protezione reale sono i limiti e il tetto di spesa impostato nella console Anthropic.
- Il modello conosce Ibiza in generale ma può sbagliare su locali, orari e prezzi che cambiano: per questo le regole lo obbligano a non confermarli e a rimandare al team.
- Il costo dipende da modello e lunghezza delle risposte: controlla l'uso reale nella console dopo i primi giorni.

## Come "allenare" l'assistente (nessun riaddestramento)

Il modello non si addestra: gli si danno **risposte approvate da voi** e lui le usa.

1. **FAQ approvate** – nel tuo `content.json` (quello a `CONTENT_URL`) aggiungi la chiave `"faq": [{ "q": "...", "a": "..." }]`. Il server le legge a ogni richiesta (max 60 voci, risposta max 400 caratteri) e le tratta come verità ufficiale: l'assistente le rielabora e le traduce, ma non le contraddice. L'app ignora questa chiave. Parti da `faq-template.json` (risposte vuote = ignorate) e compila solo ciò che è vero oggi.
2. **Dati ufficiali** – eventi, regole dei club (`rules`) e consigli (`tips`) già entrano nel contesto: tenerli aggiornati migliora le risposte più di qualsiasi altra cosa.
3. **Regole** – `SYSTEM_RULES` in `worker.js` (cosa non deve mai fare). Si cambiano solo con un nuovo deploy: toccale poco.
4. **Valutazione** – `node eval.mjs <URL-worker> [APP_TOKEN]` manda le domande di `eval-questions.json` al server vero e scrive `eval-report.md` con tutte le risposte. Aggiungi lì le domande reali dei clienti, con i controlli `mustMatchAny` (deve contenere uno di) e `mustNotMatch` (non deve contenere, es. cifre in € non approvate). I controlli prendono solo errori grossolani: **leggi il report**.

### Ciclo settimanale (30 minuti)
1. Raccogli le domande reali ricevute su WhatsApp e i messaggi "Segnala questa risposta" dall'app (senza nomi, telefoni o dati personali).
2. Per quelle ripetute scrivi la risposta approvata → nuova voce in `faq`.
3. Aggiungi le 3–5 domande più delicate a `eval-questions.json`.
4. Ricarica il `content.json` e rilancia `eval.mjs`. Nessuna ripubblicazione dell'app.

KPI da guardare: % di conversazioni chiuse senza passare dal team, numero di segnalazioni a settimana (deve scendere), domande nuove ripetute ≥3 volte (diventano FAQ).

Non mettere nelle FAQ prezzi, commissioni o disponibilità che cambiano: l'assistente li ripeterebbe anche quando sono scaduti. Per quelli resta il rinvio al team su WhatsApp.
