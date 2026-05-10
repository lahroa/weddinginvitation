import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getEventoById, updateEvento, deleteEvento } from '@/lib/eventos';
import { eventoInputSchema } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const evento = await getEventoById(params.id);
    if (!evento) {
      return NextResponse.json(
        { success: false, error: 'Evento no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: evento });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener evento' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const evento = await updateEvento(params.id, body);
    
    if (!evento) {
      return NextResponse.json(
        { success: false, error: 'Evento no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: evento });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar evento' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const deleted = await deleteEvento(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Evento no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar evento' },
      { status: 500 }
    );
  }
}