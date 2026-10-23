// Storage layer: Vercel Blob (public store).
// Designs are the image files themselves; the list is built from the blob listing,
// so several uploads at once can never overwrite each other.
import { put, del, list } from '@vercel/blob';

// All blobs whose pathname starts with `prefix` (follows pagination).
export async function listBlobs(prefix) {
  const out = [];
  let cursor;
  do {
    const r = await list({ prefix, limit: 1000, cursor });
    out.push(...r.blobs.map((b) => ({ pathname: b.pathname, url: b.url })));
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out;
}

export async function readJson(pathname) {
  const hit = (await listBlobs(pathname)).find((b) => b.pathname === pathname);
  if (!hit) return null;
  const r = await fetch(hit.url + (hit.url.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store' });
  if (!r.ok) throw new Error('Could not read ' + pathname + ' (' + r.status + ')');
  return await r.json();
}

export async function writeJson(pathname, obj) {
  await put(pathname, JSON.stringify(obj), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

// Upload an image and return its public URL.
export async function putImage(pathname, buffer, contentType) {
  const r = await put(pathname, buffer, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365, // images never change once uploaded
  });
  return r.url;
}

export async function deleteByUrl(url) {
  await del(url);
}
