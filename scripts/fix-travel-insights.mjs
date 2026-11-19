/**
 * Fix travel insights:
 * 1. Remove "Sources and scope" section from all travel articles
 * 2. For articles with images, distribute them evenly within the article
 * 3. Add featured images to article listings for articles missing them (set hero_image_url from body images)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const OVERRIDE_PATH = resolve(process.cwd(), 'content/editorial-overrides.json');

function extractImagesFromBody(body) {
  // Extract all <figure><img src="..."> elements from the body
  const figureRegex = /<figure>\s*<img[^>]*src="([^"]*)"[^>]*>[\s\S]*?<\/figure>/g;
  const images = [];
  let match;
  while ((match = figureRegex.exec(body)) !== null) {
    // Extract the full figure element
    const figureMatch = body.substring(match.index, body.indexOf('</figure>', match.index) + '</figure>'.length);
    images.push({
      src: match[1],
      figure: figureMatch
    });
  }
  return images;
}

function removeSourcesAndScope(body) {
  // Remove the "Sources and scope" section (h2 or h3 + following content until next h2/h3 or end)
  const sourcesRegex = /\s*<h[23]>Sources and scope<\/h[23]>[\s\S]*?(?=<h[23]>|$)/g;
  return body.replace(sourcesRegex, '').trim();
}

function removeSourcesAndScopeAlt(body) {
  // Also handle case where it might be "Sources and scope" with different casing
  const sourcesRegex = /\s*<h[23]>Sources and scope<\/h[23]>[\s\S]*?(?=<h[23]>|$)/gi;
  return body.replace(sourcesRegex, '').trim();
}

function redistributeImages(body, images) {
  if (images.length === 0) return body;

  // First, remove all existing figure elements from the body
  let cleanBody = body.replace(/<figure>[\s\S]*?<\/figure>\s*/g, '');

  // Split body into sections by h2 headings
  const sectionRegex = /(<h2>[^<]*<\/h2>)/g;
  const parts = cleanBody.split(sectionRegex).filter(p => p.trim().length > 0);

  // Group content into sections (heading + content)
  const sections = [];
  let currentSection = { heading: '', content: '' };

  for (const part of parts) {
    if (part.match(/^<h2>[^<]*<\/h2>$/)) {
      if (currentSection.heading || currentSection.content.trim()) {
        sections.push({ ...currentSection });
      }
      currentSection = { heading: part, content: '' };
    } else {
      currentSection.content += part;
    }
  }
  if (currentSection.heading || currentSection.content.trim()) {
    sections.push({ ...currentSection });
  }

  // If we have sections and images, distribute images evenly
  if (sections.length > 0 && images.length > 0) {
    const imagesPerSection = Math.ceil(images.length / sections.length);
    let imageIndex = 0;

    const newSections = sections.map((section, i) => {
      const sectionImages = images.slice(imageIndex, imageIndex + imagesPerSection);
      imageIndex += imagesPerSection;

      let content = section.content.trim();
      // Insert images after the first paragraph of each section's content
      if (sectionImages.length > 0 && content) {
        // Find the first paragraph end
        const firstPEnd = content.indexOf('</p>');
        if (firstPEnd !== -1) {
          const insertPos = firstPEnd + '</p>'.length;
          const figuresHtml = sectionImages.map(img => img.figure).join('\n');
          content = content.slice(0, insertPos) + '\n\n' + figuresHtml + '\n\n' + content.slice(insertPos);
        } else {
          // No paragraph, prepend images
          const figuresHtml = sectionImages.map(img => img.figure).join('\n');
          content = figuresHtml + '\n\n' + content;
        }
      }

      return section.heading + '\n' + content;
    });

    return newSections.join('\n\n');
  }

  // If no sections or no images, just return body with images removed (they'll be handled by hero)
  return cleanBody;
}

function setHeroImage(article, images) {
  // If article has no hero_image_url but has images in body, use the first one
  if (!article.hero_image_url && images.length > 0) {
    article.hero_image_url = images[0].src;
    if (!article.hero_image_alt) {
      article.hero_image_alt = article.title;
    }
  }
  // Also populate gallery with all images for pickGallery to work
  if (images.length > 0 && (!article.gallery || article.gallery.length === 0)) {
    article.gallery = images.map(img => img.src);
  }
  return article;
}

async function main() {
  const content = await readFile(OVERRIDE_PATH, 'utf8');
  const data = JSON.parse(content);

  if (!data.travel_articles || !Array.isArray(data.travel_articles)) {
    console.error('No travel_articles found in editorial-overrides.json');
    process.exit(1);
  }

  let modified = 0;

  for (const article of data.travel_articles) {
    if (!article.body) continue;

    const originalBody = article.body;

    // 1. Remove "Sources and scope" section
    let body = removeSourcesAndScopeAlt(article.body);

    // 2. Extract images from body
    const images = extractImagesFromBody(body);

    // 3. Redistribute images evenly
    if (images.length > 0) {
      body = redistributeImages(body, images);
    }

    // 4. Set hero image and gallery for listing
    article.body = body;
    setHeroImage(article, images);

    if (article.body !== originalBody || (images.length > 0 && !article.hero_image_url)) {
      modified++;
      console.log(`Modified: ${article.slug} (${images.length} images found)`);
    }
  }

  if (modified > 0) {
    await writeFile(OVERRIDE_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\nUpdated ${modified} travel articles in editorial-overrides.json`);
  } else {
    console.log('No changes needed');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});