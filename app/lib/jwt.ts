import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@/app/types/auth';

const JWT_SECRET = process.env.JWT_SECRET!;

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}