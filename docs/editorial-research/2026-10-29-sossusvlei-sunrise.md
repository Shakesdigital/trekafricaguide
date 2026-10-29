# Sossusvlei at first light — 29 October 2026

## Selection and scope

Selected as a practical Travel Insight that deepens the existing Sossusvlei planning gap after the rotation reached travel insights. The article is a Sesriem-based planning guide, not a claim of firsthand experience. It addresses the key lodging/access decision, a realistic two-night sequence, final-section transport uncertainty and a tailored desert packing list. Related canonical pages are the existing Sahara Dunes attraction and Desert Quiver Camp accommodation. No new canonical place, booking CTA, fee or travel-duration claim was added.

## Research and editorial decisions

Checked official Ministry of Environment, Forestry and Tourism material on the Namib-Naukluft Park and park permits; Namibia Wildlife Resorts information for Sesriem Camp and Sossus Dune Lodge; the Ministry’s 13 December 2025 concession clarification; and the concession operator’s current media statement page. The access information has changed and the official clarification, operator materials and later trade reporting do not resolve every traveler’s precise vehicle/transfer case. The guide therefore avoids stating a universal shuttle mandate or promising private 4x4 access. It tells readers to confirm the current rule, transfer availability, pickup, fees and booking method with the park/authorized operator before travel.

The suggested pacing is editorial judgment: arrival and setup on day one; dedicate day two to the dunes; retain a second night and margin for onward driving. No fixed gate times, fees, road durations, conditions, availability or traveler reviews are claimed. Visa advice remains passport/purpose/transit specific and links readers to official immigration channels in the article. The body links to the existing `/attractions/sahara-dunes` and `/accommodations/desert-quiver-camp` pages.

## Photographs

No suitable, verified and licensed subject-specific set was added. Keep the page neutral with zero images and a separate six-image follow-up: (1) Sesriem outer gate/entry context, (2) inner gate or park access sign, (3) Dune 45 in morning light, (4) Deadvlei pan and camelthorn trees, (5) Sossusvlei pan/dune edge, and (6) Sesriem Canyon. Each must be an accurately identified Namib-Naukluft/Sesriem subject with reusable rights, source, photographer, license, checked date and useful alt text. Do not reuse photos assigned to the Sahara Dunes attraction or Desert Quiver Camp.

## Sources checked 29 October 2026

- MEFT, Namib-Naukluft Park: https://meft.gov.na/national-parks/namib-naukluft-park/224/
- MEFT, park entry permits: https://www.meft.gov.na/frequently-asked-questions/what-are-the-entry-permit-requirements-for-the-various-parks-in-namibia-/136/
- Namibia Wildlife Resorts, Sesriem Camp: https://www.nwrnamibiawildliferesorts.com/sesriem-camp.html
- Namibia Wildlife Resorts, Sossus Dune Lodge: https://namibianwildliferesorts.com/accommodation/sossus-dune-lodge/
- MEFT media release, 13 December 2025: https://www.namibia-forum.ch/media/kunena/attachments/102/SOSSUSVLEICONCESSIONMEDIARELEASE.pdf
- About Adelt Sossusvlei Concession Management media statements: https://sossusvlei.aboutafrica.co/media-statements
- Namibia Ministry of Home Affairs e-services/visa on arrival portal: https://eservices.mhaiss.gov.na/visaonarrival

## Publication checkpoint

The new published Travel Insight record is in `content/editorial-overrides.json`. Next: inspect the scoped diff, commit and push to `main` after fast-forward/rebase reconciliation, verify the production page and its rendered internal links with a brief public HTTP check, confirm the CMS mirror `source_commit`, send the authorized owner update and record its receipt. No tests, local build or browser QA are planned.

## Publication receipt

- Editorial commit `a66f54faba567ba8c1e6e9c0c091b1f977a319f5` was rebased over the intervening photo commits and pushed to `main`; the unrelated deployment ZIP remained untouched.
- Netlify deployment `6ae2fd17895fdf686b13157e` is `ready` for the article commit. A subsequent photo-only deployment `8e6d0d83a269205465e503f7bd546f4081478970` is also ready and includes the article.
- The public article URL returned HTTP 200. Rendered page inspection confirmed the new title and body, both internal guide links, official visa portal, visible source section and no exposed markup.
- Supabase `public.editorial_documents` confirms entity `travel_articles`, slug `plan-a-sossusvlei-sunrise-from-sesriem`, status `published`, title and 9,579-character body. Its `source_commit` matches the latest production build, `8e6d0d83a269205465e503f7bd546f4081478970`.
- Owner report sent to the configured address on 29 October 2026; Gmail message ID `1a186aeff55ad4a2`.
- No tests, local build or browser QA were run. The authorized main push triggered the production build. Six accurate, licensed image subjects remain tracked separately; current image count is zero.

## Review correction — 29 October 2026

Reviewed the original live body and tightened two factual issues without changing the story, pacing, or rotation priority. The internal attraction link now points to the existing Namib Desert guide rather than the Morocco-focused Sahara Dunes guide. Lodging claims now distinguish NWR’s named properties: its official page places Sossus Dune Lodge inside the park and says guests can reach Sossusvlei before sunrise and stay after sunset; its official Sesriem Campsite page locates it by Sesriem Canyon at the Sossusvlei gateway and lists its Deadvlei shuttle. The former `nwrnamibiawildliferesorts.com` and `namibianwildliferesorts.com` pages were removed as official sources. MEFT’s reservation FAQ directs visitors to `www.nwr.com.na`, confirming the official provider domain.

The final-section passage now attributes only what MEFT’s public concession clarification supports: it does not restrict NTB-registered tour operators and lodges from taking their clients into Sossusvlei. It does not infer a universal private-vehicle rule; it directs visitors to confirm eligibility and pickup terms with MEFT, NWR or their authorized provider. NWR’s live shuttle listing supports the existence of the 2x4-to-Deadvlei shuttle. The final source section was rewritten as practical traveler guidance; it no longer explains editorial omissions or validation process.

**Review correction publication:** commit `6c5eb3d53fd316c624856330341567be534a8e81` corrected the internal guide link and official-source URLs. Final source-attribution tightening was published as `e418749a355c34129015045c30862fea7cffa8d2`; Netlify production deployment `6ae3211dd5bbb794c3bfcfbb` is ready for that commit. The public URL returned HTTP 200 and displayed the Namib Desert link, official NWR source URLs and revised concession wording without exposing markup. Supabase confirms the published article’s `source_commit` is `e418749a355c34129015045c30862fea7cffa8d2`. Owner correction email was sent, followed by a source-attribution clarification; Gmail message IDs `1a187388b5d57fb4` and `1a1873a32bc36ab1`. The next category remains destinations.
