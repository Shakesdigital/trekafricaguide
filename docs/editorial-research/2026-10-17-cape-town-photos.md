# Cape Town local destination photo collection — 17 October 2026

## Status

Six distinct, location-specific photographs were added to the published Cape Town local destination guide. Existing Table Mountain detail photography was not reused. Every source page was checked on 17 October 2026; each photograph is published under CC BY-SA 4.0. Attribution, license, capture date, image SHA-256 and descriptive alt text are stored in `src/lib/photo-library.js`; the public photo-credit page includes photographer, license and capture date. The guide uses its existing gallery and hero image fields. Photos were visually inspected after download at 1280 pixels wide.

| Scene | Creator | Captured | Source and license | Site file |
| --- | --- | --- | --- | --- |
| City Bowl and harbor from Table Mountain | Matti Blume | 17 July 2018 | [Commons file page](https://commons.wikimedia.org/wiki/File:City_Bowl,_Cape_Town_(P1050341).jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `/images/editorial/cape-town/city-bowl-from-table-mountain.jpg` |
| Camps Bay beach and Twelve Apostles | Time00 | 27 November 2016 | [Commons file page](https://commons.wikimedia.org/wiki/File:Camps_Bay,_Cape_Town.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `/images/editorial/cape-town/camps-bay-beach.jpg` |
| Colorful Bo-Kaap houses | Matti Blume | 23 July 2018 | [Commons file page](https://commons.wikimedia.org/wiki/File:Bo-Kaap,_Cape_Town_(P1050993).jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `/images/editorial/cape-town/bo-kaap-houses.jpg` |
| Working boats at the V&A Waterfront harbor | Dietmar Rabich | 29 February 2024 | [Commons file page](https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Waterfront,_Hafen,_Schiffe_--_2024_--_2879.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `/images/editorial/cape-town/va-waterfront-harbor.jpg` |
| Rocky Sea Point shoreline | Dietmar Rabich | 2 March 2024 | [Commons file page](https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Sea_Point_Promenade_--_2024_--_3586.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `/images/editorial/cape-town/sea-point-coast.jpg` |
| Formal beds and trees in Company's Garden | Dietmar Rabich | 2 March 2024 | [Commons file page](https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Company's_Garden_--_2024_--_3457.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | `/images/editorial/cape-town/companys-garden.jpg` |

The Camps Bay frame includes beach visitors; Commons identifies the scene as Camps Bay and documents its reuse license. It is ordinary travel context and does not imply endorsement. The harbor photograph shows working harbor boats, not a hotel or cruise service. All image files are stored locally; no external image hotlinks are used.

## Push, live check and report

Photo commit `6b9f944` was included in combined pushed main commit `4f76457`. The guide URL returned HTTP 200 with its expected title, but its HTML still contained none of the six new image paths. Each new image URL returned 404 on two checks, including a second check after about one minute. The homepage returned HTTP 200 with zero Google tag loader matches. Netlify project/deployment status lookup failed because both connected accounts require reauthentication. The site deployment is therefore pending; the photographs and GA change are not confirmed live.

Owner email sent to `fsddanmugisa@gmail.com`; Gmail SENT ID `1a146e93732e7847`. The report includes the confirmed guide URL, six sources and licenses, the live gap, the next insight candidate, and a request for input. No tests, build, or browser QA run, per standing instructions.

At the next 04:30 Kampala run, resume by confirming the Cape Town gallery and homepage GA loader are both live before rotating categories. Then proceed to travel insights: a guide to choosing a Cape Town base by outing pattern (City Bowl, Sea Point, Atlantic seaboard), distinct from the existing “Cape Town Before or After Safari?” article. This next insight is only selected; no work on it has begun.

## Publication confirmed — 04:33 Kampala

Cape Town live HTML includes all six gallery paths and Matti Blume, Time00, Dietmar Rabich and CC BY-SA 4.0 credits. All six image URLs return HTTP 200 image/jpeg; three transient TLS failures succeeded on retry. Homepage, Cape Town and Victoria Falls Hotel each contain exactly one GA loader immediately after head. Analytics account event receipt was not checked. Prior deployment gap resolved without new content changes. Confirmation email SENT ID: 1a14780582259d3e. Rotate next to the selected travel insight; no tests/builds run.
