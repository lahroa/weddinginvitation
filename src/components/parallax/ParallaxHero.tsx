'use client';

import useParallax from '@/hooks/useParallax';
import ParticlesCanvas from './ParticlesCanvas';
import { useTranslations } from 'next-intl';

interface ParallaxHeroProps {
  nombresNovios: string;
}

export default function ParallaxHero({ nombresNovios }: ParallaxHeroProps) {
  const t = useTranslations('hero');
  const fondoRef = useParallax<HTMLDivElement>({ speed: 0.15 });
  const parejaRef = useParallax<HTMLDivElement>({ speed: 0.35 });

  return (
    <section className="relative h-screen overflow-hidden bg-cream">
      {/* Capa 3: Fondo lejano */}
      <div
        ref={fondoRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/hero/fondo.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <div className="absolute inset-0 bg-cream/40" />
      </div>

      {/* Capa 2: Partículas */}
      <ParticlesCanvas />

      {/* Capa 1: Pareja y texto */}
      <div
        ref={parejaRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{
          willChange: 'transform',
        }}
      >
        {/* Contenedor de imagen (placeholder si no existe) */}
        <div className="relative mb-12">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/50 shadow-2xl mx-auto bg-gold/10 flex items-center justify-center">
            <span className="text-6xl">💑</span>
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-gold/20 animate-pulse-soft" />
          <div className="absolute -inset-8 rounded-full border border-gold/10 animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>

        {/* Nombres */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-gold text-center leading-tight mb-4 animate-fade-in">
          {nombresNovios}
        </h1>

        {/* "Nos casamos" */}
        <p className="font-sans text-lg md:text-2xl text-dark/60 tracking-[0.3em] uppercase animate-fade-in"
           style={{ animationDelay: '0.3s' }}>
          {t('nosCasamos')}
        </p>

        {/* Fecha */}
        <div className="mt-8 flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="w-8 h-px bg-gold/40" />
          <span className="font-serif text-xl md:text-2xl text-dark/50">27 · 07 · 2026</span>
          <div className="w-8 h-px bg-gold/40" />
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-fade-in"
           style={{ animationDelay: '1.2s' }}>
        <span className="font-sans text-xs text-dark/40 tracking-widest uppercase">
          {t('scrollDown')}
        </span>
        <div className="w-px h-8 bg-gold/30">
          <div className="w-full h-3 bg-gold rounded-full animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
}