// Storage layer: Vercel Blob (public store). Small JSON documents + design images.
import { put, del, list } from '@vercel/blob';

// Find a blob by its exact pathname and return the parsed JSON (or null).
export async function readJson(pathname) {
  const { blobs } = await list({ prefix: pathname, limit: 5 });
  const hit = blobs.find((b) => b.pathname === pathname);
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
    cacheControlMaxAge: 60, // lowest the platform allows, so edits show up within a minute
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
