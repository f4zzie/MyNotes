// The site has two sections built from the same `notes` collection:
//   Notes    = the CPTS field manual (pending/field-manual/**), listed at /notes
//   Writeups = every other published note, listed at /writeups
// Detail pages for both keep their /notes/<id>/ URLs; only the listings differ.
export const FIELD_MANUAL_PREFIX = "field-manual";

export function isFieldManualId(id) {
  return id === FIELD_MANUAL_PREFIX || id.startsWith(`${FIELD_MANUAL_PREFIX}/`);
}
