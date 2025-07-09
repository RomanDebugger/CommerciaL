import { prisma } from '@/app/lib/prisma';
import { getUserFromToken } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import { error } from 'console';

export async function PATCH(req : Request){
    const user = await getUserFromToken();
    if(!user || user.role !== 'BUYER'){
        return NextResponse.json({error:'Unauthorized'},{ status: 401 });
    }
    const { cartItemId,quantity } = await req.json();
    const buyer = await prisma.buyerProfile.findUnique({
    where: { userId: user.id },
    include: { cart: true },
    });
    if (!buyer || !buyer.cart) {
        return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }
    const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    });
    if (!item || item.cartId !== buyer.cart.id) {
        return NextResponse.json({ error: 'Invalid cart item' }, { status: 403 });
    }
    await prisma.cartItem.update({where: { id: cartItemId },data :{ quantity }});

    return NextResponse.json({ success: true });
}