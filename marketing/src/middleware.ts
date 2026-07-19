import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/care/dashboard', '/care/dashboard/elder', '/care/onboarding'],
};

export function middleware(req: NextRequest) {
  const hasCookie = req.cookies.has('lg_session');
  if (!hasCookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
