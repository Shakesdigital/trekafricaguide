# Sal destination — Cabo Verde destinations-rail gap (2026-11-12)

Run: scheduled editorial run, 2026-11-12 11:00 UTC. Category: destinations rotation.

## Evidence (live, 12 Nov 2026)

- https://trekafricaguide.com/countries/cabo-verde/ returned HTTP 200 and rendered **no "Destinations in" rail at all** — one of only three countries on the site without a destination guide (Ethiopia and Sierra Leone are the others, each with the same one-attraction/one-stay structure).
- The country's live cluster exists but has no anchor: /attractions/sal-island/ (HTTP 200, 32 KB — a full researched island-attraction guide that plans a Santa Maria arrival day, a north-coast outing and a Pedra de Lume salt-pan visit) and /accommodations/hilton-cabo-verde-sal-resort/ (HTTP 200, 27 KB — the island's stay guide, attraction_id 64 = sal-island).
- The homepage destination search (19 entries) listed zero Cabo Verde destinations; content/local-destinations.json had no sal/cabo-verde record.
- Reader impact: a reader on the Cabo Verde country page finished with no destination anchor even though the site carries a researched island-attraction guide and a same-island stay guide; the attraction page already does de-facto town-and-island planning with no destination card behind it.
- Duplicate check: Ethiopia and Sierra Leone are alternate candidates (same gap shape) but deferred — Ethiopia's Lalibela cluster sits under an active Smartraveller "do not travel" advisory for Amhara, and Cabo Verde/Sal is the cleanest evidenced, advisory-free gap of the three. Ethiopia/Sierra Leone remain queued for future destination runs.
- Sal chosen over other countries: 15 of 19 country pages already render destinations rails; the country with both a published attraction and stay on one compact island is the strongest single-record fix.

## Change

- content/local-destinations.json: new record `sal` (country_slug cabo-verde), category "Island", zero-image honest publish, relationships: attraction sal-island, stay hilton-cabo-verde-sal-resort, no activity/insight cards (none published for Cabo Verde).
- No booking CTA (destination pages carry no hotel-booking surrogate by design; booking texture flows through the Hilton stay guide's verified Booking.com destination).
- No rates, availability, review or weather-guarantee claims; confirm-before-you-book hedges retained.

## Sources checked 12 November 2026

- Instituto do Turismo de Cabo Verde — turismo.cv Sal page (fetched HTTP 200, 17.8 KB): name from the salt industry (18th–mid-20th c.); flat volcanic island "resembling the lunar surface"; warm tropical dry climate "365 days a year"; Sal responsible for **more than 50% of the archipelago's overnight stays**; named highlights Murdeira bay, Rabo de Junco, Buracona, Ponta Preta, Cave of Love (Gruta do Amor); international airport. https://www.turismo.cv/page/sal
- Instituto do Turismo de Cabo Verde — visit-caboverde.com Sal island page (fetched HTTP 200, 599.6 KB): 215 km²; Monte Grande 406 m (highest point); ~35,000 inhabitants; capital Espargos near Amílcar Cabral International Airport; sighted 3 December 1460; Pedra de Lume salt-pan exploitation from 1804; southern dunes with Praias de Santa Maria and Ponta Preta; Terra Boa marshland north; Santa Maria town "caressed by an 8 km stretch of pristine white sandy beach" from the pier to Ponta Preta via Ponta do Sinó; Santa Maria Beach "one of the Seven Wonders of Cabo Verde" and natural heritage; Pedra de Lume salt flats protected national landscape since 2003, natural/historical/cultural heritage since 2014, guided tours float in the saline waters; Santa Maria Beach Music Festival in September; island natural treasures list (Buracona "Olho Azul", Serra Negra, Morrinho de Açúcar, Ponta Preta Dunes, Murdeira Bay nature reserve, Rabo de Junco). https://www.visit-caboverde.com/en/islands/sal-island
- Câmara Municipal do Sal — Sal turístico (fetched HTTP 200): four population points; "the most touristy [island] in Cape Verde"; Santa Maria Beach Festival celebrated annually 15 September over two days. https://www.camaramunicipaldosal.com/sal-turistico?lang=en
- Live Trek Africa Guide pages (all HTTP 200, 12 Nov): countries/cabo-verde/ (no destinations rail), attractions/sal-island/ (Santa Maria-first plan, Blue Eye light-dependence, Pedra de Lume "not simply a novelty float", three-block first-stay plan, Nov–July dry vs Aug–Oct hotter/humid/occasionally rainy national guidance, airport-transfer confirmations), accommodations/hilton-cabo-verde-sal-resort/.
- Not verified / not claimed: admission prices, specific flight schedules, ferry timetables, water-safety guarantees, hotel details beyond the published Hilton guide. Santa Maria beach length carried as two attributed official statements (turismo.cv "about 4 km" bay; visit-caboverde "8 km stretch" pier-to-Ponta-Preta) — not reconciled to one number.

## Photos

Zero-image honest publish. Six-subject backlog for the ledger (licensed-reuse review only; no substitutes): Santa Maria beach and pier at low wind, Pedra de Lume crater salt flats from the rim, Buracona Blue Eye lava cave, Palmeira fishing-village harbour, Ponta Preta dune-and-surf view, Espargos town square/facades.
