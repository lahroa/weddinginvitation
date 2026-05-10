'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticlesCanvas from './ParticlesCanvas';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxHeroProps {
  nombresNovios: string;
  invitadoNombre?: string | null;
}

export default function ParallaxHero({ nombresNovios, invitadoNombre }: ParallaxHeroProps) {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const fondoRef = useRef<HTMLDivElement>(null);
  const parejaRef = useRef<HTMLDivElement>(null);
  const textoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fondo parallax sutil
      gsap.fromTo(fondoRef.current,
        { y: 0 },
        {
          y: '8%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Capa de contenido con movimiento más pronunciado
      gsap.fromTo(parejaRef.current,
        { y: 0 },
        {
          y: '20%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Texto se desvanece al hacer scroll
      gsap.to(textoRef.current, {
        opacity: 0.3,
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'center top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-cream m-0 p-0">
      {/* Capa fondo */}
      <div
        ref={fondoRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/images/hero/fondo.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform',
        }}
      >
        <div className="absolute inset-0 bg-cream/20" />
      </div>

      {/* Partículas */}
      <ParticlesCanvas />

      {/* Capa contenido centrado */}
      <div
        ref={parejaRef}
        className="absolute inset-0 flex flex-col items-center justify-center w-full h-full px-4"
        style={{ willChange: 'transform' }}
      >
        <div ref={textoRef} className="text-center">
          {/* Invitación */}
          {invitadoNombre && (
            <div className="mb-6 md:mb-8">
              <div className="inline-block bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-4 shadow-md">
                <span className="font-sans text-sm text-gold tracking-wider uppercase">
                  ✨ Invitación especial para
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-dark mt-3">
                {invitadoNombre}
              </h2>
            </div>
          )}

          {/* Imagen pareja */}
          <div className="relative mb-8 md:mb-10 mx-auto w-48 h-48 md:w-64 md:h-64">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/40 shadow-xl bg-gold/10 flex items-center justify-center">
              <img
                src="/images/hero/pareja.webp"
                alt={nombresNovios}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.querySelector('span')!.style.display = 'flex';
                }}
              />
              <span className="text-5xl hidden">💑</span>
            </div>
            <div className="absolute -inset-4 rounded-full border-2 border-gold/20 animate-pulse-soft pointer-events-none" />
          </div>

          {/* Nombres */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-gold leading-tight mb-3">
            {nombresNovios}
          </h1>

          {/* Nos casamos */}
          <p className="font-sans text-base md:text-xl text-dark/50 tracking-[0.2em] uppercase">
            {t('nosCasamos')}
          </p>

          {/* Fecha */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-6 h-px bg-gold/40" />
            <span className="font-serif text-lg md:text-2xl text-dark/50">27 · 07 · 2026</span>
            <div className="w-6 h-px bg-gold/40" />
          </div>
        </div>
      </div>

      {/* Indicador scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <span className="font-sans text-xs text-dark/40 tracking-widest uppercase">
          {t('scrollDown')}
        </span>
        <div className="w-px h-8 bg-gold/30 rounded-full overflow-hidden">
          <div className="w-full h-3 bg-gold rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}