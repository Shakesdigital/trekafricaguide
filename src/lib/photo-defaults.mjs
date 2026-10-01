import { photoLibrary } from './photo-library.js';

// Shared by the static website and the CMS. Never replace an editor's new photo.
export function applyPhotoDefaults(table, row) {
  const starter = photoLibrary.listings[table]?.[row.slug];
  if (!starter) return row;
  const result = { ...row };
  const useStarter = !row.hero_image_url || starter.replaces.includes(row.hero_image_url);
  if (useStarter) {
    result.hero_image_url = starter.hero_image_url;
    result.hero_image_alt = starter.hero_image_alt;
  }
  let gallery = row.gallery;
  if (typeof gallery === 'string') {
    try { gallery = JSON.parse(gallery); } catch { gallery = [gallery]; }
  }
  if ('gallery' in starter && (!gallery || !gallery.length) && (useStarter || row.hero_image_url === starter.hero_image_url)) {
    result.gallery = starter.gallery;
  }
  return result;
}

export function photoContext(src) {
  const photo = photoLibrary.images[src];
  return photo && !photo.property ? `Destination setting: ${photo.subject}. This is not a photograph of the accommodation.` : '';
}
