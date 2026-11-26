// Source images from Wikimedia Commons for a page
// Usage: node scripts/source-commons-images.mjs <search_term> <output_dir> <max_results>
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const searchTerm = process.argv[2] || 'east africa safari';
const outputDir = process.argv[3] || 'public/images/editorial/test';
const maxResults = parseInt(process.argv[4] || '5');

// Create output directory
fs.mkdirSync(outputDir, { recursive: true });

// Search Commons
const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrnamespace=6&gsrlimit=${maxResults}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&format=json`;

console.log(`Searching: ${searchTerm}`);
const searchResult = execSync(`curl -s -A "${UA}" "${apiUrl}"`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
const data = JSON.parse(searchResult);
const pages = data.query?.pages || {};

const results = [];
for (const p of Object.values(pages)) {
  const ii = p.imageinfo?.[0];
  if (!ii) continue;
  
  const meta = ii.extmetadata || {};
  const license = meta.LicenseShortName?.value || 'unknown';
  const artist = (meta.Artist?.value || '').replace(/<[^>]+>/g, '').trim();
  const description = (meta.ImageDescription?.value || '').replace(/<[^>]+>/g, '').trim().substring(0, 200);
  const credit = (meta.Credit?.value || '').replace(/<[^>]+>/g, '').trim().substring(0, 200);
  
  // Skip non-image files (PDFs, etc.)
  const cleanUrl = (ii.thumburl || '').split('?')[0];
  if (!cleanUrl.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
  
  // Skip small images
  if ((ii.thumbwidth || 0) < 800) continue;
  
  const thumbUrl = ii.thumburl;
  const descriptionUrl = ii.descriptionurl;
  
  // Generate filename from title
  const title = p.title.replace(/^File:/, '').replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase().substring(0, 60);
  const ext = path.extname(thumbUrl.split('?')[0]) || '.jpg';
  const filename = title + ext;
  const localPath = path.join(outputDir, filename);
  
  // Download
  try {
    execSync(`curl -s -A "${UA}" -e "https://commons.wikimedia.org/" -o "${localPath}" "${thumbUrl}"`, { maxBuffer: 50 * 1024 * 1024 });
    
    // Verify it's an image by checking file size and magic bytes
    const fileBuffer = fs.readFileSync(localPath);
    const isJpeg = fileBuffer[0] === 0xFF && fileBuffer[1] === 0xD8;
    const isPng = fileBuffer[0] === 0x89 && fileBuffer[1] === 0x50;
    const isWebp = fileBuffer.toString('ascii', 0, 4) === 'RIFF';
    if (!isJpeg && !isPng && !isWebp) {
      console.log(`  SKIP (not image): ${p.title}`);
      fs.unlinkSync(localPath);
      continue;
    }
    
    // Get file size
    const stat = fs.statSync(localPath);
    
    // Compute SHA256
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    results.push({
      title: p.title,
      filename,
      localPath: '/' + localPath.replace(/\\/g, '/').replace('public', ''),
      sourcePage: descriptionUrl,
      creator: artist,
      license,
      licenseUrl: getLicenseUrl(license),
      subject: description.substring(0, 100),
      sha256,
      width: ii.thumbwidth,
      height: ii.thumbheight,
      size: stat.size,
      description: description.substring(0, 200),
    });
    
    console.log(`  OK: ${p.title} | ${license} | ${artist.substring(0,30)} | ${ii.thumbwidth}x${ii.thumbheight} | ${(stat.size/1024).toFixed(0)}KB`);
  } catch (e) {
    console.log(`  FAIL: ${p.title} - ${e.message.substring(0, 100)}`);
  }
}

console.log(`\nDownloaded ${results.length} images:`);
results.forEach(r => console.log(`  ${r.filename} | ${r.license} | ${r.creator}`));

// Output JSON for the caller
console.log('\nJSON:');
console.log(JSON.stringify(results, null, 2));

function getLicenseUrl(license) {
  const urls = {
    'CC0': 'https://creativecommons.org/publicdomain/zero/1.0/',
    'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
    'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/',
    'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
    'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
    'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
    'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
    'Public domain': 'https://creativecommons.org/publicdomain/mark/1.0/',
    'GFDL 1.2': 'https://www.gnu.org/licenses/old-licenses/fdl-1.2.html',
  };
  return urls[license] || '';
}