import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/app/lib/prisma';
import { signJwt } from '@/app/lib/jwt';
import { setAuthCookie } from '@/app/lib/cookie';

export async function POST(req: Request) {
  const { phone, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user || !user.password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

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
