import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { NextRequest } from 'next/server';
import { defaultLocale, locales } from '@/i18n/config';
import sql from '@/lib/db';
import { getInvitacionByToken } from '@/lib/invitaciones';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const COUPLE_NAMES = process.env.NEXT_PUBLIC_NOMBRES_NOVIOS || 'Luis & Daniela';
const DEFAULT_BACKGROUND_IMAGE = '/images/og-image.jpg';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const locale = locales.find((value) => value === url.searchParams.get('lang')) ?? defaultLocale;
  const t = await getTranslations({ locale, namespace: 'invitationImage' });
  const token = url.searchParams.get('invitacion')?.trim().toUpperCase();
  const invitation = token ? await getInvitacionByToken(token) : null;
  let backgroundImage = DEFAULT_BACKGROUND_IMAGE;

  try {
    const settings = await sql`
      SELECT og_image_url FROM configuracion_sitio WHERE id = 1
    `;
    backgroundImage =
      (settings[0] as { og_image_url: string } | undefined)?.og_image_url ??
      DEFAULT_BACKGROUND_IMAGE;
  } catch (error) {
    console.error('No se pudo cargar la imagen de fondo Open Graph configurada:', error);
  }

  const backgroundUrl = new URL(backgroundImage, url.origin).toString();
  const [playfairFont, monteCarloFont] = await Promise.all([
    fetch(new URL('/fonts/playfair-latin.ttf?v=2', url.origin), { cache: 'no-store' }).then(
      async (response) => {
        if (!response.ok) throw new Error('No se pudo cargar la fuente Playfair');
        return response.arrayBuffer();
      },
    ),
    fetch(new URL('/fonts/montecarlo-latin.ttf?v=2', url.origin), { cache: 'no-store' }).then(
      async (response) => {
        if (!response.ok) throw new Error('No se pudo cargar la fuente MonteCarlo');
        return response.arrayBuffer();
      },
    ),
  ]);

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#061D3B',
          color: '#fff8e8',
          fontFamily: 'Playfair',
        }}
      >
        <img
          src={backgroundUrl}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 54,
            left: 72,
            fontSize: 56,
            lineHeight: 1.15,
            fontFamily: 'MonteCarlo',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
          }}
        >
          {COUPLE_NAMES}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'absolute',
            left: 60,
            bottom: 82,
            maxWidth: 1100,
            paddingLeft: 16,
            borderLeft: '5px solid #e58ab1',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.55)',
          }}
        >
          {invitation ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 58, lineHeight: 1.05 }}>
                {t('forGuest')}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize:
                    invitation.nombre_invitado.length > 28
                      ? 56
                      : invitation.nombre_invitado.length > 18
                        ? 76
                        : 104,
                  lineHeight: 1.05,
                }}
              >
                {invitation.nombre_invitado}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                maxWidth: 1000,
                fontSize: 76,
                lineHeight: 1.08,
              }}
            >
              {t('forYou')}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Playfair', data: playfairFont, weight: 400, style: 'normal' },
        { name: 'MonteCarlo', data: monteCarloFont, weight: 400, style: 'normal' },
      ],
      headers: {
        'cache-control': 'no-store',
      },
    },
  );

  try {
    return new Response(await imageResponse.arrayBuffer(), {
      headers: imageResponse.headers,
    });
  } catch (error) {
    console.error('No se pudo generar la imagen Open Graph:', error);
    return new Response('No se pudo generar la imagen Open Graph', { status: 500 });
  }
}
