'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import MaterialIcon from '@/components/ui/MaterialIcon';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxHeroProps {
  nombresNovios: string;
  fechaTexto: string;
  invitadoNombre?: string | null;
}

/**
 * Hero a pantalla completa compuesto por tres capas fotográficas:
 * fondo, capa intermedia y capa fija. Los nombres, la fecha y el aviso
 * de deslizar viven en la franja inferior sobre un degradado oscuro.
 */
export default function ParallaxHero({ nombresNovios, fechaTexto, invitadoNombre }: ParallaxHeroProps) {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const fondoRef = useRef<HTMLDivElement>(null);
  const parejaRef = useRef<HTMLDivElement>(null);
  const textoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fondoRef.current,
        { yPercent: 0 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        parejaRef.current,
        { yPercent: 0 },
        {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        textoRef.current,
        { opacity: 1, y: 0 },
        {
          opacity: 0.35,
          y: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'center top',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-viewport relative isolate w-full overflow-hidden bg-primary m-0 p-0"
    >
      {/* Capa 1: foto de fondo */}
      <div ref={fondoRef} className="hero-layer hero-layer-back" aria-hidden="true" />

      {/* Capa 2: foto intermedia */}
      <div ref={parejaRef} className="hero-layer hero-layer-mid" aria-hidden="true" />

      {/* Capa 3: foto fija (se mantiene fija mientras se hace scroll) */}
      <div className="hero-layer hero-layer-fixed" aria-hidden="true" />

      {/* Oscurecido general: da unidad a las capas y contraste al texto */}
      <div className="hero-shade absolute inset-0" aria-hidden="true" />

      {/* Nombres, fecha y aviso de deslizar */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="hero-bottom-bar px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 md:pt-28">
          <div ref={textoRef} className="mx-auto max-w-3xl text-center">
            {invitadoNombre && (
              <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 backdrop-blur-sm">
                <MaterialIcon name="favorite" className="h-3.5 w-3.5 shrink-0 text-accent-2" />
                <span className="truncate font-sans text-[10px] uppercase tracking-[0.22em] text-light sm:text-[11px]">
                  {t('specialInvite')} · {invitadoNombre}
                </span>
              </div>
            )}

            <p className="font-sans text-[10px] uppercase tracking-[0.38em] text-light sm:text-xs">
              {t('nosCasamos')}
            </p>

            <h1 className="mt-3 font-serif text-[2.75rem] leading-[1.05] text-light drop-shadow-[0_4px_28px_rgba(0,0,0,0.6)] sm:text-6xl md:text-7xl lg:text-8xl">
              {nombresNovios}
            </h1>

            <div className="mt-5 flex items-center justify-center gap-3 md:gap-4">
              <span className="h-px w-8 bg-accent md:w-12" />
              <span className="font-serif text-lg tracking-[0.18em] text-light md:text-2xl">
                {fechaTexto}
              </span>
              <span className="h-px w-8 bg-accent md:w-12" />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 md:mt-10">
            <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-light sm:text-[10px]">
              {t('scrollDown')}
            </span>
            <span className="relative block h-9 w-px overflow-hidden bg-white/20">
              <span className="absolute inset-x-0 top-0 h-3 animate-bounce bg-accent-2" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
