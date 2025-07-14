import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';

export async function POST() {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== 'BUYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const buyer = await prisma.buyerProfile.findUnique({
      where: { userId: user.id },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: {
                  include: { sellerProfile: true },
                },
              },
            },
          },
        },
      },
    });

    if (!buyer || !buyer.cart || buyer.cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const cart = buyer.cart;
    const cartItems = cart.items;

    const sellerMap: Record<string, typeof cartItems> = {};
    for (const item of cartItems) {
      const sellerId = item.product.sellerProfileId;
      if (!sellerMap[sellerId]) sellerMap[sellerId] = [];
      sellerMap[sellerId].push(item);
    }

    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          buyerProfileId: buyer.id,
          total,
          items: cartItems.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          status: 'PENDING',
        },
      });

      for (const [sellerId, items] of Object.entries(sellerMap)) {
        await tx.subOrder.create({
          data: {
            orderId: newOrder.id,
            sellerProfileId: sellerId,
            total: items.reduce(
              (sum, item) => sum + Number(item.product.price) * item.quantity,
              0
            ),
            items: items.map((item) => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
            status: 'PENDING',
          },
        });
      }
      for (const item of cartItems) {
        const currentStock = item.product.stock;
        const quantity = item.quantity;

        if (currentStock < quantity) {
          throw new Error(`Insufficient stock for product ${item.product.name}`);
        }

        await tx.product.update({
          where: {
            id: item.product.id,
            stock: { gte: quantity },
          },
          data: {
            stock: {
              decrement: quantity,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json({
      message: 'Order placed successfully',
      orderId: order.id,
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
