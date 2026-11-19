# Backlog Cilex App Lab

Ordinato per punteggio ICE (Impact × Confidence × Ease, 1–10 ciascuno → somma su 30).
Aggiornato dall'agente a ogni esecuzione.

| ICE | Idea | Tema | Note / fonte |
|---|---|---|---|
| 22 | Nome facoltativo nel modulo Richiedi (WhatsApp identifica già il cliente) — **serve decisione di Francesco** | Conversione | I8 C6 E8. Baymard #668 (meno campi) https://baymard.com/blog/input-fields ; video uxpeak 0:22. Rischio: il team non vede il nome nel messaggio |
| 21 | Errore mostrato sotto il campo sbagliato (nome, data, check-out) invece che solo in fondo | Conversione | I6 C8 E7. NN/g https://www.nngroup.com/articles/errors-forms-design-guidelines/ |
| 20 | Asterisco sui campi obbligatori (nome, data) | Conversione | I4 C7 E9. NN/g https://www.nngroup.com/articles/hostile-error-messages/ |
| 19 | Codice PR dietro un link "Hai un codice PR?" (aperto da solo se il codice è già salvato o arriva da un link) — **serve decisione di Francesco** | Conversione | I5 C6 E8. Baymard #668. Rischio: meno attribuzioni ai PR |
| 19 | Pulsante con riepilogo: "Invia su WhatsApp · Tavolo, ven 20 nov, 2 persone" | Conversione | I6 C5 E8. Video uxpeak 1:45 (goal gradient), ipotesi nostra |
| 18 | Precompilare la data della richiesta dal periodo di viaggio salvato in Piano (arrivo) | Conversione | I6 C6 E6. Baymard #568 |
| 16 | Date rapide anche per check-in/check-out di ville e appartamenti (intervallo) | Conversione | I5 C5 E6. NN/g https://www.nngroup.com/articles/date-input/ |

Fatto: date rapide a un tocco nel modulo Richiedi (ICE 23, I8 C7 E8) — PR `lab/2026-11-19-conversione`.

## In attesa di dati da Francesco (non implementabili dall'agente)
- Logo SWAG.
- Endpoint assistente IA (Cloudflare Worker).
- Date eventi 2027 (annunci gennaio–marzo).
- PRIVACY_URL e SUPPORT_URL per l'App Store.
- KPI: l'app non ha analytics. Per misurare le richieste, contare su WhatsApp i messaggi che iniziano con "Cilex App · CX-" (settimana prima/dopo il merge).
