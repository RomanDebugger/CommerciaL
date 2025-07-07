import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, stock, sellerId } = body;

    if (!name || !price || !sellerId || stock == null)
      return new NextResponse('Missing required fields', { status: 400 });

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: sellerId },
    });

    if (!sellerProfile)
      return new NextResponse('Seller not found', { status: 404 });

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        sellerProfileId: sellerProfile.id,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error('Add product error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
    