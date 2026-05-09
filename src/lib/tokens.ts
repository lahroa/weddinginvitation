import sql from './db';

const CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateToken(): string {
  let token = '';
  for (let i = 0; i < 7; i++) {
    token += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return token;
}

export async function generateUniqueToken(): Promise<string> {
  let token: string;
  let exists: boolean;
  
  do {
    token = generateToken();
    const result = await sql`
      SELECT EXISTS(SELECT 1 FROM invitaciones WHERE token = ${token}) as existe
    `;
    exists = result[0]?.existe || false;
  } while (exists);
  
  return token;
}