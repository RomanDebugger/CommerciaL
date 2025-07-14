import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/app/lib/jwt';
export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  if(pathname === '/'){
    return NextResponse.redirect(new URL('/home',req.url));
  }

  if (pathname.startsWith('/seller')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/business', req.url));
    }

    try {
      const decoded = await verifyJwt(token);
      if (decoded?.role !== 'SELLER') {
        return NextResponse.redirect(new URL('/home', req.url));
      }
    } catch (_err) {
      return NextResponse.redirect(new URL('/auth/business', req.url));
    }
  }
  if (pathname.startsWith('/buyer')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    try {
      const decoded = await verifyJwt(token);
      if (decoded?.role !== 'BUYER') {
        return NextResponse.redirect(new URL('/home', req.url));
      }
    } catch (_err) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  if (pathname.startsWith('/home')) {
    if (token) {
      try {
        const decoded = await verifyJwt(token);
        if (decoded?.role === 'SELLER') {
          return NextResponse.redirect(new URL('/seller', req.url));
        }
      } catch (_err) {
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/home',
    '/home/:path*',
    '/seller',
    '/seller/:path*',
    '/buyer',
    '/buyer/:path*',
  ],
};