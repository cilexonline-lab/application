# Backlog Cilex App Lab

Ordinato per punteggio ICE (Impact × Confidence × Ease, 1–10 ciascuno → somma su 30).
Aggiornato dall'agente a ogni esecuzione.

| ICE | Idea | Tema | Note / fonte |
|---|---|---|---|
| 22 | Nome facoltativo nel modulo Richiedi (WhatsApp identifica già il cliente) — **serve decisione di Francesco** | Conversione | I8 C6 E8. Video uxpeak 0:22 (meno campi = meno abbandoni). Rischio: il team perde il nome nel messaggio |
| 19 | Pulsante con riepilogo: "Invia su WhatsApp · Tavolo, ven 20 nov, 2 persone" | Conversione | I6 C5 E8. Video uxpeak 1:45 (goal gradient) — ipotesi nostra |
| 18 | Errore mostrato accanto al campo sbagliato (oggi solo in fondo) + scroll al campo | Conversione | I5 C6 E7. Da verificare su Baymard https://baymard.com/blog/input-fields |
| 18 | Precompilare la data della richiesta dal periodo di viaggio salvato in Piano (arrivo) | Conversione | I6 C6 E6 |
| 16 | Date rapide anche per check-in/check-out di ville e appartamenti (intervallo) | Conversione | I5 C5 E6. NN/g: picker utili per gli intervalli https://www.nngroup.com/articles/date-input/ |

Fatto: date rapide a un tocco nel modulo Richiedi (ICE 23, I8 C7 E8) — PR `lab/2026-11-19-conversione`.

## In attesa di dati da Francesco (non implementabili dall'agente)
- Logo SWAG.
- Endpoint assistente IA (Cloudflare Worker).
- Date eventi 2027 (annunci gennaio–marzo).
- PRIVACY_URL e SUPPORT_URL per l'App Store.
- KPI: l'app non ha analytics. Per misurare le richieste, contare su WhatsApp i messaggi che iniziano con "Cilex App · CX-" (settimana prima/dopo il merge).
