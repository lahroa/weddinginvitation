import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!locales.includes(lang as typeof locales[number])) {
    notFound();
  }

  const t = await getTranslations({ locale: lang, namespace: 'metadata' });
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    icons: {
      icon: [
        {
          url: '/favicon-96x96.png?v=20261113',
          type: 'image/png',
          sizes: '96x96',
        },
        {
          url: '/favicon.svg?v=20261113',
          type: 'image/svg+xml',
        },
      ],
      shortcut: '/favicon.ico?v=20261113',
      apple: [
        {
          url: '/apple-touch-icon.png?v=20261113',
          sizes: '180x180',
          type: 'image/png',
        },
      ],
    },
    appleWebApp: {
      title,
    },
    manifest: `/${lang}/site.webmanifest?v=20261113`,
    openGraph: {
      title,
      description,
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  if (!locales.includes(lang as typeof locales[number])) {
    notFound();
  }

  setRequestLocale(lang);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}