// HMAC signing for the access cookie, using Web Crypto (works in both the
// Edge middleware runtime and Node.js — no Buffer, no Node-only crypto).
export async function signGranted(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('granted'));
  return Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const ACCESS_COOKIE_NAME = 'trail_access';
