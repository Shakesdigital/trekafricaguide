import { execFileSync } from 'node:child_process';
import { loadPublishedTables } from '../src/lib/content-repository.mjs';

if (process.env.CONTEXT === 'production' && process.env.BRANCH === 'main') {
  const subject = execFileSync('git', ['log', '-1', '--format=%s'], { encoding: 'utf8' }).trim();
  if (subject === 'Sync Trek Africa Guide CMS batch') {
    await loadPublishedTables(undefined, new Date(), { importMirror: true });
  }
}
