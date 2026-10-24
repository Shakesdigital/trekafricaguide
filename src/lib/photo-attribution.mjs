/** Keep visible attribution only where the image's licence or source record requires it. */
export function requiresPublicAttribution(credit) {
  if (!credit || credit.kind === 'generated') return false;
  if (typeof credit.requires_attribution === 'boolean') return credit.requires_attribution;

  const license = String(credit.license || '').trim();
  if (/^CC0(?:\b|\s|$)/i.test(license) || /^public domain(?:\b|\s|$)/i.test(license)) return false;

  // Fail closed for unfamiliar or incomplete rights records.
  return true;
}
