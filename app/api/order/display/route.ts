import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUserFromToken();
  if (!user || user.role !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: user.id },
  });

  if (!buyer) {
    return NextResponse.json({ error: 'Buyer profile not found' }, { status: 404 });
  }

  const orders = await prisma.order.findMany({
    where: {
      buyerProfileId: buyer.id,
      NOT: { status: 'PENDING' },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      subOrders: true,
    },
  });

  return NextResponse.json(orders);
}
