import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { updateInvitacion, deleteInvitacion } from '@/lib/invitaciones';

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
    const invitacion = await updateInvitacion(params.id, body);
    
    if (!invitacion) {
      return NextResponse.json(
        { success: false, error: 'Invitación no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: invitacion });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar invitación' },
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
    
    const deleted = await deleteInvitacion(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Invitación no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar invitación' },
      { status: 500 }
    );
  }
}