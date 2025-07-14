import { getUserFromToken } from "@/app/lib/auth";
import { prisma } from '@/app/lib/prisma'
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserFromToken();
  if (!user || user.role !== 'BUYER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await prisma.buyerProfile.findUnique({ where: { userId: user.id } });
  return NextResponse.json(profile);
}

export async function PATCH(req: Request) {
  const user = await getUserFromToken();
  if (!user || user.role !== 'BUYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { fullName,phoneNumber, gender, dob, address, pincode } = body;

  const updated = await prisma.buyerProfile.update({
    where: { userId: user.id },
    data: { fullName,phoneNumber, gender, dob: dob ? new Date(dob) : null, address, pincode },
  });

  return NextResponse.json(updated);
}
