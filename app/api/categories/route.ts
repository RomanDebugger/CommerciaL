import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('[GET /api/categories]', error);
    return new NextResponse('Failed to fetch categories', { status: 500 });
  }
}
