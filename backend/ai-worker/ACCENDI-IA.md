# Accendere l'IA di Cilex (10 minuti, una volta sola)

Tutto il codice è pronto. Servono solo 3 chiavi, che può creare solo il titolare degli account.
Le chiavi **non vanno mai** scritte nel codice né mandate in chat: si incollano solo nei campi indicati qui sotto.

## 1. Anthropic: chiave API + tetto di spesa (5 min)
1. Accedi alla console Anthropic (platform.claude.com) con l'account aziendale e aggiungi un metodo di pagamento.
2. **Imposta subito un limite di spesa mensile** (es. 20–50 €) nelle impostazioni dei limiti. È la protezione principale contro gli abusi.
3. Crea una chiave API chiamata `cilex-app`. Copiala: si vede una volta sola.

## 2. Cloudflare: account gratuito + token (3 min)
1. Crea un account gratuito su cloudflare.com.
2. Apri **Workers & Pages** una volta (Cloudflare ti fa scegliere il sottodominio `*.workers.dev`, es. `cilex`).
3. Copia l'**Account ID** (è nella pagina Workers & Pages, colonna a destra).
4. Profilo → **API Tokens** → Create Token → modello **"Edit Cloudflare Workers"** → crea e copia il token.

## 3. GitHub: incolla le 3 chiavi (2 min)
Repository `cilexonline-lab/application` → **Settings → Secrets and variables → Actions → New repository secret**:

| Nome | Valore |
|---|---|
| `ANTHROPIC_API_KEY` | la chiave del punto 1 |
| `CLOUDFLARE_API_TOKEN` | il token del punto 2.4 |
| `CLOUDFLARE_ACCOUNT_ID` | l'Account ID del punto 2.3 |

## 4. Pubblica
**Actions → "Pubblica IA" → Run workflow.** In 1–2 minuti il server è online.
Nel log del passo "Pubblica su Cloudflare" compare l'indirizzo, tipo `https://cilex-ai.<tuo-sottodominio>.workers.dev`.
**Mandalo all'agente di sviluppo**: lo inserisce nell'app (`AI_ENDPOINT`) e fa la valutazione con le domande vere (`eval.mjs`) prima di pubblicare.

## Cosa sa l'assistente
- I club, gli eventi e i consigli dell'app (file `content.json` pubblicato sul sito a ogni `npm run build:pages`).
- Le risposte di base su come funziona l'app (`faq-app.json`).
- **Le risposte del team** in `cilex/content/faq-team.json`: pagamenti, acconti, cancellazioni, orari del team, lingue… Sono vuote finché il team non le compila, e una risposta vuota non arriva all'IA. Più sono complete, meno clienti passano dal team per domande semplici.

## Cosa NON fa (di proposito)
Non conferma prenotazioni, non dà prezzi o disponibilità che non sono nei dati ufficiali, non parla di guestlist. Per tutto questo, e per reclami, pagamenti o se il cliente chiede una persona, passa al team su WhatsApp con le sue domande già scritte nel messaggio.

## Costi (stima da verificare nella console dopo i primi giorni)
Modello attuale `claude-haiku-5-5`: circa 10 centesimi di dollaro ogni 100 domande (stima: ~4.000 token in entrata e ~800 in uscita per domanda). Per un modello più capace basta cambiare `MODEL` in `wrangler.toml` (es. `claude-opus-5-5`, che costa circa 40 volte di più): la scelta è del titolare.
Limite per dispositivo e per IP: si attiva creando un KV `RL` (vedi `README.md`). Fino ad allora la protezione è il tetto di spesa del punto 1.2.
