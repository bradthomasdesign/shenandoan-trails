import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signGranted, ACCESS_COOKIE_NAME } from '@/lib/access';

export async function middleware(req: NextRequest) {
  const secret = process.env.ACCESS_COOKIE_SECRET || '';
  const expected = await signGranted(secret);
  const cookie = req.cookies.get(ACCESS_COOKIE_NAME)?.value;

  if (cookie === expected) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/access';
  url.search = '';
  url.searchParams.set('next', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!access|api/access|_next/static|_next/image|favicon.ico).*)'],
};
