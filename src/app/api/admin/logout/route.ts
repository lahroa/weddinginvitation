import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }
    
    const token = await createAdminSession();
    
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Cambiado de 'strict' a 'lax' para mejor compatibilidad
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}