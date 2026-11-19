# Diario di ricerca — Cilex App Lab

Una voce per esecuzione, la più recente in cima.

## 2026-11-19 (studio straordinario autorizzato da Francesco) — Concorrenti e benchmark

Letto davvero: 1 ricerca web + 3 pagine (InList su App Store, pagina app di Tickets Ibiza, pagina app di The Ibiza Social Club). Studiare, non copiare.

1. **InList** (concierge nightlife/VIP, include Ibiza) — https://apps.apple.com/us/app/inlist/id694967200 — FATTO (pagina letta il 19/11/2026): 4,4★ su 19 valutazioni; richieste "subject to availability and confirmation" gestite dal team concierge. Elogi: "easy to navigate", "Attractive, Innovative and Clean". Lamentela: "Can't even sign up - constant error messages".
   IPOTESI NOSTRA: Cilex non chiede registrazione ed è un vantaggio da mantenere (niente login).
2. **Tickets Ibiza app** — https://ticketsibiza.com/app/ — FATTO: si presenta come "Ibiza 2027 Trip Planner": calendario completo, "Build your whole trip" (anche ristoranti e transfer), "Share your unique trip link and vote on plans", "Smart reminders", "Browse without an account"; dichiara 4,8 su App Store (dato del sito, non verificato su App Store).
   IPOTESI NOSTRA: il loro punto forte è il viaggio di gruppo condiviso. Il Piano di Cilex si condivide solo come testo (`Share.share` in `PlanScreen.tsx`).
3. **The Ibiza Social Club app** — https://www.theibizasocialclub.com/the-app — FATTO: modulo per noleggio barca privata con promessa esplicita "a member of our team will get back to you within 24 hours"; biglietti "in just two clicks"; "My Itinerary". Offre anche guestlist (Cilex no, per scelta).
   IPOTESI NOSTRA: una **promessa di tempo di risposta** accanto al pulsante WhatsApp riduce l'incertezza. Serve il tempo reale garantito da Francesco: non va inventato.

## 2026-11-19 (studio straordinario) — Retention e crescita

Letto davvero: 1 ricerca web + 2 pagine (NN/g, Apple HIG).

1. **NN/g, "Five Mistakes in Designing Mobile Push Notifications"** — https://www.nngroup.com/articles/push-notification/ — FATTO: chiedere il permesso dopo che l'utente ha visto il valore, dire cosa conterranno le notifiche, niente raffiche, preferenze modificabili nell'app.
   Situazione di Cilex: il permesso è chiesto solo dopo un tocco su Promemoria (`askPermission` in `notify.ts`) ✅. I promemoria sono locali (concerti seguiti, piano), quindi pertinenti ✅.
2. **Apple HIG, "Ratings and reviews"** — https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews — FATTO: chiedere la valutazione solo dopo un uso dimostrato, mai al primo avvio, mai durante un compito; il sistema la mostra al massimo 3 volte in 365 giorni.
   Situazione di Cilex: nessuna richiesta di recensione. IPOTESI NOSTRA: il momento giusto è dopo il rientro nell'app dalla prima richiesta WhatsApp. Ha senso solo dopo l'uscita su App Store.
3. Fonte commerciale, non indipendente: Airship dichiara che le notifiche "possono aumentare la retention del 190%" — https://www.airship.com/blog/7-mobile-engagement-statistics-that-show-how-push-notifications-boost-roi/ . OPINIONE DI UN VENDITORE: non usarla come prova.

## 2026-11-19 (studio straordinario) — Design visivo premium

Letto davvero: 2 ricerche web + 2 pagine Apple HIG. YouTube via ricerca web (`site:youtube.com luxury app UI design dark theme premium`): **solo video di personalizzazione di telefoni Android/iPhone, nessuno pertinente**; niente trascrizioni.

1. **Apple HIG, Dark Mode** — https://developer.apple.com/design/human-interface-guidelines/dark-mode — FATTO: contrasto minimo 4,5:1, "strive for 7:1, especially in small text"; superfici "base" più scure e "elevated" più chiare per dare profondità; scurire le immagini con fondo bianco.
   Misurato su `src/theme.ts` (calcolo WCAG): testo principale 18,9:1 ✅; azzurro brand 12,1:1 ✅; testo `muted` #8A98A0 6,8:1 su sfondo e 5,9:1 su `cardAlt` (sopra 4,5, sotto 7 per il testo piccolo); rosso errore 7,3:1 ✅. Le superfici bg/card/cardAlt già seguono base/elevated ✅.
2. **Apple HIG, Typography** — https://developer.apple.com/design/human-interface-guidelines/typography — FATTO: su iOS testo predefinito 17 pt, **minimo 11 pt**; evitare pesi Light/Thin; supportare Dynamic Type.
   Situazione di Cilex: un solo testo sotto il minimo, i crediti della mappa (`Map3DScreen.tsx`, 10 pt, bianco al 45%). È l'attribuzione © OpenStreetMap, che deve restare leggibile.
3. **Revisione visiva dell'app** (screenshot 390×844, 19/11/2026), IPOTESI NOSTRE:
   - **Esplora**: 6 club su 7 mostrano "0 in arrivo". Fuori stagione l'app sembra vuota: è il problema di percezione più grande oggi.
   - **Home**: nessuna fotografia. Testo e icone soltanto, mentre il lusso si vende con le immagini; servono foto con permesso (barche, ville, staff Cilex).
   - **Home**: due file di filtri (tempo + club) sopra 2 soli eventi: con pochi eventi i filtri sono rumore.
   - **Piano**: date di arrivo e partenza da scrivere GG/MM/AAAA (stesso problema risolto nel modulo Richiedi).
   - **Barra in basso con 6 schede**: Apple raccomanda poche schede (DA VERIFICARE il limite esatto nell'HIG "Tab bars"). "Chiedi" mostra un'IA ancora non attiva (`AI_ENDPOINT` vuoto).

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
