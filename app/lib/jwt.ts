import { SignJWT, jwtVerify } from 'jose';
import type { JwtPayload } from '@/app/types/auth';

const encoder = new TextEncoder();
const secret = encoder.encode(process.env.JWT_SECRET!);

export async function signJwt(payload: JwtPayload): Promise<string> {
  const { id,role } = payload;
  return new SignJWT({ role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .setSubject(id)
    .sign(secret);
}

export async function verifyJwt(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, secret);
  return {
    id : payload.sub as string,
    role :payload.role as 'BUYER' | 'SELLER'
  }
}
