/**
 * Extract the object path from a Supabase Storage public URL.
 * Returns null if the URL doesn't reference the given bucket.
 */
export function pathFromPublicUrl(
  url: string | null | undefined,
  bucket: string,
): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx < 0) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

/**
 * Sanitize a filename by replacing whitespace with underscores per SPEC §4.
 */
export function sanitizeFilename(name: string): string {
  return name.replace(/\s+/g, "_");
}
