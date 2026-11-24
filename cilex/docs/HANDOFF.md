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
