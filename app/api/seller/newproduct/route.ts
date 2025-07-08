import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      stock,
      sellerId,
      categoryId,
      tags,
    } = body;

    if (!sellerId || !name || price === undefined || stock === undefined) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    const parsedPrice = typeof price === 'string' ? parseFloat(price) : price;
    const parsedStock = typeof stock === 'string' ? parseInt(stock, 10) : stock;

    const formattedTags =
      typeof tags === 'string'
        ? tags
            .split(',')
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0)
        : Array.isArray(tags)
        ? tags
        : [];

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parsedPrice,
        stock: parsedStock,
        sellerProfile: {
          connect: { userId: sellerId },
        },
        category: categoryId
          ? {
              connect: { id: categoryId },
            }
          : undefined,
        tags: formattedTags,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error('Product creation error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
