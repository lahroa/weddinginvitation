import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_PASSWORD || 'cambia-esta-contraseña-secreta'
);

function getSecretKey() {
  return new TextEncoder().encode(
    process.env.ADMIN_PASSWORD || 'admin2026'
  );
}

export async function createAdminSession(): Promise<string> {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecretKey());
  
  return token;
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    
    if (!session?.value) return false;
    
    await jwtVerify(session.value, getSecretKey());
    return true;
  } catch {
    return false;
  }
}