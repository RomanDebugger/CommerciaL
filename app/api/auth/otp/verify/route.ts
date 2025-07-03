import { prisma } from '@/app/lib/prisma';
import { verifyOtp } from '@/app/utils/otp';
import { signJwt } from '@/app/lib/jwt';
import { setAuthCookie } from '@/app/lib/cookie';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { phone, code, purpose } = await req.json();

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return new Response('User not found', { status: 404 });

  const otp = await prisma.otp.findFirst({
    where: { userId: user.id, purpose },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp || otp.expiresAt < new Date()) return new Response('OTP expired', { status: 400 });

  const match = await verifyOtp(code, otp.codeHash);
  if (!match) return new Response('Wrong OTP', { status: 401 });

  const token = signJwt({ id: user.id, role: user.role });
  const res = NextResponse.json({
  success: true,
  user: {
    id: user.id,
    phone: user.phone,
    role: user.role,
    email: user.email || 'Please provide email',
    createdAt: user.createdAt
  }
});

  setAuthCookie(res, token);

  return res;
}
