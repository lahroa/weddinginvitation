import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params;
  if (!locales.includes(lang as typeof locales[number])) {
    return new Response('Not found', { status: 404 });
  }

  const t = await getTranslations({ locale: lang, namespace: 'metadata' });
  const manifest = {
    name: t('title'),
    short_name: 'L&D',
    description: t('description'),
    lang,
    icons: [
      {
        src: '/web-app-manifest-192x192.png?v=20261113',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png?v=20261113',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    theme_color: '#133560',
    background_color: '#FAD1D9',
    display: 'standalone',
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  });
}
