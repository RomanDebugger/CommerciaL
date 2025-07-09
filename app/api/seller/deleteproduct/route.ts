import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  const user = await getUserFromToken();
  if (!user || user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId } = await req.json();
  if (typeof productId !== 'string') {
    return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
  }

  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
  });

  if (!seller) {
    return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.sellerProfileId !== seller.id) {
    return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 403 });
  }

  await prisma.cartItem.deleteMany({
    where: { productId },
  });

  await prisma.product.delete({
    where: { id: productId },
  });

  return NextResponse.json({ success: true });
}
