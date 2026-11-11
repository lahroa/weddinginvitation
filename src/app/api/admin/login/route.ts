import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession, isAdminAuthConfigured } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { success: false, error: 'La autenticación de administración no está configurada' },
      { status: 503 }
    );
  }

  let credentials: unknown;
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Solicitud no válida' },
      { status: 400 }
    );
  }

  if (!credentials || typeof credentials !== 'object') {
    return NextResponse.json(
      { success: false, error: 'Solicitud no válida' },
      { status: 400 }
    );
  }

  const { username, password } = credentials as {
    username?: unknown;
    password?: unknown;
  };
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { success: false, error: 'Usuario o contraseña incorrectos' },
      { status: 401 }
    );
  }

  try {
    const token = await createAdminSession();
    const response = NextResponse.json({ success: true });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
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