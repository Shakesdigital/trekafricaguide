import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import sanitizeHtml from 'sanitize-html';

// Inspect text after parsing HTML, so actual links/tags are not false positives.
export function exposedMarkup(html) {
  const visible = sanitizeHtml(html, {allowedTags: [], allowedAttributes: {}, nonTextTags: ['script', 'style', 'textarea', 'noscript'], textFilter: text => text});
  return /&(?:amp;)*lt;\/?[a-z][\s\S]*?&(?:amp;)*gt;|\[[^\]\n]+\]\((?:https?:\/\/|\/)[^\s)]+\)/i.test(visible);
}
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : file.endsWith('.html') ? [file] : [];
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const files = walk(process.argv[2] || 'dist');
  if (!files.length) throw new Error('No generated HTML pages found for readability inspection.');
  const failures = files.filter(file => exposedMarkup(fs.readFileSync(file, 'utf8')));
  if (failures.length) {
    console.error('Publication blocked: visible HTML/Markdown syntax in:\n' + failures.join('\n'));
    process.exitCode = 1;
  } else console.log(`Readability guard passed: ${files.length} generated pages.`);
}
