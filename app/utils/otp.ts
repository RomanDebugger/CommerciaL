import bcrypt from 'bcrypt';

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 8);
}

export function verifyOtp(raw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(raw, hash);
}