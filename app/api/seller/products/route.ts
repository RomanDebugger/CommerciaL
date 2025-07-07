import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
const userId = searchParams.get('sellerId')?.trim();

if (!userId) {
  return new NextResponse('Missing sellerId in query', { status: 400 });
}

const sellerProfile = await prisma.sellerProfile.findUnique({
  where: { userId },
});

if (!sellerProfile) {
  return new NextResponse('Seller profile not found', { status: 404 });
}

const products = await prisma.product.findMany({
  where: { sellerProfileId: sellerProfile.id },
  orderBy: { createdAt: 'desc' },
});


    return NextResponse.json({ products });
  } catch (err) {
    console.error('Failed to fetch seller products:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}

