import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';

export async function GET() {
  const user = await getUserFromToken();
  if (!user || user.role !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: user.id },
    include: {
      cart: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!buyer || !buyer.cart) {
    return NextResponse.json({ cart: [] });
  }

  return NextResponse.json({ cart: buyer.cart.items });
}
