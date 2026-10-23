# Rendered readability correction

Owner reported literal HTML on Great Zimbabwe. Shared EditorialText escaped authored HTML before sanitizing it. Fixed mixed plain/rich-text rendering through existing sanitizer; no unsafe raw HTML path introduced.

Commit: 37a6a22. Netlify deployment 6adba96ad5fe9f4ba4d990a4 ready for this exact commit, published 2026-10-23T18:38:13.827Z. Live Great Zimbabwe returned HTTP 200, correct rich-text paragraphs and actual UNESCO href https://whc.unesco.org/en/list/364/, with no exposed markup. Giza activity, Zimbabwe country, Sine-Saloum local destination, Les Paletuviers stay and Victoria Falls insight also returned 200 without exposed markup.

Production npm build now scans all generated HTML and fails on visible HTML/Markdown link syntax. Focused real-content, plain-text, sanitizer and positive/negative guard assertions passed. Existing local generated output (37 fixture pages) passed; this is not the production page count. No full test suite run. Live HTTP/text-only checks previously missed this defect; authoring workflow now explicitly requires rendered readability and anchors.

A redundant MCP source upload was stopped once the Git-triggered deployment was confirmed ready. No new content or images. Existing image backlogs unchanged. Owner email SENT 1a16a11360677d0a. Next: destination rotation.
