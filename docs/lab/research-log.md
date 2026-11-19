# Diario di ricerca — Cilex App Lab

Una voce per esecuzione, la più recente in cima.

## 2026-11-19 (seconda sessione, su richiesta di Francesco) — Conversione: il modulo Richiedi

Budget usato: 1 ricerca YouTube, 0 trascrizioni, 1 pagina letta + 1 ricerca web.
YouTube: ricerca "luxury hospitality app UX design booking concierge" (ultimo anno) **senza risultati utili**: tutorial di siti fatti con l'IA, recensioni di hotel, video sotto le 20.000 visualizzazioni. Nessuna trascrizione scaricata.

1. **Baymard, "8 Recommendations for Creating Effective Input Fields"** (aggiornato 17/01/2025) — https://baymard.com/blog/input-fields
   - FATTO (linea guida #668): mostrare meno campi possibile; nascondere dietro un link i campi facoltativi usati di rado; togliere quelli irrilevanti nel contesto; usare valori predefiniti e precompilati.
   - FATTO (linea guida #568): precompilare quello che l'utente ha già scritto. Cilex lo fa già con nome e codice PR salvati. ✅
   - FATTO (linea guida #659): l'89% dei partecipanti ignora l'esempio di formato e scrive a modo suo: bisogna accettare formati diversi. Cilex lo fa già: `parseDate` accetta GG/MM/AAAA, GG-MM, GG.MM e AAAA-MM-GG. ✅
   - IPOTESI NOSTRA: il campo **Codice PR** è visibile a tutti, ma solo una parte dei clienti ha un codice. Candidato per #668 (link "Hai un codice PR?"). Il rischio è di perdere attribuzioni per le commissioni dei PR, quindi **decide Francesco**.
2. **NN/g, "10 Design Guidelines for Reporting Errors in Forms"** — https://www.nngroup.com/articles/errors-forms-design-guidelines/
   - FATTO (dall'estratto): le linee guida chiedono validazione inline e messaggi d'errore vicino al campo sbagliato, espliciti e costruttivi.
   - Situazione di Cilex: in `RequestScreen.tsx` l'errore compare solo in fondo, sopra il pulsante. Su un telefono, se manca il nome (che sta in alto), il cliente vede l'errore lontano dal campo da correggere.
3. **NN/g, "Hostile Patterns in Error Messages"** — https://www.nngroup.com/articles/hostile-error-messages/
   - FATTO (dall'estratto): non mostrare errori prima che l'utente abbia sbagliato; i campi obbligatori vanno indicati in modo esplicito (basta un asterisco).
   - Situazione di Cilex: nome e data sono obbligatori ma non hanno nessun segno; "Note" ha già "(facoltativo)".

**Proposte (nessuna implementata: Francesco vuole approvare prima ogni modifica al codice)**: vedi backlog.

## 2026-11-19 (giovedì, esecuzione straordinaria di avvio) — Conversione: richieste tavolo/barca/villa, WhatsApp

Budget usato: 1 ricerca YouTube (Firecrawl `youtube-com`), 1 trascrizione (la prima conteneva già un'idea applicabile, la seconda non è stata scaricata), 2 ricerche web.
Video scartati: tutorial "vibe coding"/AI builder (non pertinenti), video sotto 3 minuti, video con meno di 20.000 visualizzazioni.

**Video studiato**: "The UX Psychology Behind Apps People Can't Stop Using" — canale uxpeak, ~680.000 visualizzazioni — https://www.youtube.com/watch?v=2TlIg3VokY8

1. **Moduli vuoti = fatica decisionale** (0:22–1:45). FATTO (dal video): l'autore mostra una schermata di prenotazione con 5 campi vuoti e propone campi precompilati con le scelte più comuni. OPINIONE DELL'AUTORE: "70–90% degli utenti non cambia mai i valori predefiniti" e lo studio delle marmellate (Columbia) — cifre citate dall'autore, non verificate da noi. IPOTESI NOSTRA: nel modulo Richiedi il campo data è testo libero GG/MM/AAAA, il punto di attrito più alto; scegliere con un tocco tra le date vicine riduce errori ("errDate") e tempo.
2. **Effetto "goal gradient"** (1:45–3:10): mostrare che una parte è già fatta aumenta il completamento. IPOTESI NOSTRA: il nome già salvato e il codice PR precompilato vanno in questa direzione; si potrebbe mostrare un riepilogo nel pulsante.
3. **Reciprocità: dare prima di chiedere** (3:50–5:30). IPOTESI NOSTRA: per Cilex vale per l'assistente "Chiedi" e le info (valore gratuito) prima della richiesta WhatsApp; nessuna modifica proposta ora.
4. **Ancoraggio / contrasto dei prezzi** (9:35–11:00): non applicabile oggi, l'app non mostra prezzi (regola: niente prezzi inventati).

**Fonti web**
5. Nielsen Norman Group, "Date-Input Form Fields: UX Design Guidelines" — https://www.nngroup.com/articles/date-input/ . FATTO (estratto): i calendar picker sono indicati per date vicine al presente; per utenti internazionali il formato deve essere non ambiguo, con i mesi scritti per esteso ("10/11/2016" si legge in due modi). IPOTESI NOSTRA: Cilex ha clienti EN/IT/ES (e USA): le date rapide mostrano "sab 21 nov" nella lingua del telefono, eliminando l'ambiguità GG/MM vs MM/GG.
6. Baymard, "8 Recommendations for Creating Effective Input Fields" — https://baymard.com/blog/input-fields (letto solo l'estratto di ricerca, non l'articolo intero: da approfondire in una prossima esecuzione).

**Applicato a Cilex**: date rapide a un tocco (Oggi, Domani, +4 giorni) nel modulo Richiedi per tavolo/barca/concierge — PR sul ramo `lab/2026-11-19-conversione`.
Scelta consapevole: **non** precompilare la data in automatico (smart default puro) perché una richiesta inviata con una data non scelta dal cliente costa una conversazione WhatsApp in più al team.
