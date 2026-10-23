import crypto from 'node:crypto';
import { listBlobs, readJson, writeJson } from './_store.js';

export const PRODUCTS = ['blouse', 'tote', 'tshirt'];
export const designPrefix = (product) => `designs/${product}/`;
export const markerPath = (product) => `meta/${product}.json`;
export const configPath = (product) => `config/${product}.json`;

export function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(body);
}

// Timing-safe password check against the ADMIN_PASSWORD environment variable.
export function passwordOk(given) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return null; // not configured
  const a = crypto.createHash('sha256').update(String(given || '')).digest();
  const b = crypto.createHash('sha256').update(real).digest();
  return crypto.timingSafeEqual(a, b);
}

// A design is one image file: designs/<product>/<id>_<base64url(label)>.<ext>
const NAME = /^designs\/[a-z]+\/(d[0-9a-z]+)(?:_([A-Za-z0-9_-]*))?\.(webp|jpg|png)$/;   // label part is missing on files from the first version
export function fileName(product, id, label, ext) {
  return `${designPrefix(product)}${id}_${Buffer.from(label, 'utf8').toString('base64url')}.${ext}`;
}
export function toDesign(b) {
  const m = NAME.exec(b.pathname);
  if (!m) return null;
  let label = '';
  try { if (m[2]) label = Buffer.from(m[2], 'base64url').toString('utf8'); } catch (e) {}
  return { id: m[1], label, src: b.url };
}
export async function listDesigns(product) {
  const blobs = await listBlobs(designPrefix(product));
  const designs = blobs.map(toDesign).filter(Boolean).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  // Files uploaded by the first version have no label in their name; recover it from the old list if it is still there.
  if (designs.some((d) => !d.label)) {
    let legacy = null;
    try { legacy = await readJson(`data/${product}.json`); } catch (e) {}
    const names = new Map(((legacy && legacy.designs) || []).map((d) => [d.id, d.label]));
    designs.forEach((d, i) => { if (!d.label) d.label = names.get(d.id) || 'Design ' + (i + 1); });
  }
  return designs;
}
export async function listBlobsFor(product) { return listBlobs(designPrefix(product)); }

// Remember that online storage has been set up for this product (so buyers stop seeing the old static files,
// even if every design is later deleted).
export async function ensureMarker(product) {
  const have = (await listBlobs(markerPath(product))).some((b) => b.pathname === markerPath(product));
  if (!have) await writeJson(markerPath(product), { created: Date.now() });
}
export async function hasMarker(product) {
  return (await listBlobs(markerPath(product))).some((b) => b.pathname === markerPath(product));
}
export { readJson, writeJson };
