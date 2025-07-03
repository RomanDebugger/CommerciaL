import { generateOtp, hashOtp } from '@/app/utils/otp';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
  try {
    const { phone, purpose } = await req.json();
    console.log('Payload:', { phone, purpose });

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const code = generateOtp();
    const codeHash = await hashOtp(code);
    await prisma.otp.create({
      data: {
        userId: user.id,
        purpose,
        codeHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`OTP saved. Sent ${code} to ${phone}`);
    return new Response('OTP sent');
  } catch (err) {
    console.error('Error in OTP request:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
