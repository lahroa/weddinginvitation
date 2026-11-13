import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-admin',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Panel de Administración - Luis & Daniela',
  robots: 'noindex, nofollow',
};

export default async function AdminLayout({
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
  
  return (
    <div className={`${quicksand.variable} admin-root min-h-screen bg-white text-dark`}>
      {children}
    </div>
  );
}