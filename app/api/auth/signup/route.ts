import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/app/lib/prisma';
import { signJwt } from '@/app/lib/jwt';
import { setAuthCookie } from '@/app/lib/cookie';

export async function POST(req: Request) {
  const { phone, password, role } = await req.json();

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
  return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: { phone, password: hashed, role },
  });

  if (role === 'BUYER') {
    await prisma.buyerProfile.create({
      data: {
        userId: user.id,
        cart: { create: { items: {} } },
      },
    });
  } else {
    await prisma.sellerProfile.create({
      data: { userId: user.id, shopName: '', gstNumber: '' },
    });
  }

  const token = signJwt({ id: user.id, role });
  const res = NextResponse.json({ success: true });
  setAuthCookie(res, token);

  return res;
}
