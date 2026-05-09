import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

// NOTA: Necesitarás instalar jose: npm install jose
// Lo agregaré al package.json en la siguiente actualización

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_PASSWORD || 'cambia-esta-contraseña-secreta'
);

export async function createAdminSession(): Promise<string> {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET);
  
  return token;
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session?.value) return false;
  
  try {
    await jwtVerify(session.value, SECRET);
    return true;
  } catch {
    return false;
  }
}