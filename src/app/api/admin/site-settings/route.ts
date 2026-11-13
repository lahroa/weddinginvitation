import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { verifyAdminSession } from '@/lib/auth';
import sql from '@/lib/db';
import { locales } from '@/i18n/config';

const DEFAULT_IMAGE = '/images/og-image.jpg';
const DEFAULT_SHARE_MESSAGE_ES = 'Hola [nombre]\n\nDeseamos compartir contigo esta invitación a un día muy especial para nosotros. Deseamos que nos puedas acompañar este día. Encontraras más detalles en el sitio web que te dejo abajo.\n\n[enlace]';
const DEFAULT_SHARE_MESSAGE_EN = 'Hello [nombre]\n\nWe would love to share this invitation to a very special day with you. We hope you can join us. You will find more details on the website below.\n\n[enlace]';

const settingsSchema = z.object({
  ogImageUrl: z.string().trim().min(1).max(2048).refine((value) => {
    if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) {
      return true;
    }

    try {
      return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, 'La URL debe ser una ruta local o una URL HTTP/HTTPS válida'),
  shareMessageEs: z.string().trim().min(1).max(4000),
  shareMessageEn: z.string().trim().min(1).max(4000),
});

export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const result = await sql`
      SELECT og_image_url, share_message_es, share_message_en
      FROM configuracion_sitio WHERE id = 1
    `;
    const settings = result[0] as {
      og_image_url: string;
      share_message_es: string;
      share_message_en: string;
    } | undefined;
    return NextResponse.json({
      success: true,
      data: {
        ogImageUrl: settings?.og_image_url ?? DEFAULT_IMAGE,
        shareMessages: {
          es: settings?.share_message_es ?? DEFAULT_SHARE_MESSAGE_ES,
          en: settings?.share_message_en ?? DEFAULT_SHARE_MESSAGE_EN,
        },
      },
    });
  } catch (error) {
    console.error('Error al cargar la configuración del sitio:', error);
    return NextResponse.json(
      { success: false, error: 'No se pudo cargar la configuración del sitio. Verifica que la migración de configuraciones esté aplicada.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Solicitud no válida' }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? 'Configuración no válida' },
      { status: 400 }
    );
  }

  try {
    const result = await sql`
      INSERT INTO configuracion_sitio (
        id, og_image_url, share_message_es, share_message_en, actualizado_en
      )
      VALUES (
        1, ${parsed.data.ogImageUrl}, ${parsed.data.shareMessageEs},
        ${parsed.data.shareMessageEn}, NOW()
      )
      ON CONFLICT (id) DO UPDATE
      SET og_image_url = EXCLUDED.og_image_url,
          share_message_es = EXCLUDED.share_message_es,
          share_message_en = EXCLUDED.share_message_en,
          actualizado_en = NOW()
      RETURNING og_image_url, share_message_es, share_message_en
    `;
    for (const locale of locales) {
      revalidatePath(`/${locale}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        ogImageUrl: (result[0] as { og_image_url: string }).og_image_url,
        shareMessages: {
          es: (result[0] as { share_message_es: string }).share_message_es,
          en: (result[0] as { share_message_en: string }).share_message_en,
        },
      },
    });
  } catch (error) {
    console.error('Error al guardar la configuración del sitio:', error);
    return NextResponse.json(
      { success: false, error: 'No se pudo guardar la configuración. Verifica que la migración de configuraciones esté aplicada.' },
      { status: 500 }
    );
  }
}
