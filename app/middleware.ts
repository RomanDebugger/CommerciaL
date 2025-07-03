import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/app/lib/jwt';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    verifyJwt(token); // throws if invalid
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/seller/:path*'],
};