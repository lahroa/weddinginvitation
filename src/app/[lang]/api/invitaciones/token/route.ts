import { NextRequest, NextResponse } from 'next/server';
import { getInvitacionByToken } from '@/lib/invitaciones';
import { getEventosByInvitacion } from '@/lib/eventos';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('t');
    
    if (!token || token.length !== 7) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 400 }
      );
    }
    
    const invitacion = await getInvitacionByToken(token.toUpperCase());
    
    if (!invitacion) {
      return NextResponse.json(
        { success: false, error: 'Invitación no encontrada o revocada' },
        { status: 404 }
      );
    }
    
    // Obtener eventos privados asignados
    const eventosPrivados = await getEventosByInvitacion(invitacion.id);
    
    return NextResponse.json({
      success: true,
      data: {
        valido: true,
        invitacion: {
          id: invitacion.id,
          token: invitacion.token,
          nombre_invitado: invitacion.nombre_invitado,
          max_acompanantes: invitacion.max_acompanantes,
          eventos: eventosPrivados,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al validar token' },
      { status: 500 }
    );
  }
}