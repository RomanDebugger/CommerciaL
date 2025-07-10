import { cookies } from 'next/headers';
import { verifyJwt } from './jwt';
export async function getUserFromToken() {
  const token = (await cookies()).get('token')?.value;
  console.log(token);
  if (!token) return null;

  try {
    const user = await verifyJwt(token);
    console.log(user);
    return user;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}
