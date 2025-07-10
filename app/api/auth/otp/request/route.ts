import { generateOtp, hashOtp } from '@/app/utils/otp';
import { prisma } from '@/app/lib/prisma';
import { sendOtpEmail } from '@/app/lib/mail/otpmail';
import { hashPassword}  from '@/app/utils/auth'
export async function POST(req: Request) {
  try {
    const { email, purpose, password, role } = await req.json();
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (purpose === 'SIGNUP') {
      if (existingUser) return new Response('User already exists', { status: 400 });

      const code = generateOtp();
      const codeHash = await hashOtp(code);

      await prisma.user.create({
        data: {
          email,
          password: await hashPassword(password),
          role,
          isVerified: false,
          otps: {
            create: {
              codeHash,
              purpose,
              expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
          },
        },
      });
      
      await sendOtpEmail(email, code);
      return new Response('OTP sent');
    }

    if (!existingUser) return new Response('User not found', { status: 404 });
    if (!existingUser.isVerified) return new Response('Account not verified', { status: 403 });

    const recent = await prisma.otp.findFirst({
      where: {
        userId: existingUser.id,
        purpose,
        createdAt: { gte: new Date(Date.now() - 60_000) },
      },
    });

    if (recent) return new Response('Wait before requesting another OTP', { status: 429 });

    const code = generateOtp();
    const codeHash = await hashOtp(code);

    await prisma.otp.create({
      data: {
        userId: existingUser.id,
        purpose,
        codeHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await sendOtpEmail(email, code);
    return new Response('OTP sent');
  } catch (err) {
    console.error('OTP error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

