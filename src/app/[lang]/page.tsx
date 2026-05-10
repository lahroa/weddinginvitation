
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ParallaxHero from '@/components/parallax/ParallaxHero';
import EventSection from '@/components/events/EventSection';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import TokenBanner from '@/components/invitation/TokenBanner';
import SupportSection from '@/components/support/SupportSection';
import BackgroundMusic from '@/components/music/BackgroundMusic';
import NotificationBanner from '@/components/notifications/NotificationBanner';
import Divider from '@/components/ui/Divider';
import { getInvitacionByToken } from '@/lib/invitaciones';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ invitacion?: string }>;
}


export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { invitacion } = await searchParams;
  const token = invitacion?.toUpperCase() || null;
  
  if (token) {
    try {
      const invitacionData = await getInvitacionByToken(token);
      if (invitacionData) {
        return {
          title: `Invitación para ${invitacionData.nombre_invitado} - Luis & Daniela`,
          description: `Hola ${invitacionData.nombre_invitado}, confirma tu asistencia a nuestra boda el 27 de Julio de 2026.`,
          openGraph: {
            title: `Invitación para ${invitacionData.nombre_invitado} - Luis & Daniela`,
            description: `Hola ${invitacionData.nombre_invitado}, confirma tu asistencia a nuestra boda.`,
            images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
            type: 'website',
          },
        };
      }
    } catch {
      // Metadata por defecto si falla
    }
  }

  return {
    title: 'Luis & Daniela - Nos Casamos',
    description: 'Te invitamos a celebrar nuestra boda el 27 de Julio de 2026.',
    openGraph: {
      title: 'Luis & Daniela - Nos Casamos',
      description: 'Te invitamos a celebrar nuestra boda el 27 de Julio de 2026.',
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export default async function HomePage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const { invitacion } = await searchParams;

  
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
<main className="min-h-screen m-0 p-0">
  <NotificationBanner token={token} />
  <BackgroundMusic />
  <ParallaxHero nombresNovios="Luis & Daniela" invitadoNombre={invitadoNombre} />
  <EventSection token={token} lang={lang} />

      {!token && (
        <>
          <Divider />
          <TokenBanner lang={lang} />
        </>
      )}

      <Divider />
      <GalleryGrid />
      <Divider />
      <SupportSection />

      <footer className="py-10 px-4 text-center bg-cream">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-gold/20" />
            <span className="text-gold/30 text-lg">❦</span>
            <div className="w-8 h-px bg-gold/20" />
          </div>
          <p className="font-serif text-gold/40 text-sm tracking-wider">
            Luis & Daniela
          </p>
          <p className="font-sans text-dark/20 text-xs mt-1">
            27 · 07 · 2026
          </p>
          <p className="font-sans text-dark/15 text-xs mt-3">
            Hecho con ❤️ para celebrar el amor
          </p>
        </div>
      </footer>
    </main>
  );
}