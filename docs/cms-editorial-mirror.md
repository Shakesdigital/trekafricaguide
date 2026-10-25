# Shared CMS and automation editing

## Status — 25 October 2026

Mirroring is active. Supabase project access was restored on 25 October 2026.
The production import contains 113 complete documents: 103 published and 10 drafts.
The live runtime configuration confirms editorialMirrorEnabled=true. Source commit
edc4cf530cb98f892e8f5f96feb055fe96f3913c deployed ready as
6addf06ba686821f70781b18 at 2026-10-25 12:05:38 UTC.

The CMS's immediate Publish website action still needs a real server-side
NETLIFY_DEPLOY_HOOK. The local saved value was a placeholder, and the connected
Netlify tools cannot create hooks. The owner has been asked to configure one for
main. Saving to the CMS works independently; the next successful production build
(including an ordinary automation push) consumes those saved revisions. Do not
claim an immediate publishing request succeeded until the hook is configured.

Backups outside the repository: ../trek-cms-native-backup-20261025.json (88 native
records, including unpublished records), and ../trek-cms-git-backup-20261025/.
Native content tables were not overwritten. The existing confirmed CMS account
received an admin profile, and a self-read profile policy allows it to load its
own role without granting access to other profiles.

## Content and ownership

The new `/cms-editorial.html` workspace uses the existing CMS login and the
database `profiles.role`, not self-editable user metadata. It manages complete
effective documents for countries, attractions, activities, accommodations,
travel insights and local destinations. Body copy, research metadata, galleries,
image URLs, publication fields and canonical relationships stay together.
Local destination slugs must remain unique within that collection.

The native CMS tables remain intact. `editorial_documents` holds the effective
website document, its automation baseline, revision and conflicting proposals.
This avoids discarding Git-only fields or assigning invalid numeric IDs to
repository records. Existing native records and their IDs are not rewritten.
Once enabled, the main CMS's corresponding tabs route to the shared workspace;
other CMS sections retain their current behavior.

Each production build reads native tables, applies Git editorial overrides and
photo defaults, then calls the transactional import RPC. Unchanged fields receive
automation changes. Manually changed fields are retained. If both sources changed
the same field, the incoming proposal appears in the CMS for review. Manual saves
require the exact revision that was opened; a stale save is rejected. History
retains prior documents. These are field-level merges: an entire gallery or body
is one field, not a sentence-level collaborative editor.

Draft and scheduled publication filtering runs **after** reconciliation. Source
removals withdraw the mirrored document to draft while preserving its text and
history. Restore the canonical source before republishing such a document.
The first import mirrors the current effective website content. It does not
resolve historical differences between the native CMS and Git; export both
sources before activation so previous native edits can be reviewed/restored.

Booking destination registry, Stay22 configuration, photo licensing catalogue,
video licensing approvals, templates and navigation are still repository-managed
configuration. Changing a document's booking URL does not override a verified
registry match. New photos require the existing licensing/provenance workflow.
This editor edits existing mirrored records; new canonical records continue to be
created through the existing authoring workflow and arrive on the next build.

## Activation procedure and completed setup

1. Reconnect Supabase to `rftoaaehhenhnziukgpl`. Inspect current tables, existing
   `profiles` roles and `private.has_cms_role(text[])` before applying anything.
2. Export native six-category content and the Git sources as a dated backup.
   Preserve any unpublished native records and historical manual edits.
3. Apply `supabase/migrations/20261025000100_editorial_mirror.sql` to that project.
   It creates the mirror/history and restricted RPCs; it does not overwrite
   native tables. Anonymous reads/writes are denied; authenticated staff can read;
   only service credentials import; editors save drafts; admins save published
   records. Direct client writes are not granted.
4. Confirm server-only `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) and
   `SUPABASE_URL` on the authorized Netlify site's build/functions scopes. Never
   put a secret key in runtime-config.js or browser code. Netlify currently has a
   variable named SUPABASE_SECRET_KEY; its permissions have not been verified.
5. Configure `NETLIFY_DEPLOY_HOOK` on the server (pending). Activation is now
   versioned as `EDITORIAL_CMS_SYNC=true` in netlify.toml production environment.
   The connector reported an environment upsert but the key did not persist, so
   the repository setting is authoritative. The hook is withheld from public runtime
   configuration when synchronization is enabled. Only an authenticated admin
   may request publishing through `editorial-publish`.
6. Trigger the ordinary production build, confirm import counts and the resulting
   deployment separately. A failed import stops publication; it must never fall
   back silently to overwriting manual changes with Git. Back up and inspect the
   first imported revisions before declaring migration complete.
7. With an authorized CMS session, verify one real save/reload/publication cycle
   and a stale-revision rejection using a reversible editorial change. Confirm
   automation changes to a different field survive alongside it. Record the
   result; this has **not** yet been done. Check draft privacy and role grants.

Do not enable this flag for preview/branch deployments against production data:
they would import their branch's content. Use a separate database for previews.
Older commit timestamps are rejected to prevent queued old builds from reverting
newer imports. Rollbacks require an explicit content/revision review.

## Recovery and publishing

Save writes to Supabase; Publish website requests a Netlify build. A successful
request is not proof of a successful deployment. A newer save made while a build
is running needs another publish request. Conflicts retain manual content and
are visible to staff; they do not silently choose the automation proposal.
Restoring an older history value uses the current revision and ordinary save RPC.

Disabling the feature restores the legacy Git-overlay rendering path; it does
not erase mirror/history tables, but would hide mirror-only edits. Export and
reconcile those edits before using that fallback. Do not disable it silently.

No test suite or local build was run, per owner preference. Production deployment,
import counts, source parity, RLS/grants and public HTTP results were checked.
Anonymous reads/saves, direct authenticated writes and client imports are denied;
staff save and server import RPC grants are present. There are zero import
conflicts or content/baseline differences. An interactive owner save/publish
round trip has not been performed; no owner session was impersonated. Reference: Supabase database functions and row-level security docs,
checked 25 October 2026.

## Deployment receipt

Code commit `bb618cd11932dee922303ea5fec82d9ee9a2bd40` deployed ready as
`6adda3e6d08c1e234ab8241a` at 2026-10-25 06:39:02 UTC. The editor HTML,
script and runtime configuration returned HTTP 200. The live configuration
confirms `editorialMirrorEnabled: false`. This verifies inactive code delivery,
not database synchronization or authenticated editing.

## Active production receipt

Published records: 19 countries, 29 attractions, 29 accommodations, 14 activities,
6 local destinations and 6 travel insights. Ten previously withdrawn insights
remain drafts. Existing photo URLs and curated photo defaults are mirrored; no
new images were added in this run. The CMS workspace, runtime configuration,
Bwindi activity and Livingstone destination returned HTTP 200. The deploy hook
is not exposed in public runtime configuration.

Applied migrations: editorial_mirror, cms_own_profile_read and
editorial_mirror_input_guards. The latter rejects null revisions and empty/null
imports. Publication still follows draft/date filtering after reconciliation.
