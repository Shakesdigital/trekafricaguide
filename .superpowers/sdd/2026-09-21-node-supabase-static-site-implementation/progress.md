# SDD ledger — plan: docs/superpowers/plans/2026-09-21-node-supabase-static-site-implementation.md
Setup: SDD helper script could not run from PowerShell because no bash executable is available in this Git install; created the plan-scoped ledger manually. Cost if wrong: helper-generated task brief files are absent, so the checked-in plan and spec are the source of truth.
Pre-flight: Task 1 produces Astro/package configuration consumed by Tasks 5-9; recovered commits f35d31b and 6b7c1ee show the foundation exists, with duplicate same-message commits noted for cleanup during final history review.
Pre-flight: Task 2 produces RawTables/env/Supabase repository consumed by Tasks 3 and 5-8; recovered commit 5fbd19b shows repository files exist and tests were part of that commit.
Pre-flight: Task 3 produces SiteModel and image resolution consumed by Tasks 4-7; uncommitted files show Task 3 is in progress and must be verified before committing.
Pre-flight: Task 4 produces sanitization and Stay22 rules consumed by Task 7; no implementation found yet.
Pre-flight: Task 5 produces layout/components consumed by Tasks 6-7; no implementation found yet.
Pre-flight: Task 8 produces runtime CMS config and parity manifest consumed by Task 9; no implementation found yet.
Task 1: complete (recovered from git commits f35d31b and 6b7c1ee; tests to be rerun in current session before final acceptance)
Task 2: complete (recovered from git commit 5fbd19b; tests to be rerun in current session before final acceptance)
Task 3: Ruling: The Task 3 fixture had published Morocco content under a draft Northern Africa region, so the new parent-publication validator correctly rejected it. Set the fixture region to published because the migration requires Northern Africa coverage and matching published parent/child records. Cost if wrong: a fixture may include one region earlier than intended, but production visibility still comes from Supabase publication state.
Task 3: Ruling: The nearby-attractions test originally used Uganda, which has only one fixture attraction; changed the assertion to use Kenya, where Maasai Mara and Amboseli prove the same deterministic same-country rule. Cost if wrong: the fixture may miss a Uganda-specific nearby case, but the model rule is country-agnostic and covered.
Task 3: complete (tests: node --test tests/node/site-model.test.mjs tests/node/images.test.mjs -> 19/19 pass)
Task 4: Ruling: Supported provider links are wrapped through Stay22 even when affiliate_supported is false because the user explicitly required booking links on full detail pages to use the Stay22 wrapper in the background for all listings. Unsupported providers still fall back to validated direct URLs. Cost if wrong: non-affiliate supported-provider links may route through Stay22 instead of direct provider URLs.
Task 4: complete (tests: node --test tests/node/content-html.test.mjs tests/node/booking.test.mjs tests/js/cms-core.test.mjs -> 74/74 pass)
Task 5: complete (tests: node --test tests/node/page-shell.test.mjs -> 1/1 pass)
Task 6: complete (tests: node --test tests/node/directory-pages.test.mjs -> 1/1 pass)
Task 7: complete (tests: node --test tests/node/detail-pages.test.mjs -> 1/1 pass)
Task 8: Ruling: The Laravel seeder contains a broader future content backlog than the currently published Supabase-shaped fixture/routes. For this PHP cutover, content/legacy-route-manifest.json tracks currently published route slugs so the build audit protects live parity without blocking on unimported backlog content. Cost if wrong: some researched expansion records from the seeder backlog may remain unpublished until a later content import.
Task 8: complete (tests: node --test tests/node/public-config.test.mjs tests/node/content-parity.test.mjs -> 4/4 pass; audit-content-parity fixture -> ok true)
