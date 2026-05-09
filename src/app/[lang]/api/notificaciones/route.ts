import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getInvitacionByToken } from '@/lib/invitaciones';
import { 
  getNotificaciones, 
  getNotificacionesParaInvitacion, 
  createNotificacion,
  getAllNotificaciones 
} from '@/lib/notificaciones';
import { notificacionInputSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const isAdmin = await verifyAdminSession();
    
    // Admin: ver todas
    if (isAdmin) {
      const notificaciones = await getAllNotificaciones();
      return NextResponse.json({ success: true, data: notificaciones });
    }
    
    // Si no hay token: solo notificaciones públicas
    if (!token) {
      const notificaciones = await getNotificaciones('todos');
      return NextResponse.json({ success: true, data: notificaciones });
    }
    
    // Con token: notificaciones personalizadas
    const invitacion = await getInvitacionByToken(token);
    if (!invitacion) {
      const notificaciones = await getNotificaciones('todos');
      return NextResponse.json({ success: true, data: notificaciones });
    }
    
    const notificaciones = await getNotificacionesParaInvitacion(
      invitacion.id,
      invitacion.eventos
    );
    
    return NextResponse.json({ success: true, data: notificaciones });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener notificaciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const validation = notificacionInputSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const notificacion = await createNotificacion(validation.data);
    return NextResponse.json({ success: true, data: notificacion }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al crear notificación' },
      { status: 500 }
    );
  }
}