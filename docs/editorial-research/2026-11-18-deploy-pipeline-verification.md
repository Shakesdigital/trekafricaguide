# 2026-11-18 verification run — deploy pipeline broken (no publication possible)

**Date:** 2026-11-18 (12:00 Africa/Kampala)  
**Run type:** verification/inventory pass — no deliverable could be published because every live-verification requirement fails.

## What this run found

The content-only handoff pipeline stopped reaching the live site after the GitHub `main` history was force-replaced.

**Evidence (all checked 18 Nov 2026):**

1. **Origin `main` was force-updated** (`7d3044c...ae2a538 main -> origin/main (forced update)`) and now contains **only 8 commits and a content-only tree**: `content.md`, `content/editorial-overrides.json`, `content/local-destinations.json`, `docs/*`, `new-activity.json`, `update-activities.json`. The Astro/Netlify build source (`src/`, `public/`, `astro.config.mjs`, `netlify.toml`, `package.json`) is **gone from `main`**. No common ancestor with the previous full history (local backup branch `backup-local-main-20261118` preserves the old 837-commit lineage).
2. **Every post-squash publish is HTTP 404 live**, while pre-squash content still serves:
   - 404: `/accommodations/steigenberger-hotel-el-tahrir-cairo/`, `/travel-insights/kenya-safari-model-reserve-vs-conservancy/`, `/countries/algeria/djanet-and-tassili/`, `/activities/nyungwe-chimpanzee-tracking/`, `/activities/south-luangwa-walking-safari/`
   - 200 (stale pre-squash build): `/countries/tanzania/serengeti/`, all five directories.
3. **Netlify deploy hook 404s**: POST to the hook URL stored in `.env` (and the identical older copy in commit `cc89592` `.env.netlify`) returns 404 Not Found — the hook appears deleted/rotated owner-side.
4. **No Netlify CLI on this machine** (not installed), and prior "linked Netlify CLI" deploys were made on a different setup.
5. **GitHub push rights**: to be re-attempted on the local commit this run (prior runs: 403 read-only token).

## Rolling inventory sweep (18 Nov 2026)

- `/accommodations/` 200 (138,550 B), `/attractions/` 200, `/activities/` 200, `/countries/` 200, `/travel-insights/` 200; `/destinations/` 404 (local destinations live under country tabs, unchanged).
- All five directories still serve the pre-squash content build (unchanged since the Serengeti/Musanze-era deploys).
- CMS mirror reconcile (publishable key from local `.env`, reads only): `travel_articles` 200, `local_destinations` 404 (schema cache), `editorial_documents` 400 (service-role held by Netlify — by design). No writes attempted.
- Owner progress email: Gmail still signed out in the OpenBot browser (accounts.google.com sign-in page, re-checked 18 Nov 2026). Draft stored in the progress record; **one sign-in ships it plus all earlier pending drafts**.

## Dependency blocking the next publish (owner-side)

To publish any new or edited page, one of:
- restore the Astro/Netlify build source on GitHub `main` (or point Netlify at the branch/commit that still has it, e.g. the pre-squash history preserved locally in `backup-local-main-20261118`), and
- provide a working deploy hook or a push-right token, or a linked Netlify CLI.

Until then, no editorial commit can be live-verified and no publication receipt can be issued. Publishable content work prepared by prior runs (Steigenberger guide etc.) is committed in this repo and remains ready to go live the moment the pipeline is restored.

## Run action

`docs/editorial-progress.json` updated with `latest_run_checkpoint` and `verification_2026_11_18_deploy_pipeline_broken`. Local commit made; push re-attempted and the real result recorded (no fabricated receipt).
