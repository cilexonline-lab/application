# Concorrenza e funzioni consigliate – studio del 24/11/2026

Documento di lavoro dell'agente di sviluppo per Francesco (Alex). **Nessun codice**: sono proposte da approvare.
Legenda: **FATTO** = verificato su una fonte (link) · **STIMA** = valutazione dell'agente · **DA VERIFICARE** = serve un controllo sul campo.

## 1. Chi c'è sul mercato

### Concierge di lusso globali (riferimento di qualità)
| Nome | Modello | Cosa imparare | Fonte |
|---|---|---|---|
| **Velocity Black** (Capital One) | App con chat 24/7 con esperti, su invito; 4,9★ su 571 recensioni App Store, classificazione 18+ | Questionario iniziale su preferenze (allergie, hotel, gusti) e app che "impara"; le recensioni lodano soprattutto "hanno tutte le mie preferenze salvate" | apps.apple.com/us/app/velocity-black/id1460676182 · townandcountrymag.com (recensione) |
| **Quintessentially** | Abbonamento, lifestyle manager dedicato, da ~5.000 £/anno (indicativo) | Il cliente segue lo stato delle richieste; standard = "conferme pulite, responsabile chiaro" | thediscernedfew.com (confronto 2026) · robertwilkos1.wordpress.com |
| **Stirling Access** | Concierge "solo WhatsApp", 39 £/mese | Il loro slogan è "nessuna app": la nostra app deve dare ciò che una chat non dà (memoria, piano, mappa, eventi) | stirlingaccess.com/compare/velocity-black |

### Concorrenti diretti a Ibiza
| Nome | Cosa offre | Punto debole / spazio per Cilex | Fonte |
|---|---|---|---|
| **The Concierge** | App iPhone: ricerca IA per voli, hotel, auto, jet; "marketplace" di concierge indipendenti che fanno offerte per ville, barche, tavoli VIP | Marketplace = tanti fornitori, nessun rapporto diretto con i club. Cilex = un solo team + collaborazione con i club | luxurytravelmagazine.com (5/11/2026) · the-concierge.app |
| **Ibiza VIP Move** | Sito + WhatsApp 24/7; tavoli, barche, ville | Molto chiari sulle condizioni ("spesa minima, deposito e condizioni confermati per iscritto prima") e processo in 5 passi: da imitare in trasparenza | ibizavipmove.com/vip-tables-club-access-ibiza |
| **Kennedy's Group, Taste Ibiza, VIP Prime Ibiza** | Concierge tradizionali con sito e social | Nessuna app con eventi, mappa e piano (STIMA, da ricerca web) | kennedysgroup.com · tasteibiza.com · trustpilot.com |

### Dati utili dal settore
- **Ibiza Luxury Villas** con la concierge digitale di HolidayHero dichiara **95% di domande con risposta immediata** e **50% di vendite aggiuntive prima dell'arrivo** (chef privato, transfer, barca, massaggi, tavolo al beach club). Dato del fornitore, non verificato in modo indipendente. Fonte: holidayhero.com (caso cliente, ago. 2026).
- Video "Guest Loyalty for Short-Term Rentals" (Enso Connect, YouTube, lug. 2026): *recognition over rewards*, cioè riconoscere il cliente conta più dei punti fedeltà; parlare col cliente da quando prenota fino a dopo il soggiorno; metriche: clienti che tornano, spesa aggiuntiva, valore nel tempo.
- Assistenza con IA (guide 2026 di Fin, Decagon, EverHelp, video di Caleb King): passaggio a un umano **senza far ripetere** il cliente e uscita verso un umano sempre visibile. Già fatto nella tab Chiedi (24/11).

## 2. Dove può vincere Cilex (STIMA)
1. **Accesso ai club + un solo team**: nessun concorrente diretto unisce collaborazione con i club, un'app con eventi e mappa e un team unico su WhatsApp.
2. **Trasparenza**: condizioni chiare prima, conferma solo dal team. È già il tono dell'app ("Come funziona" in 3 passi).
3. **Memoria del cliente**: è il vero motivo per cui chi è ricco usa un concierge (Velocity Black).

## 3. Le 5 funzioni consigliate
| # | Funzione | Cosa fa | Impatto | Sforzo | Note |
|---|---|---|---|---|---|
| 1 | **Prepara il tuo arrivo** | Dal Piano (date del viaggio), da 7 giorni prima: lista "transfer · barca · tavolo per la serata clou · chef in villa", ogni voce a un tocco dalla richiesta; promemoria a 7 e a 3 giorni dall'arrivo (notifiche locali già presenti) | **Alto**: il caso Ibiza Villas indica vendite aggiuntive prima dell'arrivo | Medio (2–3 giorni) | Solo servizi che Cilex offre davvero |
| 2 | **Le tue preferenze** | Profilo salvato solo sul telefono (lingua, persone, allergie, musica, occasione) aggiunto in automatico a ogni messaggio WhatsApp | **Alto**: risposte su misura, meno domande | Basso (1 giorno) | Nessun dato su server né nel repository |
| 3 | **Prenota con Cilex ovunque** | Su ogni club, luogo ed evento un'azione che apre WhatsApp con nome, data, persone e ID della richiesta | **Alto**: più punti da cui partono le richieste | Basso | Piano notte, compito 1 (in corso) |
| 4 | **Le mie richieste** | Elenco delle richieste inviate (ID, data, servizio) con "riapri la chat"; lo stato "confermata" solo quando ci sarà un server | Medio: fiducia, meno richieste doppie | Basso | |
| 5 | **Dopo il viaggio** | Il giorno dopo la partenza: "Com'è andata?", recensione vera, "il prossimo viaggio" | Medio: recensioni vere e clienti che tornano | **Fatto** (24/11, sezione recensioni) | Manca `REVIEW_URL` (Google) |

## 4. Cosa NON fare adesso
- **Marketplace o ricerca voli/hotel** come The Concierge: è un'altra partita, costosa, e diluisce il marchio.
- **Abbonamento a pagamento**: prima servono clienti che tornano e contenuti completi.
- **Recensioni finte**: vietate (direttiva UE Omnibus; Apple 5.6.3). Solo recensioni vere con consenso.
- **Nuove sezioni senza contenuti veri**: un "torna presto" fa più danno che niente.

## 5. Ordine consigliato
1. Accendere l'IA (3 chiavi, `backend/ai-worker/ACCENDI-IA.md`) e compilare le FAQ del team.
2. Prenota con Cilex ovunque (3) → Le tue preferenze (2) → Prepara il tuo arrivo (1).
3. Le mie richieste (4).
4. Kit App Store: completare i bloccanti (`cilex/store/README.md`).

**KPI da misurare** (dal foglio richieste con gli ID CX-…): richieste per settimana e da quale schermata partono; % di richieste confermate; clienti che tornano.
