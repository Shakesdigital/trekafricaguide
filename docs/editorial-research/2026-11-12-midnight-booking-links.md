# Midnight booking-link re-verification — 12 November 2026 (Kampala)

Scheduled 11 November 21:00 UTC. Fetched origin and fast-forwarded main to 039be88 without rebase/stash/reset; unrelated untracked files and deploy archive left untouched. Read registry and all three checkpoints.

63 active links checked by the designated no-argument verifier. Initial outcome: 53 passed, 10 failed exact-detail standard. 41 GYG matching t-product IDs are URL-only evidence (HTTP403); 9 Booking exact paths HTTP202, 1 Agoda exact path HTTP200; 2 further Booking server search shapes resolved to exact detail in browser (Kruger Shalati, Les Paletuviers).

Production browser clicks confirmed search listings for Casa del Papa, Maribela, Mount Nelson, Paraa, Victoria Falls Hotel, Red Chilli, Fairway, Mountains of the Moon, Jollyboys and Ol Tukai. Booking search pages contained 9–25 property cards; Expedia/Hotels.com showed multiple properties. Jollyboys retried twice; Ol Tukai first candidate was blank then retry showed multi-property Hotel-Search.

Repaired Casa del Papa, Mount Nelson and Victoria Falls Hotel using locale-free versions of their existing exact Booking URLs. Browser candidates rendered matching property titles and detail paths, zero search property cards (some navigation timeouts despite content rendering). No new property, namesake or general search source substituted. Hold the other seven, retaining original source and review evidence. Fairway locale-free, Red Chilli locale-free, Paraa pt-br alternative all still searched. Focused OTA research confirmed Red Chilli exact property and Paraa exact property variants but could not produce stable wrapped detail landings; no verified Booking replacement for Jollyboys.

Research references: https://www.booking.com/hotel/ug/red-chilli-rest-camp.en-gb.html ; https://www.booking.com/hotel/ug/paraa-safari-lodge.pt-br.html . No updated numerical reviews copied. Availability, rates, checkout and attribution unverified.

Publication: pending.

## Publication correction

71e46cc deployed ready as 6af4db6962c42a8ec096076c. Live clicks opened Casa del Papa and Mount Nelson in new browser tabs despite target modification; inspected exact names/addresses, property paths, availability, facilities and house rules in those tabs. Victoria Falls Hotel live click demoted to search; withdrew replacement and held original source. Earlier Kruger Shalati popup also showed Skukuza search, despite later exact detail; held as unstable. Corrected initial classification: **52 pass / 11 fail**. Final proposed changes: **2 repairs / 9 new holds**. Previous pass counts above are superseded. Pending correction deploy verification.

## Final publication receipt

Correction 954cdb6 deployed ready as 6af4dc3de1ea7bd1ea99a71a, published 11 November 2026 21:21:40 UTC. All eleven affected production pages HTTP200. Casa del Papa and Mount Nelson contain the repaired locale-free sources, with live click-through exact full-detail verification above. Nine held sources absent, including Victoria Falls and Kruger Shalati. Final classification: 63 checked, 52 initial passes (50 URL-only bot-wall evidence), 11 initial failures/unstable, 2 repaired, 9 new holds, 54 active links remaining. No new entries. check:build-inputs passed after final content changes; no tests or local build. Local verifier results and helper scripts remain in the agent booking-audit folder; unrelated checkout files unchanged.
