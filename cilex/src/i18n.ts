import { useMemo, useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Dict = Record<string, string>;

const en: Dict = {
  itinTitle: 'Itineraries', itinSub: 'Ready-made routes made of places in the app', itinStops: 'stops', roleBeach: 'Beach', roleLunch: 'Lunch', roleSunset: 'Sunset', roleDinner: 'Dinner', roleNight: 'Night', roleAfternoon: 'Afternoon', itinAsk: 'Plan this with Cilex', itinAskMsg: 'Hi Cilex! I would like to plan this itinerary:',
  cqTitle: 'Write to your concierge', cqSub: 'Tell us what you need, in your own words. WhatsApp opens with your message ready: just tap Send.', cqPlaceholder: 'Write your message…', cqSend: 'Send on WhatsApp', cqReply: 'A person from the team replies, 24 hours a day', cqTable: 'I would like a VIP table for…', cqBoat: 'I would like to rent a boat for…', cqVilla: 'I am looking for a villa for…', cqTransfer: 'I need a transfer from/to…', cqTonight: 'What do you recommend for tonight?', cqKind: 'Message', cqLang: 'App language', homeAsk: 'Write to your concierge…',
  reqListTitle: 'Your requests', reqListNote: 'Saved only on this phone. The team confirms every request on WhatsApp.', reqListClear: 'Clear list',
  prefsTitle: 'Your preferences', prefsNote: 'Saved only on this phone. We add them to your requests so the team can tailor the answer. Optional.', prefsDiet: 'Allergies / food needs', prefsMusic: 'Music you like', prefsOccasion: 'Occasion (birthday, honeymoon…)', prefsSave: 'Save preferences', prefsSaved: 'Saved', prefsMsg: 'Preferences',
  tabAsk: 'Ask', askTitle: 'Ask about Ibiza', askSub: 'Beaches, getting around, nightlife, what to wear… ask anything.',
  askPlaceholder: 'Ask anything about Ibiza', askThinking: 'Thinking…', askError: 'Could not get an answer. Please try again.',
  askLimit: 'You reached today’s question limit. Our team can help on WhatsApp.',
  askConsentTitle: 'Before you start', askConsentBody: 'Your questions are sent to an AI service to generate answers. Please do not share personal or sensitive data. Answers may contain mistakes: for prices, opening hours and availability, always check with our team.',
  askAccept: 'I understand, continue', askSoon: 'The Ibiza assistant is coming soon.', askTeam: 'Talk to the team', askReport: 'Report this answer',
  askDisclaimer: 'AI answers can be wrong. Confirm prices, hours and availability with the team.',
  askSubLocal: 'Tell me what you need: I will take you straight to the right section or to the team.', askLocalFound: 'Here is where to find it in the app:', askLocalNone: 'The Cilex team will answer this one directly on WhatsApp.', suggTable: 'I want a VIP table', suggBoat: 'I would like a boat', suggVilla: 'Looking for a villa', suggEvents: 'Events this weekend', actTable: 'Request a VIP table', actBoat: 'Request a boat', actConcierge: 'Concierge request', actVilla: 'See the villas', actApartment: 'See the apartments', actOpen: 'Open', actBeach: 'Beaches and beach clubs', actFood: 'Restaurants', actDay: 'Things to do by day', actClubs: 'Clubs and events', actMap: 'Open the map', actPlan: 'Your plan', actTeam: 'Write to the team',
  askTeamShort: 'Team', askHandoff: 'Hi Cilex! I am writing from the app. My questions:',
  reqStep1: 'Choose the service and the date', reqStep2: 'WhatsApp opens with the message ready: tap Send', reqStep3: 'The Cilex team replies with availability and conditions', reqSentTitle: 'Request ready on WhatsApp', reqSentBody: 'Remember to tap Send in WhatsApp: only then does the team receive it.', reqReopen: 'Reopen WhatsApp',
  placesAskBody: 'In the meantime, ask the Cilex team for a tip: they reply on WhatsApp.', placesAskBtn: 'Ask for a tip', placesAskMsg: 'Hi Cilex! I would like a tip for:',
 
  reviewsTitle: 'What our guests say', reviewsLeave: 'Leave a review', reviewWaMsg: 'Hi Cilex! I would like to leave a review:', src_google: 'Google', src_trustpilot: 'Trustpilot', src_tripadvisor: 'Tripadvisor', src_whatsapp: 'WhatsApp', src_email: 'Email', src_app: 'Cilex app', tripDoneTitle: 'How was Ibiza?', tripDoneBody: 'Thank you for choosing Cilex. Your opinion helps other guests and helps us improve.', tripDoneTeam: 'Your next trip',
  bookTableCilex: 'Book a table with Cilex', bookWithCilex: 'Book with Cilex', askCilex: 'Ask Cilex', noteBook: 'Booking', noteInfo: 'Information about',
  sugg1: 'Best beaches for sunset?', sugg2: 'How do I get around Ibiza at night?', sugg3: 'What should I wear to a club?', sugg4: 'What can I do during the day?',
  allClubs: 'All clubs', hello: 'Hola', tonight: 'Tonight', weekend: 'Weekend', week: 'This week', tonightTitle: 'Happening tonight',
  yourArtists: 'Your artists', follow: 'Follow', following: 'Following ✓', followHint: 'Follow artists to see their shows on your Home.',
  arrival: 'Arrival', departure: 'Departure', tripIn: 'Ibiza in {n} days', tripTomorrow: 'Ibiza is tomorrow', tripToday: 'You are in Ibiza · day {n}',
  clash: 'More than one plan this night', sharePlan: 'Share my plan', yourTrip: 'Your trip', saveTrip: 'Save dates', errTrip: 'Check your dates (arrival before departure, not in the past).',
  prCode: 'PR code (optional)', topics: 'What do you need?',
  topicTransfer: 'Airport transfer', topicVilla: 'Villa / stay', topicChef: 'Private chef', topicPhoto: 'Photographer', topicOther: 'Something else',
  goodToKnow: 'Good to know', tips: 'Tips',
  noPlanNight: 'Nothing planned', sharePlanMsg: 'My Ibiza plan',
  tabHome: 'Home', tabClubs: 'Explore', tabPlan: 'Plan', tabRequest: 'Request', tabMap: 'Map', tabInfo: 'Info',
  heroTitle: 'Live Ibiza. We take care of the rest.',
  heroSub: 'VIP tables, boats and concierge, confirmed by our team on WhatsApp.',
  quick: 'Quick requests', all: 'All',
  upcoming: 'Upcoming events', noEvents: 'No events yet. Check back soon.', noEventsFilter: 'No upcoming events for this club.',
  news: 'News', clubsTitle: 'Clubs', eventsCount: 'upcoming', eventCount1: '1 event', eventsN: '{n} events', datesComing: 'Dates coming', back: 'Back', datesSoon: 'New dates coming soon', nextLabel: 'Next', allAreas: 'All areas',
  tickets: 'Buy tickets', ticketsSoon: 'Tickets coming soon', openMaps: 'Open in Maps', share: 'Share',
  table: 'VIP table', boat: 'Boat', concierge: 'Concierge',
  club: 'Club', date: 'Date', dateHint: 'DD/MM/YYYY', dateToday: 'Today', dateTomorrow: 'Tomorrow', dateOther: 'or type another date', people: 'People', name: 'Your name', nameOptional: 'Your name (optional)', notes: 'Notes (optional)',
  anyClub: 'Any / not sure', send: 'Send on WhatsApp', reqTitle: 'Make a request',
  reqSubtitle: 'Our team confirms every request on WhatsApp.',
  errName: 'Please enter your name.', errDate: 'Enter a valid future date (e.g. 14/07/2027).', errPeople: 'Choose how many people.', errCheckField: 'Check the highlighted field above.', replyPromise: 'We reply on WhatsApp within 15 minutes.',
  waMissing: 'WhatsApp number not configured yet.', staysTitle: 'Villas & apartments', staysSub: 'Stays selected and managed by our team. Availability and prices are confirmed by us on WhatsApp.', staysSoon: 'We are preparing our selection of villas and apartments. Tell us what you need and we will find it.', bedrooms: 'Bedrooms', bathrooms: 'Bathrooms', guestsMax: 'Guests', minNightsL: 'Minimum nights', amenitiesL: 'Highlights', priceOnRequest: 'Price on request', requestStay: 'Request this stay', moreInfo: 'More information', staysCtaTitle: "Can't find what you need?", staysCtaBody: 'Tell us dates, guests and budget: we search for the right villa or apartment for you.', staysCtaBtn: 'Tell us what you need', waStayMsg: "Hi Cilex! I'm interested in:", allStays: 'All', areaL: 'Area', apartment: 'Apartments', villa: 'Villas', checkIn: 'Check-in', checkOut: 'Check-out (optional)', errCheckOut: 'Check-out must be after check-in.', waFabMsg: "Hi Cilex! I'd like some help with my Ibiza stay.", waFabLabel: 'Chat on WhatsApp', demoTag: 'DEMO', updated: 'Updated',
  lineup: 'Line-up', eventsOf: 'Upcoming events', artist: 'Artist',
  addPlan: 'Add to my plan', inPlan: 'In my plan ✓', planTitle: 'My trip plan',
  planEmpty: 'Nothing planned yet. Open an event and add it to your plan.', browse: 'Browse events',
  outfit: 'Outfit', outfitHint: 'What are you wearing?', remove: 'Remove from plan',
  infoTitle: 'About', infoText: 'Cilex Ibiza Luxury Concierge: tables, boats and personal concierge on the island.',
  contact: 'Contact us on WhatsApp', privacy: 'Privacy policy', support: 'Support', shareMsg: 'Check this out on Cilex',
  tabExplore: 'Explore', exploreTitle: 'Explore Ibiza', segClubs: 'Clubs', segBeach: 'Beach', segEat: 'Eat', segDay: 'Day', segMap: 'Map',
  kClub: 'Club', kBeachclub: 'Beach club', kBeach: 'Beach', kRestaurant: 'Restaurant', kDay: 'Daytime', kSunset: 'Sunset', segSunset: 'Sunset', seaAll: 'All', seaBeaches: 'Beaches', seaClubs: 'Beach clubs', curatedTitle: 'Cilex Selection', curatedSub: 'Places picked by the Cilex team: a curated selection, not a ranking.',
  placesSoon: 'We are preparing our picks. Check back soon.', bookViaCilex: 'Request via Cilex', openLink: 'Website / menu', openMaps2: 'Open in Maps',
  map3dTitle: 'Ibiza map', map3dSub: 'Clubs, beaches, restaurants – all on one illustrated map', segMap3d: 'Map', mapDrag: 'Drag to move · pinch to zoom', mapIllus: 'Cilex illustration', mapTilt: 'Tilt', mapSat: 'Satellite', mapStd: 'Standard', mapWebNote: 'Schematic map. The interactive map with Apple Maps is in the iPhone app.', mapDetails: 'Details', mapTap: 'Tap a point to see the place.', mapNoPos: 'Not on the map yet:', mapEmpty: 'No places with a map position yet.',
  remindersTitle: 'Reminders', remindersBody: 'Get a reminder at noon on the day of events with artists you follow and events in your plan.',
  remindersEnable: 'Turn on reminders', remindersOn: 'Reminders on', remindersOff: 'Turn off', remindersDenied: 'Notifications are off for Cilex. Enable them in iPhone Settings.',
  remindersWeb: 'Reminders work in the iPhone app.', remindersNote: 'Reminders are set on this phone. New events are picked up when you open the app.',
  remTitleArtist: '{artist} plays today', remBodyArtist: '{title} · {club}', remTitlePlan: 'Today in your plan', remBodyPlan: '{title} · {club}',
};
const it: Dict = {
  itinTitle: 'Itinerari', itinSub: 'Percorsi pronti fatti di luoghi dell’app', itinStops: 'tappe', roleBeach: 'Spiaggia', roleLunch: 'Pranzo', roleSunset: 'Tramonto', roleDinner: 'Cena', roleNight: 'Notte', roleAfternoon: 'Pomeriggio', itinAsk: 'Organizzalo con Cilex', itinAskMsg: 'Ciao Cilex! Vorrei organizzare questo itinerario:',
  cqTitle: 'Scrivi al tuo concierge', cqSub: 'Dicci cosa ti serve, con parole tue. Si apre WhatsApp con il messaggio già pronto: tocca Invia.', cqPlaceholder: 'Scrivi il tuo messaggio…', cqSend: 'Invia su WhatsApp', cqReply: 'Risponde una persona del team, 24 ore su 24', cqTable: 'Vorrei un tavolo VIP per…', cqBoat: 'Vorrei noleggiare una barca per…', cqVilla: 'Cerco una villa per…', cqTransfer: 'Mi serve un transfer da/per…', cqTonight: 'Cosa mi consigliate per stasera?', cqKind: 'Messaggio', cqLang: 'Lingua dell’app', homeAsk: 'Scrivi al tuo concierge…',
  reqListTitle: 'Le tue richieste', reqListNote: 'Salvate solo su questo telefono. Il team conferma ogni richiesta su WhatsApp.', reqListClear: 'Svuota elenco',
  prefsTitle: 'Le tue preferenze', prefsNote: 'Salvate solo su questo telefono. Le aggiungiamo alle tue richieste così il team risponde su misura. Facoltative.', prefsDiet: 'Allergie / esigenze alimentari', prefsMusic: 'Musica che ti piace', prefsOccasion: 'Occasione (compleanno, viaggio di nozze…)', prefsSave: 'Salva preferenze', prefsSaved: 'Salvate', prefsMsg: 'Preferenze',
  tabAsk: 'Chiedi', askTitle: 'Chiedi su Ibiza', askSub: 'Spiagge, spostamenti, vita notturna, cosa mettere… chiedi pure.',
  askPlaceholder: 'Chiedi qualsiasi cosa su Ibiza', askThinking: 'Sto pensando…', askError: 'Non sono riuscito a rispondere. Riprova.',
  askLimit: 'Hai raggiunto il limite di domande di oggi. Il nostro team può aiutarti su WhatsApp.',
  askConsentTitle: 'Prima di iniziare', askConsentBody: 'Le tue domande vengono inviate a un servizio di IA per generare le risposte. Non condividere dati personali o sensibili. Le risposte possono contenere errori: per prezzi, orari e disponibilità chiedi sempre al nostro team.',
  askAccept: 'Ho capito, continua', askSoon: 'L’assistente su Ibiza arriva presto.', askTeam: 'Parla col team', askReport: 'Segnala questa risposta',
  askDisclaimer: 'Le risposte dell’IA possono essere sbagliate. Conferma prezzi, orari e disponibilità col team.',
  askSubLocal: 'Dimmi cosa ti serve: ti porto subito alla sezione giusta o dal team.', askLocalFound: 'Ecco dove trovarlo nell’app:', askLocalNone: 'Per questa domanda ti risponde direttamente il team Cilex su WhatsApp.', suggTable: 'Voglio un tavolo VIP', suggBoat: 'Vorrei una barca', suggVilla: 'Cerco una villa', suggEvents: 'Eventi di questo weekend', actTable: 'Richiedi tavolo VIP', actBoat: 'Richiedi una barca', actConcierge: 'Richiesta concierge', actVilla: 'Vedi le ville', actApartment: 'Vedi gli appartamenti', actOpen: 'Apri', actBeach: 'Spiagge e beach club', actFood: 'Ristoranti', actDay: 'Cosa fare di giorno', actClubs: 'Club ed eventi', actMap: 'Apri la mappa', actPlan: 'Il tuo piano', actTeam: 'Scrivi al team',
  askTeamShort: 'Team', askHandoff: 'Ciao Cilex! Vi scrivo dall’app. Le mie domande:',
  reqStep1: 'Scegli il servizio e la data', reqStep2: 'Si apre WhatsApp con il messaggio pronto: premi Invia', reqStep3: 'Il team Cilex ti risponde con disponibilità e condizioni', reqSentTitle: 'Richiesta pronta su WhatsApp', reqSentBody: 'Ricordati di premere Invia in WhatsApp: solo così il team la riceve.', reqReopen: 'Riapri WhatsApp',
  placesAskBody: 'Intanto chiedi un consiglio al team Cilex: ti risponde su WhatsApp.', placesAskBtn: 'Chiedi un consiglio', placesAskMsg: 'Ciao Cilex! Vorrei un consiglio per:',
 
  reviewsTitle: 'Dicono di noi', reviewsLeave: 'Lascia una recensione', reviewWaMsg: 'Ciao Cilex! Vorrei lasciare una recensione:', src_google: 'Google', src_trustpilot: 'Trustpilot', src_tripadvisor: 'Tripadvisor', src_whatsapp: 'WhatsApp', src_email: 'Email', src_app: 'App Cilex', tripDoneTitle: 'Com’è andata a Ibiza?', tripDoneBody: 'Grazie per aver scelto Cilex. La tua opinione aiuta altri ospiti e ci aiuta a migliorare.', tripDoneTeam: 'Il prossimo viaggio',
  bookTableCilex: 'Prenota un tavolo con Cilex', bookWithCilex: 'Prenota con Cilex', askCilex: 'Chiedi a Cilex', noteBook: 'Prenotazione', noteInfo: 'Informazioni su',
  sugg1: 'Le migliori spiagge per il tramonto?', sugg2: 'Come mi sposto a Ibiza di notte?', sugg3: 'Come mi vesto per un club?', sugg4: 'Cosa posso fare di giorno?',
  allClubs: 'Tutti i club', hello: 'Hola', tonight: 'Stasera', weekend: 'Weekend', week: 'Questa settimana', tonightTitle: 'Stasera a Ibiza',
  yourArtists: 'I tuoi artisti', follow: 'Segui', following: 'Segui già ✓', followHint: 'Segui gli artisti per vedere i loro show nella Home.',
  arrival: 'Arrivo', departure: 'Partenza', tripIn: 'Ibiza tra {n} giorni', tripTomorrow: 'Ibiza è domani', tripToday: 'Sei a Ibiza · giorno {n}',
  clash: 'Più di un programma questa sera', sharePlan: 'Condividi il piano', yourTrip: 'Il tuo viaggio', saveTrip: 'Salva date', errTrip: 'Controlla le date (arrivo prima della partenza, non nel passato).',
  prCode: 'Codice PR (facoltativo)', topics: 'Di cosa hai bisogno?',
  topicTransfer: 'Transfer aeroporto', topicVilla: 'Villa / alloggio', topicChef: 'Chef privato', topicPhoto: 'Fotografo', topicOther: 'Altro',
  goodToKnow: 'Da sapere', tips: 'Consigli',
  noPlanNight: 'Niente in programma', sharePlanMsg: 'Il mio piano a Ibiza',
  tabHome: 'Home', tabClubs: 'Esplora', tabPlan: 'Piano', tabRequest: 'Richiedi', tabMap: 'Mappa', tabInfo: 'Info',
  heroTitle: 'Vivi Ibiza. Al resto ci pensiamo noi.',
  heroSub: 'Tavoli VIP, barche e concierge, confermati dal nostro team su WhatsApp.',
  quick: 'Richieste rapide', all: 'Tutti',
  upcoming: 'Prossimi eventi', noEvents: 'Nessun evento per ora. Torna presto.', noEventsFilter: 'Nessun evento in arrivo per questo club.',
  news: 'News', clubsTitle: 'Club', eventsCount: 'in arrivo', eventCount1: '1 evento', eventsN: '{n} eventi', datesComing: 'Date in arrivo', back: 'Indietro', datesSoon: 'Nuove date in arrivo', nextLabel: 'Prossimo', allAreas: 'Tutte le zone',
  tickets: 'Acquista biglietti', ticketsSoon: 'Biglietti in arrivo', openMaps: 'Apri su Mappe', share: 'Condividi',
  table: 'Tavolo VIP', boat: 'Barca', concierge: 'Concierge',
  club: 'Club', date: 'Data', dateHint: 'GG/MM/AAAA', dateToday: 'Oggi', dateTomorrow: 'Domani', dateOther: 'oppure scrivi un’altra data', people: 'Persone', name: 'Il tuo nome', nameOptional: 'Il tuo nome (facoltativo)', notes: 'Note (facoltativo)',
  anyClub: 'Qualsiasi / non so', send: 'Invia su WhatsApp', reqTitle: 'Fai una richiesta',
  reqSubtitle: 'Il nostro team conferma ogni richiesta su WhatsApp.',
  errName: 'Inserisci il tuo nome.', errDate: 'Inserisci una data futura valida (es. 14/07/2027).', errPeople: 'Scegli quante persone.', errCheckField: 'Controlla il campo evidenziato qui sopra.', replyPromise: 'Ti rispondiamo su WhatsApp entro 15 minuti.',
  waMissing: 'Numero WhatsApp non ancora configurato.', staysTitle: 'Ville e appartamenti', staysSub: 'Soggiorni selezionati e gestiti dal nostro team. Disponibilità e prezzi te li confermiamo noi su WhatsApp.', staysSoon: 'Stiamo preparando la nostra selezione di ville e appartamenti. Dicci cosa cerchi e lo troviamo noi.', bedrooms: 'Camere', bathrooms: 'Bagni', guestsMax: 'Ospiti', minNightsL: 'Notti minime', amenitiesL: 'Punti di forza', priceOnRequest: 'Prezzo su richiesta', requestStay: 'Richiedi questo soggiorno', moreInfo: 'Maggiori informazioni', staysCtaTitle: 'Non trovi quello che cerchi?', staysCtaBody: 'Dicci date, ospiti e budget: cerchiamo noi la villa o l’appartamento giusto per te.', staysCtaBtn: 'Dicci cosa cerchi', waStayMsg: 'Ciao Cilex! Sono interessato a:', allStays: 'Tutti', areaL: 'Zona', apartment: 'Appartamenti', villa: 'Ville', checkIn: 'Check-in', checkOut: 'Check-out (facoltativo)', errCheckOut: 'Il check-out deve essere dopo il check-in.', waFabMsg: 'Ciao Cilex! Vorrei un aiuto per il mio soggiorno a Ibiza.', waFabLabel: 'Scrivici su WhatsApp', demoTag: 'DEMO', updated: 'Aggiornato',
  lineup: 'Line-up', eventsOf: 'Prossimi eventi', artist: 'Artista',
  addPlan: 'Aggiungi al mio piano', inPlan: 'Nel mio piano ✓', planTitle: 'Il mio piano viaggio',
  planEmpty: 'Ancora niente in programma. Apri un evento e aggiungilo al piano.', browse: 'Sfoglia eventi',
  outfit: 'Outfit', outfitHint: 'Cosa ti metti?', remove: 'Rimuovi dal piano',
  infoTitle: 'Chi siamo', infoText: 'Cilex Ibiza Luxury Concierge: tavoli, barche e concierge personale sull’isola.',
  contact: 'Scrivici su WhatsApp', privacy: 'Privacy policy', support: 'Supporto', shareMsg: 'Guarda su Cilex',
  tabExplore: 'Esplora', exploreTitle: 'Esplora Ibiza', segClubs: 'Club', segBeach: 'Mare', segEat: 'Cibo', segDay: 'Giorno', segMap: 'Mappa',
  kClub: 'Club', kBeachclub: 'Beach club', kBeach: 'Spiaggia', kRestaurant: 'Ristorante', kDay: 'Di giorno', kSunset: 'Tramonto', segSunset: 'Tramonto', seaAll: 'Tutto', seaBeaches: 'Spiagge', seaClubs: 'Beach club', curatedTitle: 'Selezione Cilex', curatedSub: 'Luoghi scelti dal team Cilex: una selezione curata, non una classifica.',
  placesSoon: 'Stiamo preparando i nostri consigli. Torna presto.', bookViaCilex: 'Richiedi via Cilex', openLink: 'Sito / menù', openMaps2: 'Apri in Mappe',
  map3dTitle: 'Mappa di Ibiza', map3dSub: 'Club, spiagge, ristoranti – tutto sulla mappa illustrata', segMap3d: 'Mappa', mapDrag: 'Trascina per muovere · pizzica per zoomare', mapIllus: 'Illustrazione Cilex', mapTilt: 'Inclina', mapSat: 'Satellite', mapStd: 'Standard', mapWebNote: 'Mappa schematica. La mappa interattiva con Apple Maps è nell’app per iPhone.', mapDetails: 'Dettagli', mapTap: 'Tocca un punto per vedere il luogo.', mapNoPos: 'Non ancora sulla mappa:', mapEmpty: 'Ancora nessun luogo con posizione sulla mappa.',
  remindersTitle: 'Promemoria', remindersBody: 'Ricevi un promemoria a mezzogiorno nei giorni degli eventi con gli artisti che segui e degli eventi nel tuo piano.',
  remindersEnable: 'Attiva i promemoria', remindersOn: 'Promemoria attivi', remindersOff: 'Disattiva', remindersDenied: 'Le notifiche sono disattivate per Cilex. Attivale dalle Impostazioni di iPhone.',
  remindersWeb: 'I promemoria funzionano nell’app per iPhone.', remindersNote: 'I promemoria sono impostati su questo telefono. I nuovi eventi vengono recepiti quando apri l’app.',
  remTitleArtist: '{artist} suona oggi', remBodyArtist: '{title} · {club}', remTitlePlan: 'Oggi nel tuo piano', remBodyPlan: '{title} · {club}',
};
const es: Dict = {
  itinTitle: 'Itinerarios', itinSub: 'Rutas listas con lugares de la app', itinStops: 'paradas', roleBeach: 'Playa', roleLunch: 'Comida', roleSunset: 'Atardecer', roleDinner: 'Cena', roleNight: 'Noche', roleAfternoon: 'Tarde', itinAsk: 'Organízalo con Cilex', itinAskMsg: '¡Hola Cilex! Quiero organizar este itinerario:',
  cqTitle: 'Escribe a tu concierge', cqSub: 'Cuéntanos lo que necesitas, con tus palabras. Se abre WhatsApp con el mensaje listo: toca Enviar.', cqPlaceholder: 'Escribe tu mensaje…', cqSend: 'Enviar por WhatsApp', cqReply: 'Te responde una persona del equipo, las 24 horas', cqTable: 'Quiero una mesa VIP para…', cqBoat: 'Quiero alquilar un barco para…', cqVilla: 'Busco una villa para…', cqTransfer: 'Necesito un transfer desde/hacia…', cqTonight: '¿Qué me recomendáis para esta noche?', cqKind: 'Mensaje', cqLang: 'Idioma de la app', homeAsk: 'Escribe a tu concierge…',
  reqListTitle: 'Tus solicitudes', reqListNote: 'Se guardan solo en este teléfono. El equipo confirma cada solicitud por WhatsApp.', reqListClear: 'Vaciar lista',
  prefsTitle: 'Tus preferencias', prefsNote: 'Se guardan solo en este teléfono. Las añadimos a tus solicitudes para que el equipo responda a medida. Opcional.', prefsDiet: 'Alergias / necesidades alimentarias', prefsMusic: 'Música que te gusta', prefsOccasion: 'Ocasión (cumpleaños, luna de miel…)', prefsSave: 'Guardar preferencias', prefsSaved: 'Guardadas', prefsMsg: 'Preferencias',
  tabAsk: 'Pregunta', askTitle: 'Pregunta sobre Ibiza', askSub: 'Playas, transporte, vida nocturna, qué ponerse… pregunta lo que quieras.',
  askPlaceholder: 'Pregunta lo que quieras sobre Ibiza', askThinking: 'Pensando…', askError: 'No pude responder. Inténtalo de nuevo.',
  askLimit: 'Has alcanzado el límite de preguntas de hoy. Nuestro equipo te ayuda por WhatsApp.',
  askConsentTitle: 'Antes de empezar', askConsentBody: 'Tus preguntas se envían a un servicio de IA para generar las respuestas. No compartas datos personales o sensibles. Las respuestas pueden contener errores: para precios, horarios y disponibilidad consulta siempre con nuestro equipo.',
  askAccept: 'Entendido, continuar', askSoon: 'El asistente de Ibiza llegará pronto.', askTeam: 'Hablar con el equipo', askReport: 'Reportar esta respuesta',
  askDisclaimer: 'Las respuestas de la IA pueden ser incorrectas. Confirma precios, horarios y disponibilidad con el equipo.',
  askSubLocal: 'Dime qué necesitas: te llevo directo a la sección correcta o al equipo.', askLocalFound: 'Aquí lo encuentras en la app:', askLocalNone: 'Esta pregunta te la responde directamente el equipo Cilex por WhatsApp.', suggTable: 'Quiero una mesa VIP', suggBoat: 'Quiero un barco', suggVilla: 'Busco una villa', suggEvents: 'Eventos este fin de semana', actTable: 'Pedir mesa VIP', actBoat: 'Pedir un barco', actConcierge: 'Solicitud concierge', actVilla: 'Ver las villas', actApartment: 'Ver los apartamentos', actOpen: 'Abrir', actBeach: 'Playas y beach clubs', actFood: 'Restaurantes', actDay: 'Qué hacer de día', actClubs: 'Clubs y eventos', actMap: 'Abrir el mapa', actPlan: 'Tu plan', actTeam: 'Escribir al equipo',
  askTeamShort: 'Equipo', askHandoff: '¡Hola Cilex! Os escribo desde la app. Mis preguntas:',
  reqStep1: 'Elige el servicio y la fecha', reqStep2: 'Se abre WhatsApp con el mensaje listo: pulsa Enviar', reqStep3: 'El equipo Cilex te responde con disponibilidad y condiciones', reqSentTitle: 'Solicitud lista en WhatsApp', reqSentBody: 'Recuerda pulsar Enviar en WhatsApp: solo así el equipo la recibe.', reqReopen: 'Volver a abrir WhatsApp',
  placesAskBody: 'Mientras tanto, pide un consejo al equipo Cilex: te responde por WhatsApp.', placesAskBtn: 'Pedir un consejo', placesAskMsg: '¡Hola Cilex! Quería un consejo para:',
 
  reviewsTitle: 'Lo que dicen de nosotros', reviewsLeave: 'Dejar una reseña', reviewWaMsg: '¡Hola Cilex! Quería dejar una reseña:', src_google: 'Google', src_trustpilot: 'Trustpilot', src_tripadvisor: 'Tripadvisor', src_whatsapp: 'WhatsApp', src_email: 'Email', src_app: 'App Cilex', tripDoneTitle: '¿Qué tal Ibiza?', tripDoneBody: 'Gracias por elegir Cilex. Tu opinión ayuda a otros huéspedes y nos ayuda a mejorar.', tripDoneTeam: 'Tu próximo viaje',
  bookTableCilex: 'Reserva mesa con Cilex', bookWithCilex: 'Reserva con Cilex', askCilex: 'Pregunta a Cilex', noteBook: 'Reserva', noteInfo: 'Información sobre',
  sugg1: '¿Mejores playas para el atardecer?', sugg2: '¿Cómo me muevo por Ibiza de noche?', sugg3: '¿Qué me pongo para un club?', sugg4: '¿Qué puedo hacer de día?',
  allClubs: 'Todos los clubs', hello: 'Hola', tonight: 'Esta noche', weekend: 'Fin de semana', week: 'Esta semana', tonightTitle: 'Esta noche en Ibiza',
  yourArtists: 'Tus artistas', follow: 'Seguir', following: 'Siguiendo ✓', followHint: 'Sigue a artistas para ver sus shows en tu Inicio.',
  arrival: 'Llegada', departure: 'Salida', tripIn: 'Ibiza en {n} días', tripTomorrow: 'Ibiza es mañana', tripToday: 'Estás en Ibiza · día {n}',
  clash: 'Más de un plan esta noche', sharePlan: 'Compartir mi plan', yourTrip: 'Tu viaje', saveTrip: 'Guardar fechas', errTrip: 'Revisa las fechas (llegada antes de salida, no en el pasado).',
  prCode: 'Código PR (opcional)', topics: '¿Qué necesitas?',
  topicTransfer: 'Traslado aeropuerto', topicVilla: 'Villa / alojamiento', topicChef: 'Chef privado', topicPhoto: 'Fotógrafo', topicOther: 'Otra cosa',
  goodToKnow: 'Conviene saber', tips: 'Consejos',
  noPlanNight: 'Sin planes', sharePlanMsg: 'Mi plan en Ibiza',
  tabHome: 'Inicio', tabClubs: 'Explorar', tabPlan: 'Plan', tabRequest: 'Solicitar', tabMap: 'Mapa', tabInfo: 'Info',
  heroTitle: 'Vive Ibiza. Del resto nos encargamos nosotros.',
  heroSub: 'Mesas VIP, barcos y concierge, confirmados por nuestro equipo en WhatsApp.',
  quick: 'Solicitudes rápidas', all: 'Todos',
  upcoming: 'Próximos eventos', noEvents: 'Aún no hay eventos. Vuelve pronto.', noEventsFilter: 'No hay próximos eventos para este club.',
  news: 'Noticias', clubsTitle: 'Clubs', eventsCount: 'próximos', eventCount1: '1 evento', eventsN: '{n} eventos', datesComing: 'Fechas en camino', back: 'Atrás', datesSoon: 'Nuevas fechas muy pronto', nextLabel: 'Próximo', allAreas: 'Todas las zonas',
  tickets: 'Comprar entradas', ticketsSoon: 'Entradas próximamente', openMaps: 'Abrir en Mapas', share: 'Compartir',
  table: 'Mesa VIP', boat: 'Barco', concierge: 'Concierge',
  club: 'Club', date: 'Fecha', dateHint: 'DD/MM/AAAA', dateToday: 'Hoy', dateTomorrow: 'Mañana', dateOther: 'o escribe otra fecha', people: 'Personas', name: 'Tu nombre', nameOptional: 'Tu nombre (opcional)', notes: 'Notas (opcional)',
  anyClub: 'Cualquiera / no sé', send: 'Enviar por WhatsApp', reqTitle: 'Haz una solicitud',
  reqSubtitle: 'Nuestro equipo confirma cada solicitud por WhatsApp.',
  errName: 'Introduce tu nombre.', errDate: 'Introduce una fecha futura válida (ej. 14/07/2027).', errPeople: 'Elige cuántas personas.', errCheckField: 'Revisa el campo marcado arriba.', replyPromise: 'Te respondemos por WhatsApp en 15 minutos.',
  waMissing: 'Número de WhatsApp aún sin configurar.', staysTitle: 'Villas y apartamentos', staysSub: 'Estancias seleccionadas y gestionadas por nuestro equipo. Disponibilidad y precios te los confirmamos por WhatsApp.', staysSoon: 'Estamos preparando nuestra selección de villas y apartamentos. Dinos qué buscas y lo encontramos.', bedrooms: 'Habitaciones', bathrooms: 'Baños', guestsMax: 'Huéspedes', minNightsL: 'Noches mínimas', amenitiesL: 'Destacados', priceOnRequest: 'Precio bajo petición', requestStay: 'Solicitar esta estancia', moreInfo: 'Más información', staysCtaTitle: '¿No encuentras lo que buscas?', staysCtaBody: 'Dinos fechas, huéspedes y presupuesto: buscamos la villa o el apartamento ideal para ti.', staysCtaBtn: 'Dinos qué buscas', waStayMsg: '¡Hola Cilex! Me interesa:', allStays: 'Todos', areaL: 'Zona', apartment: 'Apartamentos', villa: 'Villas', checkIn: 'Check-in', checkOut: 'Check-out (opcional)', errCheckOut: 'El check-out debe ser posterior al check-in.', waFabMsg: '¡Hola Cilex! Me gustaría ayuda con mi estancia en Ibiza.', waFabLabel: 'Escríbenos por WhatsApp', demoTag: 'DEMO', updated: 'Actualizado',
  lineup: 'Line-up', eventsOf: 'Próximos eventos', artist: 'Artista',
  addPlan: 'Añadir a mi plan', inPlan: 'En mi plan ✓', planTitle: 'Mi plan de viaje',
  planEmpty: 'Aún no hay nada planeado. Abre un evento y añádelo a tu plan.', browse: 'Ver eventos',
  outfit: 'Outfit', outfitHint: '¿Qué te pones?', remove: 'Quitar del plan',
  infoTitle: 'Sobre nosotros', infoText: 'Cilex Ibiza Luxury Concierge: mesas, barcos y concierge personal en la isla.',
  contact: 'Escríbenos por WhatsApp', privacy: 'Política de privacidad', support: 'Soporte', shareMsg: 'Mira esto en Cilex',
  tabExplore: 'Explorar', exploreTitle: 'Explora Ibiza', segClubs: 'Clubs', segBeach: 'Playa', segEat: 'Comer', segDay: 'De día', segMap: 'Mapa',
  kClub: 'Club', kBeachclub: 'Beach club', kBeach: 'Playa', kRestaurant: 'Restaurante', kDay: 'De día', kSunset: 'Atardecer', segSunset: 'Atardecer', seaAll: 'Todo', seaBeaches: 'Playas', seaClubs: 'Beach clubs', curatedTitle: 'Selección Cilex', curatedSub: 'Lugares elegidos por el equipo de Cilex: una selección cuidada, no un ranking.',
  placesSoon: 'Estamos preparando nuestras recomendaciones. Vuelve pronto.', bookViaCilex: 'Solicitar con Cilex', openLink: 'Web / menú', openMaps2: 'Abrir en Mapas',
  map3dTitle: 'Mapa de Ibiza', map3dSub: 'Clubs, playas, restaurantes – todo en el mapa ilustrado', segMap3d: 'Mapa', mapDrag: 'Arrastra para mover · pellizca para hacer zoom', mapIllus: 'Ilustración Cilex', mapTilt: 'Inclinar', mapSat: 'Satélite', mapStd: 'Estándar', mapWebNote: 'Mapa esquemático. El mapa interactivo con Apple Maps está en la app para iPhone.', mapDetails: 'Detalles', mapTap: 'Toca un punto para ver el lugar.', mapNoPos: 'Aún no están en el mapa:', mapEmpty: 'Aún no hay lugares con posición en el mapa.',
  remindersTitle: 'Recordatorios', remindersBody: 'Recibe un recordatorio al mediodía el día de los eventos con artistas que sigues y de los eventos de tu plan.',
  remindersEnable: 'Activar recordatorios', remindersOn: 'Recordatorios activados', remindersOff: 'Desactivar', remindersDenied: 'Las notificaciones están desactivadas para Cilex. Actívalas en Ajustes del iPhone.',
  remindersWeb: 'Los recordatorios funcionan en la app para iPhone.', remindersNote: 'Los recordatorios se programan en este teléfono. Los eventos nuevos se detectan al abrir la app.',
  remTitleArtist: '{artist} toca hoy', remBodyArtist: '{title} · {club}', remTitlePlan: 'Hoy en tu plan', remBodyPlan: '{title} · {club}',
};

const dicts: Record<string, Dict> = { en, it, es };

// Lingua: scelta dall'utente (salvata) > ?lang= nell'URL (web) > lingua del telefono > inglese.
export type Lang = 'en' | 'it' | 'es';
export const LANGS: Lang[] = ['it', 'en', 'es'];
const LANG_KEY = 'cilex.lang';
const isLang = (x: unknown): x is Lang => x === 'en' || x === 'it' || x === 'es';

function initialLang(): Lang {
  try {
    const q = typeof window !== 'undefined' && window.location ? new URLSearchParams(window.location.search).get('lang') : null;
    if (isLang(q)) return q;
  } catch {}
  const dev = (Intl.DateTimeFormat().resolvedOptions().locale || 'en').slice(0, 2).toLowerCase();
  return isLang(dev) ? dev : 'en';
}

let current: Lang = initialLang();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

AsyncStorage.getItem(LANG_KEY)
  .then((v) => { if (isLang(v) && v !== current) { current = v; emit(); } })
  .catch(() => {});

export const getLang = (): Lang => current;

export function setLang(l: Lang) {
  current = l;
  AsyncStorage.setItem(LANG_KEY, l).catch(() => {});
  emit();
}

export function useLang(): Lang {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => current, () => current);
}

export function useT() {
  const lang = useLang();
  return useMemo(() => {
    const d = dicts[lang] ?? en;
    return (k: string) => d[k] ?? en[k] ?? k;
  }, [lang]);
}
