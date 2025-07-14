import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { OrderStatus } from '@prisma/client';


export async function PATCH(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  const { subOrderId } = params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { newStatus } = body;

  if (!newStatus || !Object.values(OrderStatus).includes(newStatus)) {
    return NextResponse.json({ error: 'Invalid or missing status' }, { status: 400 });
  }

  try {
    const updatedSubOrder = await prisma.subOrder.update({
      where: { id: subOrderId },
      data: { status: newStatus },
    });

    const siblingSubOrders = await prisma.subOrder.findMany({
      where: { orderId: updatedSubOrder.orderId },
    });

    const derivedStatus = deriveOrderStatus(
      siblingSubOrders.map((s) => s.status as OrderStatus)
    );

    await prisma.order.update({
      where: { id: updatedSubOrder.orderId },
      data: { status: derivedStatus },
    });

    return NextResponse.json({ success: true, subOrder: updatedSubOrder });
  } catch (_err) {
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