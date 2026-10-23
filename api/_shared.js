import crypto from 'node:crypto';

export const PRODUCTS = ['blouse', 'tote', 'tshirt'];
export const dataPath = (product) => `data/${product}.json`;

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

export function emptyDoc() {
  return { version: 1, updatedAt: 0, designs: [], config: null };
}
