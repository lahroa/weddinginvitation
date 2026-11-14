
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ParallaxHero from '@/components/parallax/ParallaxHero';
import EventSection from '@/components/events/EventSection';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import TokenBanner from '@/components/invitation/TokenBanner';
import SupportSection from '@/components/support/SupportSection';
import BackgroundMusic from '@/components/music/BackgroundMusic';
import NotificationBanner from '@/components/notifications/NotificationBanner';
import PageLoadingGate from '@/components/ui/PageLoadingGate';
import { getInvitacionByToken } from '@/lib/invitaciones';
import { formatFechaBoda } from '@/lib/fecha';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ invitacion?: string }>;
}


export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const { invitacion } = await searchParams;
  const token = invitacion?.trim().toUpperCase() || null;
  const fechaTexto = formatFechaBoda(lang);
  const imageUrl = `/api/invitacion-og?lang=${encodeURIComponent(lang)}${token ? `&invitacion=${encodeURIComponent(token)}` : ''}`;
  
  if (token) {
    try {
      const invitacionData = await getInvitacionByToken(token);
      if (invitacionData) {
        const t = await getTranslations({ locale: lang, namespace: 'invitationImage' });
        const title = t('shareTitle', {
          name: invitacionData.nombre_invitado,
          couple: NOMBRES_NOVIOS,
        });
        const description = t('shareDescription', {
          name: invitacionData.nombre_invitado,
          date: fechaTexto,
        });

        return {
          title,
          description,
          openGraph: {
            title,
            description,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: title, type: 'image/webp' }],
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
          },
        };
      }
    } catch {
      // Metadata por defecto si falla
    }
  }

  const t = await getTranslations({ locale: lang, namespace: 'metadata' });
  const title = t('title');
  const description = t('description', { date: fechaTexto });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title, type: 'image/webp' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

const NOMBRES_NOVIOS = process.env.NEXT_PUBLIC_NOMBRES_NOVIOS || 'Luis & Daniela';

export default async function HomePage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const { invitacion } = await searchParams;

  const nombresNovios = NOMBRES_NOVIOS;
  const fechaTexto = formatFechaBoda(lang);

  
  // Habilitar renderizado estático para next-intl
  setRequestLocale(lang);
  
  const token = invitacion?.toUpperCase() || null;
  
  let invitadoNombre: string | null = null;
  
  if (token) {
    try {
      const invitacionData = await getInvitacionByToken(token);
      if (invitacionData) {
        invitadoNombre = invitacionData.nombre_invitado;
      }
    } catch {
      // Token inválido, continuar como visitante público
    }
  }

  return (
    <PageLoadingGate guestName={invitadoNombre}>
      <main className="min-h-screen m-0 p-0">
        <NotificationBanner token={token} />
        <BackgroundMusic />

        <ParallaxHero
          nombresNovios={nombresNovios}
          fechaTexto={fechaTexto}
          invitadoNombre={invitadoNombre}
        />

        <EventSection token={token} lang={lang} />

        {!token && <TokenBanner lang={lang} />}

        <GalleryGrid />

        <SupportSection />

        <footer className="bg-primary px-6 pb-10 pt-12 text-center">
          <p className="font-serif text-base tracking-[0.3em] text-light">
            {nombresNovios}
          </p>
          <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.28em] text-light">
            {fechaTexto}
          </p>
          <p className="mt-4 font-sans text-[11px] text-light">
            Hecho con cariño por <a href="https://duketech.top">duketech.top</a>
          </p>
        </footer>
      </main>
    </PageLoadingGate>
  );
}