import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';
import { sendOrderConfirmationEmail } from '@/app/lib/mail/orderConfirmed';

export async function POST(req: NextRequest) {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { buyerProfile: { include: { user: true } }, subOrders: true },
    });

    if (!order || order.buyerProfile.userId !== user.id) {
      return NextResponse.json({ error: 'Order not found or not yours' }, { status: 404 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PROCESSING',
        subOrders: {
          updateMany: {
            where: {},
            data: { status: 'PROCESSING' },
          },
        },
      },
    });

    await sendOrderConfirmationEmail(order.buyerProfile.user.email, orderId, order.total.toString());

    return NextResponse.json({ success: true });
  } catch (_err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
