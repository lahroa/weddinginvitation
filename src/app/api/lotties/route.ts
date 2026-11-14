import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const directory = path.join(process.cwd(), 'public', 'lottie');
    const filenames = await readdir(directory);
    const animations = filenames
      .filter((filename) => filename.toLowerCase().endsWith('.json'))
      .sort((a, b) => a.localeCompare(b))
      .map((filename) => ({
        name: filename,
        url: `/lottie/${encodeURIComponent(filename)}`,
      }));

    return NextResponse.json({ success: true, data: { animations } });
  } catch (error) {
    console.error('Error al listar animaciones Lottie locales:', error);
    return NextResponse.json(
      { success: false, error: 'No se pudo cargar la lista de animaciones Lottie.' },
      { status: 500 },
    );
  }
}
