import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getAllEventos, createEvento, getEventosPublicos } from '@/lib/eventos';
import { eventoInputSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    
    if (isAdmin) {
      const eventos = await getAllEventos();
      return NextResponse.json({ success: true, data: eventos });
    }
    
    // Público: solo eventos públicos
    const eventos = await getEventosPublicos();
    return NextResponse.json({ success: true, data: eventos });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener eventos' },
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
    const validation = eventoInputSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const evento = await createEvento(validation.data);
    return NextResponse.json({ success: true, data: evento }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al crear evento' },
      { status: 500 }
    );
  }
}