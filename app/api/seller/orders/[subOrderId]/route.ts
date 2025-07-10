import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import type { OrderStatus } from '@prisma/client';

export async function PATCH(req: Request, { params }: { params: { subOrderId: string } }) {
  const { subOrderId } = params;
  const body = await req.json();
  const { newStatus } = body;

  if (!newStatus) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 });
  }

  try {
    const updatedSubOrder = await prisma.subOrder.update({
      where: { id: subOrderId },
      data: { status: newStatus },
    });

    const siblingSubOrders = await prisma.subOrder.findMany({
      where: { orderId: updatedSubOrder.orderId },
    });

    const derivedStatus = deriveOrderStatus(siblingSubOrders.map((s) => s.status as OrderStatus));

    await prisma.order.update({
      where: { id: updatedSubOrder.orderId },
      data: { status: derivedStatus },
    });

    return NextResponse.json({ success: true, subOrder: updatedSubOrder });
  } catch (err) {
    console.error('Status update failed:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

function deriveOrderStatus(statuses: OrderStatus[]): OrderStatus {
  if (statuses.every((s) => s === 'DELIVERED')) return 'DELIVERED';
  if (statuses.every((s) => s === 'CANCELLED')) return 'CANCELLED';
  if (statuses.some((s) => s === 'IN_TRANSIT')) return 'IN_TRANSIT';
  if (statuses.some((s) => s === 'SHIPPED')) return 'SHIPPED';
  if (statuses.some((s) => s === 'PROCESSING')) return 'PROCESSING';
  return 'PROCESSING';
}
