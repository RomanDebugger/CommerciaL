import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const user = await getUserFromToken();

  if (!user || user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
  });

  if (!sellerProfile) {
    return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
  }

  const subOrders = await prisma.subOrder.findMany({
    where: {
      sellerProfileId: sellerProfile.id,
      order: {
        status: { not: 'PENDING' }, 
      },
    },
    include: {
      order: {
        include: {
          buyerProfile: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ subOrders });
}
