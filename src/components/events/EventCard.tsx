import { Evento } from '@/types';
import CountdownTimer from '@/components/countdown/CountdownTimer';
import LottieIcon from './LottieIcon';
import EventDetails from './EventDetails';
import EventRSVP from './EventRSVP';
import ParallaxEventLayer from '@/components/parallax/ParallaxEventLayer';
import Divider from '@/components/ui/Divider';

interface EventCardProps {
  evento: Evento;
  showPrivateInfo: boolean;
  token?: string | null;
  maxAcompanantes?: number;
  acompanantesYaUsados?: number;
  rsvpData?: {
    asistira: boolean;
    num_acompanantes: number;
    notas?: string;
  } | null;
}

export default function EventCard({
  evento,
  showPrivateInfo,
  token,
  maxAcompanantes = 0,
  acompanantesYaUsados = 0,
  rsvpData,
}: EventCardProps) {
  return (
    <>
      <ParallaxEventLayer
        backgroundImage={evento.background_image}
        backgroundType={evento.background_type}
        gradientCss={evento.gradient_css}
      >
        {/* Icono Lottie */}
        {evento.lottie_icon_url && (
          <div className="mb-6 animate-fade-in">
            <LottieIcon src={evento.lottie_icon_url} size={120} />
          </div>
        )}

        {/* Nombre del evento */}
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gold text-center mb-6 animate-fade-in">
          {evento.nombre}
        </h2>

        {/* Contador regresivo */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CountdownTimer targetDate={evento.fecha_hora} />
        </div>

        {/* Detalles del evento */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <EventDetails
            tipoEvento={evento.tipo_evento}
            lugarPublico={evento.lugar_publico}
            direccionPrivada={evento.direccion_privada}
            mapsLink={evento.maps_link}
            asuntoVirtual={evento.asunto_virtual}
            descripcionVirtual={evento.descripcion_virtual}
            linkVirtual={evento.link_virtual}
            showPrivateInfo={showPrivateInfo || evento.es_publico}
          />
        </div>

        {/* RSVP - Solo si hay token y el evento permite RSVP */}
        {token && showPrivateInfo && evento.permite_rsvp && (
          <div className="animate-fade-in mt-6" style={{ animationDelay: '0.6s' }}>
            <EventRSVP
              token={token}
              eventoId={evento.id}
              maxAcompanantes={maxAcompanantes}
              acompanantesYaUsados={acompanantesYaUsados}
            />
          </div>
        )}
      </ParallaxEventLayer>

      <Divider />
    </>
  );
}