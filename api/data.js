// GET /api/data?product=blouse|tote|tshirt
// Public. Returns { exists, updatedAt, designs:[{id,label,src}], config }
import { readJson } from './_store.js';
import { PRODUCTS, dataPath, send, emptyDoc } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
  const product = String((req.query && req.query.product) || '');
  if (!PRODUCTS.includes(product)) return send(res, 400, { error: 'Unknown product' });
  try {
    const doc = await readJson(dataPath(product));
    if (!doc) return send(res, 200, { exists: false, ...emptyDoc() });
    return send(res, 200, { exists: true, ...doc });
  } catch (e) {
    console.error('data read failed', e);
    return send(res, 500, { error: 'Storage is not available' });
  }
}
