import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, name, description, price, stock, categoryId, tags } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
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

    const updates: any = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined)
      updates.price = typeof price === 'string' ? parseFloat(price) : price;
    if (stock !== undefined)
      updates.stock = typeof stock === 'string' ? parseInt(stock, 10) : stock;
    if (categoryId !== undefined) updates.category = { connect: { id: categoryId } };

    if (tags !== undefined) {
      updates.tags =
        typeof tags === 'string'
          ? tags
              .split(',')
              .map((tag: string) => tag.trim().toLowerCase())
              .filter((tag: string) => tag.length > 0)
          : Array.isArray(tags)
          ? tags
          : [];
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updates,
      include: { category: true },
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (err) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
