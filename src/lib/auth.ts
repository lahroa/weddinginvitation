import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

function getSecretKey(): Uint8Array | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? new TextEncoder().encode(secret) : null;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD &&
    getSecretKey()
  );
}

export async function createAdminSession(): Promise<string> {
  const secretKey = getSecretKey();
  if (!secretKey) {
    throw new Error('ADMIN_SESSION_SECRET must be set to at least 32 characters');
  }

  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
  
  return token;
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    const secretKey = getSecretKey();
    
    if (!session?.value || !secretKey) return false;
    
    const { payload } = await jwtVerify(session.value, secretKey);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}