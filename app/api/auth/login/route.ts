import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { signJwt } from '@/app/lib/jwt';
import { setAuthCookie } from '@/app/lib/cookie';
import { verifyPassword } from '@/app/utils/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const match = await verifyPassword(password, user.password);
  if (!match) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const token = signJwt({ id: user.id, role: user.role });
  const res = NextResponse.json({
  success: true,
  user: {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }
});
  setAuthCookie(res, await token);

  return res;
}
