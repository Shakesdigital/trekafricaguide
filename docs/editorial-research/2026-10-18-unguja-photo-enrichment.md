# Unguja photo enrichment — 18 October 2026

Completed a six-photo collection for the already-published Unguja local destination guide. Before this run the guide had no hero image and an empty gallery. The new gallery covers Stone Town's waterfront, a historic lane and two carved doors, Forodhani Gardens, and the separate north-coast setting at Nungwi. The original JPEG files are unchanged. Each photo has descriptive alt text and individual source, creator, capture date (when supplied), licence, SHA-256, subject evidence and reuse notes in `src/lib/photo-library.js`; the site's image credits remain in the existing expandable gallery and source index. No source in this collection is assigned elsewhere in the site.

## Verified photographs

| Scene | Creator; date | Licence | Exact-subject evidence and source |
| --- | --- | --- | --- |
| Stone Town waterfront promenade and boats | Ally.Nachuli (Tx); 13 March 2021 | CC BY-SA 4.0 | Commons description names Stone Town, Zanzibar; category is Stone Town waterfront; visually confirmed promenade/boats. [File record](https://commons.wikimedia.org/wiki/File:Stone_town_-Zanzibar.jpg) |
| Narrow Stone Town lane | GTBacchus; February 2002 | CC BY-SA 3.0 | Commons description says Stone Town in Zanzibar; visually confirmed lane and adjoining buildings. Historic capture date is retained in the alt text. [File record](https://commons.wikimedia.org/wiki/File:Stone_Town_Zanzibar.jpg) |
| Forodhani harbour gardens | Moongateclimber; capture date not stated | Public domain, released by copyright holder | Commons description identifies the gardens in Stone Town from the House of Wonders; visually confirmed gardens, waterfront and boats. Courtesy creator credit is shown. [File record](https://commons.wikimedia.org/wiki/File:Forodhani_jubilee_gardens_Zanzibar.jpg) |
| Nungwi north-coast ocean view | Niceley; 10 August 2012 | CC BY-SA 4.0 | Commons description identifies Nungwi as Zanzibar's northernmost point; visually confirmed dhow offshore. [File record](https://commons.wikimedia.org/wiki/File:Nungwi-Beach-Zanzibar.jpg) |
| Carved wooden relief above a Stone Town door | David Berkowitz; 25 February 2011 | CC BY 2.0 | Commons description places the carved door in historic Zanzibar City on Unguja; visually confirmed upper relief panel. [File record](https://commons.wikimedia.org/wiki/File:Door_-_Stone_Town-4.jpg) |
| Full carved doorway in Stone Town | Eirik Newth; 2 March 2004 | CC BY 2.0 | Commons description identifies a carved door in historic Stone Town; visually confirmed complete doorway and carved surround. [File record](https://commons.wikimedia.org/wiki/File:Stone_Town_carved_door.jpg) |

All six records were checked on 18 October 2026. Attribution and share-alike conditions are preserved in the public credit links where applicable. No model-generated imagery, property imagery, sensitive private scenes, or unlicensed files were used. No factual editorial text, relationships, redirects, tracking configuration or public disclosure/contact content changed. No tests, build or browser QA were run.

## Separate image follow-up

During source screening, a similarly named Commons file, [Zanzibar Stone Town beach.jpg](https://commons.wikimedia.org/wiki/File:Zanzibar_Stone_Town_beach.jpg), was visually found to show a person jumping from a ferry. It was rejected for this guide and is not used by the site. This is distinct from the existing Zanzibar attraction hero, whose source is [Beach Scene at Mtoni Marine](https://commons.wikimedia.org/wiki/File:Beach_Scene_at_Mtoni_Marine_-_Outside_Stone_Town_-_Zanzibar_-_Tanzania_(8869338564).jpg); that file shows a beach with boats. The existing attraction image was not reused, and its source is retained unchanged. None of the six selected source pages duplicates an image already assigned to another detail-page collection.

## Publication checkpoint

Commit `31253b2` is pushed to `origin/main`. Live publication is not confirmed: Netlify's published production deploy remains `6ad4c59e14442e35bb96e339` at commit `ebd0b87ba551db6449fb61e6339b586bd33f6fda`. The guide URL returns HTTP 200 but has no new image paths or image-credit section; all six new production image URLs return 404. A successful push alone does not count as live publication. The existing Elmina record in `content/local-destinations.json` had a trailing comma in its `research_sources` array (introduced in commit `4ef39be`), so the JSON could not parse. Removed only that comma in `31253b2` to restore valid syntax; this is a syntax-only repair with no content change. Its effect on deployment remains unconfirmed. Next: investigate the stale Netlify deployment trigger/build path, then confirm the Unguja page and six assets before marking the run complete. Owner email report sent 18 October 2026 at 22:29 Africa/Kampala (Gmail ID `1a1507dd5e18bd1d`).

## Pending check — 19 October 2026, 00:11 Kampala

Production remains unchanged: guide HTTP 200 with zero new Unguja image references; sampled Nungwi asset HTTP 404. Netlify project lookup confirms published deploy 6ad4c59e14442e35bb96e339 remains current. No new collection started, no duplicate email sent, and no editorial checkpoint changed. Next action is to inspect latest failed-build/Git-trigger evidence in Netlify; the published-deploy API alone does not identify why newer commits have not deployed.

## Pending check — 19 October 2026, 09:33 Kampala

Unchanged: guide HTTP 200 with zero Unguja image references; sampled Nungwi image HTTP 404; Netlify current deploy remains 6ad4c59e14442e35bb96e339. GitHub main reports no commit statuses and zero check runs. Dashboard inspection is unavailable because browser inventory exposes only MCP Apps; connector cannot list latest builds. Root cause remains unconfirmed. Retain pending collection; no new image work or duplicate email. Next: inspect Netlify build history when dashboard access is available, then confirm gallery/assets.

## Publication confirmed — 19 October 2026, 15:19 Kampala

Live guide HTTP 200 contains all six expected Unguja image paths. Each of the six assets returns HTTP 200 with image/jpeg. Collection now confirmed live: 0 to 6 photographs. Earlier deployment delay resolved for this collection; root cause not established. Owner publication email sent via Gmail, ID 1a1541a74afa6ffa. Optional further variety: east-coast or island-interior subjects; minimum target met. Next rotate to a published attraction image gap after reviewing current records. No tests/builds or editorial checkpoint changes.
