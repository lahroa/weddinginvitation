import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';

export async function GET() {
  const authenticated = await verifyAdminSession();
  return NextResponse.json(
    { success: authenticated },
    { status: authenticated ? 200 : 401 }
  );
}
