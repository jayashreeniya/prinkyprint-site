// GET /api/data?product=blouse|tote|tshirt
// Public. Returns { exists, updatedAt, designs:[{id,label,theme,src}], config }
import { PRODUCTS, send, listDesigns, hasMarker, readJson, configPath } from './_shared.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
  const product = String((req.query && req.query.product) || '');
  if (!PRODUCTS.includes(product)) return send(res, 400, { error: 'Unknown product' });
  try {
    const [designs, marker, cfg] = await Promise.all([
      listDesigns(product),
      hasMarker(product),
      product === 'tshirt' ? readJson(configPath(product)) : Promise.resolve(null),
    ]);
    const exists = marker || designs.length > 0 || !!cfg;
    const config = cfg && Array.isArray(cfg.colors) ? { colors: cfg.colors, unavail: cfg.unavail || [] } : null;
    return send(res, 200, { exists, version: 1, updatedAt: (cfg && cfg.updatedAt) || 0, designs: designs.map(({ id, label, theme, src }) => ({ id, label, theme, src })), config });
  } catch (e) {
    console.error('data read failed', e);
    return send(res, 500, { error: 'Storage is not available' });
  }
}
