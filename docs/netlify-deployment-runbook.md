# Netlify deployment checks

Netlify production builds use the repository's `netlify.toml` command: `npm ci && npm run build`. The build now begins with `npm run check:build-inputs`, which parses repository-managed content JSON, syntax-checks both photo-library JavaScript files, and confirms the public CMS copy matches the curated source. When updating photo records, edit `src/lib/photo-library.js` and run `node scripts/sync-photo-library.mjs` to refresh the public mirror.

## October 2026 production failure

Commit `1fcb0de03c860b63faa0f9f6712b0bf743897e0b` added the Bwindi sector photo records but omitted a comma after the Batoka Gorge photo entry in both `src/lib/photo-library.js` and `public/photo-library.js`. `node --check` failed at the first Bwindi image key with `SyntaxError: Unexpected string`, which prevented Astro route generation and left later pushed content, including the Kwame Nkrumah Memorial Park guide, unpublished. The two mirrors are corrected; the build-input check prevents the same syntax or mirror-drift error from reaching Astro.

A separate Netlify MCP `deploy-site` upload attempt returned HTTP 500 before returning a deploy ID. Netlify's project API still showed only the older ready production deploy at commit `313c1fb`; that response did not expose a failed-build record. Do not describe the MCP upload 500 as a build failure. The latest production build still needs to publish the corrected commit and be checked against the public attraction URL and Ghana listing.

## Verify publication

When the Git-triggered production deploy does not advance, use the connected Netlify `deploy-site` action for site `d32d59a3-f819-4e66-9e79-ce47e04ce22d`, then run the returned command from the repository root. Treat successful upload as a deployment attempt, not proof of publication. Confirm the deploy is ready and its commit includes the fix, then check the new guide's distinctive body text and its country listing card on the production domain. Never copy or store the temporary proxy credential returned by the deployment action.
