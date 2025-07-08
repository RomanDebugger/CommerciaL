import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/app/lib/jwt';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Handle /seller routes (requires seller auth)
  if (pathname.startsWith('/seller')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    try {
      const decoded = await verifyJwt(token);
      if (decoded?.role !== 'SELLER') {
        return NextResponse.redirect(new URL('/home', req.url));
      }
    } catch (err) {
      console.error('JWT verification failed:', err);
      return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  // Handle /home restriction for sellers only
  if (pathname.startsWith('/home')) {
    if (token) {
      try {
        const decoded = await verifyJwt(token);
        if (decoded?.role === 'SELLER') {
          return NextResponse.redirect(new URL('/seller', req.url));
        }
      } catch (err) {
        console.error('JWT verification failed:', err);
        // Allow access to home even if token is invalid
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home',
    '/home/:path*',
    '/seller',
    '/seller/:path*',
  ],
};