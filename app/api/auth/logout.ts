import { NextResponse } from 'next/server';

export async function POST() {
  const res = new NextResponse(JSON.stringify({ success: true }), { status: 200 });

  res.cookies.set('token', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });

  return res;
}
