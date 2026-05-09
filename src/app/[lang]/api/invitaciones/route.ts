import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getAllInvitaciones, createInvitacion } from '@/lib/invitaciones';
import { invitacionInputSchema } from '@/lib/validators';

export async function GET() {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const invitaciones = await getAllInvitaciones();
    return NextResponse.json({ success: true, data: invitaciones });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al obtener invitaciones' },
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
    const validation = invitacionInputSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const invitacion = await createInvitacion(validation.data);
    return NextResponse.json({ success: true, data: invitacion }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al crear invitación' },
      { status: 500 }
    );
  }
}