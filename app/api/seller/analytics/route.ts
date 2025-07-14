import { getUserFromToken } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserFromToken();
  if (!user || user.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
    include: {
      products: true,
      subOrders: true,
    },
  });

  if (!seller) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

  const totalRevenue = seller.subOrders.reduce((sum, o) => sum + parseFloat(o.total.toString()), 0);
  const totalOrders = seller.subOrders.length;
  const totalProducts = seller.products.length;

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    totalProducts,
    totalSales: totalRevenue, 
  });
}
