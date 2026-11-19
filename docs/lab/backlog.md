# Backlog Cilex App Lab

Ordinato per punteggio ICE (Impact × Confidence × Ease, 1–10 ciascuno → somma su 30).
Aggiornato dall'agente a ogni esecuzione.

**Top 3 consigliate (19/11/2026)**
1. Esplora: togliere "0 in arrivo" dai club senza eventi (ICE 24): l'app smette di sembrare vuota fuori stagione.
2. Promessa del tempo di risposta accanto a "Invia su WhatsApp" (ICE 22): **serve il tempo reale da Francesco**.
3. Fotografie vere nella Home (ICE 20): **servono foto con permesso da Francesco**; impatto più alto sul "lusso percepito".

| ICE | Idea | Tema | Note / fonte |
|---|---|---|---|
| 24 | Esplora: nascondere "0 in arrivo" sui club senza eventi | Design | I7 C8 E9. Screenshot 19/11. Rischio basso |
| 22 | "Ti rispondiamo su WhatsApp entro X" sotto il pulsante Invia — **X da Francesco** | Conversione | I7 C6 E9. Benchmark The Ibiza Social Club ("within 24 hours") |
| 22 | Crediti della mappa leggibili: 11 pt e contrasto più alto (attribuzione OSM) | Design | I3 C9 E10. Apple HIG Typography (minimo 11 pt) |
| 20 | Fotografie reali (barche, ville, team) in Home e nelle schede — **servono foto con permesso** | Design | I9 C7 E4 |
| 20 | Home: nascondere i filtri quando ci sono meno di 5 eventi | Design | I5 C7 E8 |
| 20 | Barra con 5 schede: togliere o spostare "Chiedi" finché l'IA non è attiva — **decisione di Francesco** | Design | I6 C6 E8. HIG Tab bars (limite da verificare) |
| 19 | Pulsante con riepilogo: "Invia su WhatsApp · Tavolo, ven 20 nov, 2 persone" | Conversione | I6 C5 E8 |
| 19 | Codice PR dietro un link — **non scelto da Francesco il 19/11, fermo** | Conversione | Rischio attribuzioni PR |
| 18 | Piano: date di arrivo/partenza più facili (scelta mese + giorno, niente GG/MM/AAAA) | Retention | I6 C6 E6. NN/g date input |
| 18 | Precompilare la data della richiesta dal periodo di viaggio salvato in Piano | Conversione | I6 C6 E6. Baymard #568 |
| 17 | Richiesta recensione App Store dopo il ritorno dalla prima richiesta WhatsApp (dopo l'uscita su App Store) | Retention | I5 C7 E5. Apple HIG Ratings |
| 16 | Piano condiviso con link per il gruppo di amici | Crescita | I7 C5 E4. Benchmark Tickets Ibiza ("Shared Trips") |
| 16 | Date rapide per check-in/check-out di ville e appartamenti | Conversione | I5 C5 E6 |

Fatto il 19/11/2026: date rapide (PR #1), errori sotto il campo, asterisco, nome facoltativo (PR #2), anteprima web (PR #3).

## In attesa di dati da Francesco (non implementabili dall'agente)
- Logo SWAG.
- Endpoint assistente IA (Cloudflare Worker).
- Date eventi 2027 (annunci gennaio–marzo).
- PRIVACY_URL e SUPPORT_URL per l'App Store.
- KPI: l'app non ha analytics. Per misurare le richieste, contare su WhatsApp i messaggi che iniziano con "Cilex App · CX-" (settimana prima/dopo il merge).
