> 24/11/2026: Atzaró Beach e Brula tolti dalla Selezione Cilex (non sono partner), su decisione di Alex.

# Verifica dei 40 luoghi – Selezione Cilex

Ricontrollo del 24/11/2026 sui dati in `src/data/places.ts`.

**Metodo**
- **Coordinate:** prese dall'elemento OpenStreetMap che porta il nome del luogo (Nominatim, © OpenStreetMap contributors, ODbL). Per i casi dubbi ho fatto anche la ricerca inversa: il punto deve cadere su quell'elemento e non su una strada vicina.
- **Attività nel 2026:** confermata sul sito ufficiale, sui social ufficiali o su guide locali che citano la stagione 2026. Per i luoghi naturali non serve.
- **Limite:** nessuna verifica di persona. Le posizioni di OSM possono scostarsi di qualche decina di metri.

**Stato:** `ok` = confermato · `corretto` = dato modificato in questa verifica · `da verificare sul posto` = manca qualcosa, vedi la nota.

Ogni elemento OSM si apre su `https://www.openstreetmap.org/<tipo>/<id>` (es. `https://www.openstreetmap.org/way/170709931`).

## Spiagge (luoghi naturali)

| Luogo | Zona | Stato | Elemento OSM |
|---|---|---|---|
| Cala Comte | Sant Josep | ok | way/170709931 (natural=beach) |
| Cala Salada | Sant Antoni | ok | way/143217546 |
| Cala d'Hort | Sant Josep | ok | way/172420703 |
| Ses Salines | Sant Josep | ok | way/95068828 |
| Es Cavallet | Ses Salines | ok | way/47233379 |
| Cala Bassa | Sant Josep | ok | way/119398204 |
| Aigües Blanques | Santa Eulària | ok | way/92443897 (su OSM si chiama "Agua Blanca") |
| Cala Xarraca | Sant Joan | ok | way/173533487 |
| Cala d'en Serra | Sant Joan | ok | way/62263455 |
| Cala Tarida | Sant Josep | ok | way/119396811 |

## Beach club

| Luogo | Zona | Stato | Elemento OSM | Fonte stagione 2026 |
|---|---|---|---|---|
| Nikki Beach Ibiza | S'Argamassa | ok | node/3930092780 | ibiza-spotlight.com/event/nikki-beach-opening |
| Blue Marlin Ibiza | Cala Jondal | ok | node/14376960928 | bluemarlinibiza.com (opening weekend 25/04/2026) |
| Tropicana Ibiza | Cala Jondal | ok | node/14376993059 | ibiza-spotlight.com (apertura 27/03/2026) |
| Beachouse Ibiza | Playa d'en Bossa | ok | way/213884764 | beachouseibiza.com/summerclosing2026 |
| Nassau Beach Club | Playa d'en Bossa | ok | way/213801532 | Instagram ufficiale @nassaubeachclub |
| Cala Bassa Beach Club | Cala Bassa | ok | way/242648824 | welcometoibiza.com |
| Experimental Beach | Cap des Falcó | ok | way/333029705 ("Experimental Beach - Cap des Falcó") | white-ibiza.com (ultimo giorno 18/10/2026) |
| Beso Beach Ibiza | Ses Salines | ok | node/9004679517 | besobeach.com (Sailing Fest 05/2026) |
| Cotton Beach Club | Cala Tarida | ok | way/172420711 (su OSM "Cotton Club") | Instagram ufficiale @cottonbeachclub |

## Ristoranti

| Luogo | Zona | Stato | Elemento OSM | Fonte stagione 2026 |
|---|---|---|---|---|
| Casa Jondal | Cala Jondal | ok | node/9211779317 | forbes.es (Best Chiringuito 2026) |
| Es Torrent | Porroig | ok · senza sito ufficiale | node/6635835086 (ricerca inversa: ok) | oneofakindtravel.com/en/blog/es-torrent |
| Es Xarcu | Porroig | ok | node/6582679585 | Instagram ufficiale @esxarcu |
| La Paloma | Sant Llorenç | **corretto** (fonte 2026 trovata) | node/4177089791 (ricerca inversa: ok) | white-ibiza.com/ibiza-calendar/reopening-of-la-paloma (riapertura 12/03/2026) |
| Sa Capella | Sant Antoni | ok | way/321335339 | sacapellaibiza.com (ultima cena 17/10/2026) |
| Es Boldado | Cala d'Hort | ok | node/2201362030 | Instagram ufficiale (09/2026) |
| Amante Ibiza | Sol d'en Serra | ok | node/1844684323 | white-ibiza.com (riapertura 17/04/2026) |
| Sa Punta | Talamanca | ok | node/443609622 | magicalibiza.com (stagione dal 21/04/2026) |
| El Chiringuito | Es Cavallet | ok | node/1065356312 | elchiringuitoibiza.com |

## Tramonto

| Luogo | Zona | Stato | Elemento OSM | Fonte stagione 2026 |
|---|---|---|---|---|
| Café del Mar | Sant Antoni | ok | node/5856208286 | cafedelmar.com (02/04–24/10/2026) |
| Café Mambo | Sant Antoni | ok | node/1418767338 | cafemamboibiza.com (eclissi 12/08/2026) |
| Cala Benirràs | Sant Joan | ok | way/92434594 (natural=beach) | luogo naturale |
| Torre des Savinar | Cala d'Hort | ok | way/507790845 (man_made=tower) | luogo naturale/storico |
| Sunset Cala Conta (ex Sunset Ashram) | Cala Comte | ok | way/311929115 (su OSM ancora "Sunset Ashram"; ricerca inversa: ok) | sunsetcalaconta.com (apertura 02/04/2026) |
| Hostal La Torre | Cap Negret | **corretto** (fonte 2026 trovata) | node/3213664727 | ibiza-spotlight.com (Halloween 31/10/2026) |
| Kumharas | Cala de Bou | **corretto** (zona: era "Sant Antoni") | node/5075923724 (ricerca inversa: ok) | ibiza-spotlight.com (sunset sessions 2026) |
| Sa Talaia | Sant Josep | ok | node/1249786706 (natural=peak) | luogo naturale |
| Punta de sa Galera | Sant Antoni | ok | node/12031435912 (natural=cape) | luogo naturale |
| Cala Gració | Sant Antoni | ok | way/31443465 (su OSM "Cala Grassio") | luogo naturale |

## Da verificare sul posto

3. **Pin vicini:** Café del Mar e Café Mambo (circa 40 m), i tre locali di Cala Jondal, Cala Bassa e il suo beach club. Le posizioni sono corrette ma si sovrappongono finché non si ingrandisce la mappa.
4. **Tutti i locali:** una conferma veloce sul posto della posizione del pin (OSM può sbagliare di qualche decina di metri).
