import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLowerCase() || '';

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } },
        { category: { name: { contains: query, mode: 'insensitive' } }},
      ],
    },
    include: { category: true },
  });

  return NextResponse.json(products);
}