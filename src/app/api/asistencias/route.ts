import { NextRequest, NextResponse } from 'next/server';
import { getInvitacionByToken } from '@/lib/invitaciones';
import { registrarAsistencia, getAsistenciaByInvitacion } from '@/lib/asistencias';
import { asistenciaInputSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = asistenciaInputSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { token, evento_id, asistira, num_acompanantes, notas } = validation.data;
    
    // Validar token
    const invitacion = await getInvitacionByToken(token);
    if (!invitacion) {
      return NextResponse.json(
        { success: false, error: 'Invitación no válida' },
        { status: 404 }
      );
    }
    
    // Verificar acceso al evento
    const tieneAcceso = invitacion.eventos.some(id => id === evento_id);
    if (!tieneAcceso) {
      return NextResponse.json(
        { success: false, error: 'No tienes acceso a este evento' },
        { status: 403 }
      );
    }
    
    await registrarAsistencia({
      invitacion_id: invitacion.id,
      evento_id,
      asistira,
      num_acompanantes,
      notas,
    });
    
    return NextResponse.json({
      success: true,
      data: { message: 'Asistencia registrada correctamente' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al registrar asistencia';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token requerido' },
        { status: 400 }
      );
    }
    
    const invitacion = await getInvitacionByToken(token);
    if (!invitacion) {
      return NextResponse.json(
        { success: false, error: 'Invitación no válida' },
        { status: 404 }
      );
    }
    
    const asistencias = await getAsistenciaByInvitacion(invitacion.id);
    return NextResponse.json({ success: true, data: asistencias });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener asistencias' },
      { status: 500 }
    );
  }
}