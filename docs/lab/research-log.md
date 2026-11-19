# Diario di ricerca — Cilex App Lab

Una voce per esecuzione, la più recente in cima.

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
