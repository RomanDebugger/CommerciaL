import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';

export async function DELETE(req: Request) {
  const user = await getUserFromToken();
  if (!user || user.role !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cartItemId } = await req.json();
  if (!cartItemId) {
    return NextResponse.json({ error: 'Missing cartItemId' }, { status: 400 });
  }

  const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: user.id },
    include: { cart: true },
  });

  if (!buyer || !buyer.cart) {
    return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!item || item.cartId !== buyer.cart.id) {
    return NextResponse.json({ error: 'Invalid cart item' }, { status: 403 });
  }

  await prisma.cartItem.delete({where: { id: cartItemId },});

  return NextResponse.json({ success: true });
}
