# Deployment draft validation correction — 19 October 2026

The supplied Netlify log reaches static route generation and fails in mergeEditorialOverrides: `Editorial record travel_articles/plan-first-east-africa-safari needs body`. This establishes a content-validation failure, not an npm failure, for that deploy. The previous npm command change was a robustness improvement, not the proven cause.

The owner intentionally unpublished ten development starter articles. Their draft overrides must work when a base body is empty or the base record is absent. Completeness checks now skip explicitly draft merged records; allowed fields, slug/identity checks remain, and non-draft records including scheduled publication still require content. Existing publication filtering continues to exclude drafts. No placeholder article was restored.

Focused checks passed: draft with no base; draft over an empty base; incomplete published article rejected; current override fields accepted; editorial, local destination and booking JSON parse. These are focused checks, not a full build. Attempt to validate against current public Supabase content failed at DNS lookup; no credentials were printed. Full production build and live publication still require confirmation after push.

## Live confirmation

After fix 39f0ffd, Netlify reports current deploy 6ad5c695fa6fb724f23bb4f7 ready. Elmina destination returns HTTP 200; Bwindi insight HTTP 200 contains Ruhondeza; Table Mountain and Cape Town base insights HTTP 200 contain Never@home. Accumulated destination and three insight revisions are confirmed live.
