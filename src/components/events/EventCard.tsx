'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Evento } from '@/types';
import EventRSVP from './EventRSVP';

gsap.registerPlugin(ScrollTrigger);

interface EventCardProps {
  evento: Evento;
  showPrivateInfo: boolean;
  token?: string | null;
  maxAcompanantes?: number;
  acompanantesYaUsados?: number;
}

export default function EventCard({
  evento,
  showPrivateInfo,
  token,
  maxAcompanantes = 0,
  acompanantesYaUsados = 0,
}: EventCardProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const fecha = new Date(evento.fecha_hora);
  const dia = fecha.getDate();
  const mes = fecha.toLocaleDateString('es', { month: 'short' });
  const hora = fecha.toLocaleTimeString('es', { hour: 'numeric', minute: '2-digit', hour12: true });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Solo animar el contenido con fade in
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const bgStyle: React.CSSProperties = evento.background_type === 'gradient' && evento.gradient_css
    ? { background: evento.gradient_css }
    : evento.background_image
      ? {
          backgroundImage: `url(${evento.background_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }
      : {
          background: 'linear-gradient(135deg, #2D2D2D 0%, #1a1a1a 100%)',
        };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      {/* Fondo fijo (efecto parallax nativo con background-attachment: fixed) */}
      <div
        className="absolute inset-0"
        style={bgStyle}
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 overlay-dark" />
      </div>

      {/* Contenido */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-28"
      >
        {/* Nombre del evento */}
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-8 md:mb-10 drop-shadow-lg">
          {evento.nombre}
        </h2>

        {/* Fecha grande */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="font-serif text-6xl md:text-8xl lg:text-9xl text-gold font-bold leading-none drop-shadow-lg">
              {dia}
            </span>
            <div>
              <span className="font-sans text-xl md:text-3xl text-white/80 uppercase tracking-wider block leading-none drop-shadow-lg">
                {mes}
              </span>
              <span className="font-sans text-lg md:text-2xl text-white/60 block mt-1 drop-shadow-lg">
                {hora}
              </span>
            </div>
          </div>
        </div>

        {/* Lugar */}
        {evento.tipo_evento === 'presencial' && evento.lugar_publico && (
          <div className="mb-3">
            <p className="font-sans text-lg md:text-xl text-white/80 drop-shadow-lg">
              📍 {evento.lugar_publico}
            </p>
          </div>
        )}

        {/* Dirección (solo con token) */}
        {showPrivateInfo && evento.tipo_evento === 'presencial' && evento.direccion_privada && (
          <p className="font-sans text-sm md:text-base text-white/50 mb-4 drop-shadow-lg">
            {evento.direccion_privada}
          </p>
        )}

        {/* Virtual */}
        {evento.tipo_evento === 'virtual' && evento.asunto_virtual && (
          <p className="font-sans text-lg md:text-xl text-white/80 drop-shadow-lg">
            💻 {evento.asunto_virtual}
          </p>
        )}

        {showPrivateInfo && evento.tipo_evento === 'virtual' && evento.descripcion_virtual && (
          <p className="font-sans text-sm md:text-base text-white/50 mb-2 drop-shadow-lg">
            {evento.descripcion_virtual}
          </p>
        )}

        {/* Botones */}
        <div className="flex flex-wrap gap-3 mt-6">
          {showPrivateInfo && evento.tipo_evento === 'presencial' && evento.maps_link && (
            <a
              href={evento.maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-full 
                         font-sans text-sm hover:bg-white/25 transition-all border border-white/20"
            >
              🗺️ Ver en el mapa
            </a>
          )}

          {showPrivateInfo && evento.tipo_evento === 'virtual' && evento.link_virtual && (
            <a
              href={evento.link_virtual}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-full 
                         font-sans text-sm hover:bg-white/25 transition-all border border-white/20"
            >
              🔗 Unirse
            </a>
          )}
        </div>

        {/* RSVP */}
        {token && showPrivateInfo && evento.permite_rsvp && (
          <div className="mt-10 md:mt-14 max-w-md">
            <EventRSVP
              token={token}
              eventoId={evento.id}
              maxAcompanantes={maxAcompanantes}
              acompanantesYaUsados={acompanantesYaUsados}
            />
          </div>
        )}
      </div>
    </section>
  );
}