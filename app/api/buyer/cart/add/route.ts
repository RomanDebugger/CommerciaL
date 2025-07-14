import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';

export async function POST(req: Request) {
  const user = await getUserFromToken();
  if (!user || user.role !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { productId, quantity } = await req.json();

  if (!productId || typeof quantity !== 'number' || quantity < 1) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: user.id },
    include: { cart: true },
  });

  if (!buyer) {
    return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
  }

  const cart = buyer.cart ?? await prisma.cart.create({
    data: { buyerProfileId: buyer.id },
  });

  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });

  return NextResponse.json({ success: true });
}
