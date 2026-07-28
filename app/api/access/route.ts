import { NextResponse } from 'next/server';
import { signGranted, ACCESS_COOKIE_NAME } from '@/lib/access';

export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({ code: '' }));
  const expectedCode = process.env.TRAIL_ACCESS_CODE;

  if (!expectedCode || typeof code !== 'string' || code.trim() !== expectedCode) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  const secret = process.env.ACCESS_COOKIE_SECRET || '';
  const signed = await signGranted(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE_NAME, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  });
  return res;
}
