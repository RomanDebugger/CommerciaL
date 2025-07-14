import { getUserFromToken } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUserFromToken();
  if (!user || user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json(profile);
}

export async function PATCH(req: Request) {
  const user = await getUserFromToken();
  if (!user || user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    shopName,
    gstNumber,
    description,
    contactEmail,
    contactPhone,
    address,
    pincode,
    rating,
  } = body;

  const updated = await prisma.sellerProfile.update({
    where: { userId: user.id },
    data: {
      shopName,
      gstNumber,
      description,
      contactEmail,
      contactPhone,
      address,
      pincode,
      rating: rating ? parseFloat(rating) : null,
    },
  });

  return NextResponse.json(updated);
}
