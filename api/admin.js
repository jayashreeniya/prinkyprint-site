// POST /api/admin   body: { password, action, product, ... }
// Actions: login | addDesign | deleteDesign | setTheme | saveConfig
import { putImage, deleteByUrl, copyBlob } from './_store.js';
import { PRODUCTS, send, passwordOk, listDesigns, listBlobsFor, filesForId, fileName, ensureMarker, writeJson, configPath } from './_shared.js';

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_DESIGNS = 400;
const EXT = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };
const cleanTheme = (s) => String(s || '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
const cleanLabel = (s, fb) => String(s || fb || 'Design').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 40) || fb || 'Design';

function validConfig(c) {
  if (!c || !Array.isArray(c.colors) || c.colors.length > 80) return null;
  const colors = [];
  for (const k of c.colors) {
    if (!k || typeof k.id !== 'string' || typeof k.name !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(k.hex || '')) return null;
    colors.push({ id: k.id.replace(/[^\w-]/g, '').slice(0, 32), name: cleanLabel(k.name, 'Colour').slice(0, 24), hex: k.hex.toLowerCase() });
  }
  const unavail = Array.isArray(c.unavail) ? c.unavail.filter((u) => typeof u === 'string' && /^(men|women)\|[\w-]+\|[\w]+$/.test(u)).slice(0, 2000) : [];
  return { colors, unavail };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const ok = passwordOk(body.password);
  if (ok === null) return send(res, 500, { error: 'ADMIN_PASSWORD is not set on the server' });
  if (!ok) { await new Promise((r) => setTimeout(r, 600)); return send(res, 401, { error: 'Incorrect password' }); }

  const action = String(body.action || '');
  if (action === 'login') return send(res, 200, { ok: true });

  const product = String(body.product || '');
  if (!PRODUCTS.includes(product)) return send(res, 400, { error: 'Unknown product' });

  try {
    if (action === 'addDesign') {
      const m = /^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(String(body.dataUrl || ''));
      if (!m) return send(res, 400, { error: 'Please upload a PNG, JPG or WebP image' });
      const buf = Buffer.from(m[2], 'base64');
      if (buf.length > MAX_IMAGE_BYTES) return send(res, 413, { error: 'Image is too large' });
      const count = (await listBlobsFor(product)).length;
      if (count >= MAX_DESIGNS) return send(res, 400, { error: 'Design limit reached' });
      const id = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const label = cleanLabel(body.label, 'Design ' + (count + 1));
      const theme = cleanTheme(body.theme);
      const src = await putImage(fileName(product, id, label, theme, EXT[m[1]]), buf, m[1]);
      await ensureMarker(product);
      return send(res, 200, { ok: true, design: { id, label, theme, src } });
    }

    if (action === 'deleteDesign') {
      const id = String(body.id || '');
      const hit = (await listDesigns(product)).find((d) => d.id === id);
      if (!hit) return send(res, 404, { error: 'Design not found' });
      for (const f of await filesForId(product, id)) await deleteByUrl(f.url);
      return send(res, 200, { ok: true });
    }

    if (action === 'setTheme') {
      const id = String(body.id || '');
      const theme = cleanTheme(body.theme);
      const hit = (await listDesigns(product)).find((d) => d.id === id);
      if (!hit) return send(res, 404, { error: 'Design not found' });
      if (hit.theme === theme) return send(res, 200, { ok: true, design: { id, label: hit.label, theme, src: hit.src } });
      const ext = hit.path.split('.').pop();
      const label = hit.label || 'Design';
      const src = await copyBlob(hit.src, fileName(product, id, label, theme, ext));
      await deleteByUrl(hit.src);
      return send(res, 200, { ok: true, design: { id, label, theme, src } });
    }

    if (action === 'saveConfig') {
      if (product !== 'tshirt') return send(res, 400, { error: 'Only the t-shirt page has settings' });
      const cfg = validConfig(body.config);
      if (!cfg) return send(res, 400, { error: 'Invalid settings' });
      const updatedAt = Date.now();
      await writeJson(configPath(product), { updatedAt, ...cfg });
      await ensureMarker(product);
      return send(res, 200, { ok: true, updatedAt });
    }

    return send(res, 400, { error: 'Unknown action' });
  } catch (e) {
    console.error('admin action failed', action, e);
    return send(res, 500, { error: 'Storage error. Check that a Blob store is connected to this project.' });
  }
}
