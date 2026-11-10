// Resize Cairo photos to max 1800 px wide, JPEG q85
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const fs = await import('node:fs');
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = path.join(repo, 'public/images/editorial/cairo-local-destination');
const files = fs.readdirSync(outDir).filter(f => f.endsWith('.jpg'));
for (const f of files) {
  const p = path.join(outDir, f);
  const meta = await sharp(p).metadata();
  if (meta.width > 1800) {
    const tmp = p + '.tmp';
    await sharp(p).rotate().resize({ width: 1800 }).jpeg({ quality: 85 }).toFile(tmp);
    fs.renameSync(tmp, p);
    const m2 = await sharp(p).metadata();
    console.log(f, meta.width + 'x' + meta.height, '->', m2.width + 'x' + m2.height);
  } else console.log(f, 'kept', meta.width + 'x' + meta.height);
}
