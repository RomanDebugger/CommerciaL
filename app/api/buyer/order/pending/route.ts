import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';

export async function GET() {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        buyerProfile: {
          userId: user.id,
        },
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
    });
      

    const response = orders.map(order => ({
      id: order.id,
      amount: order.total,
      createdAt: order.createdAt,
      items: order.items, 
    }));

    return NextResponse.json(response);
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to fetch pending payments' }, { status: 500 });
  }
}
