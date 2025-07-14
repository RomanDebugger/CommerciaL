import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';

type OrderItem = {
  productId: string;
  quantity: number;
  name: string;
};

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!seller) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    const sellerProfileId = seller.id;

    const daily = await prisma.subOrder.groupBy({
      by: ['createdAt'],
      where: { sellerProfileId },
      _sum: { total: true },
    });

    const dailyEarnings = daily
      .map((entry) => ({
        date: entry.createdAt.toISOString().slice(0, 10),
        total: Number(entry._sum.total || 0),
      }))
      .reduce((acc, curr) => {
        acc[curr.date] = (acc[curr.date] || 0) + curr.total;
        return acc;
      }, {} as Record<string, number>);

    const orders = await prisma.subOrder.findMany({
      where: { sellerProfileId },
      select: { total: true, createdAt: true },
    });

    const monthlyEarnings: Record<string, number> = {};
    const yearlyEarnings: Record<string, number> = {};

    for (const order of orders) {
      const month = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(order.createdAt);
      const year = order.createdAt.getFullYear().toString();

      monthlyEarnings[month] = (monthlyEarnings[month] || 0) + Number(order.total);
      yearlyEarnings[year] = (yearlyEarnings[year] || 0) + Number(order.total);
    }

    const topProductsRaw = await prisma.subOrder.findMany({
      where: { sellerProfileId },
      select: { items: true },
    });

    const productSales: Record<string, number> = {};

    for (const order of topProductsRaw) {
      const maybeItems = order.items;

      if (Array.isArray(maybeItems)) {
        const items = maybeItems as OrderItem[];

        for (const item of items) {
          if (item && item.name && typeof item.quantity === 'number') {
            productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
          }
        }
      }
    }

    const topProducts = Object.entries(productSales)
      .map(([name, sold]) => ({ name, sold }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return NextResponse.json({
      dailyEarnings: Object.entries(dailyEarnings).map(([date, total]) => ({ date, total })),
      monthlyEarnings: Object.entries(monthlyEarnings).map(([date, total]) => ({ date, total })),
      yearlyEarnings: Object.entries(yearlyEarnings).map(([date, total]) => ({ date, total })),
      topProducts,
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
