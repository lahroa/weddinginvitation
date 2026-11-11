import { getEventosPublicos } from '@/lib/eventos';
import EventCard from './EventCard';
import { Evento } from '@/types';
import MaterialIcon from '@/components/ui/MaterialIcon';

interface EventSectionProps {
  token?: string | null;
  lang: string;
}

export default async function EventSection({ token, lang }: EventSectionProps) {
  let allEventos: Evento[] = [];

  try {
    if (token) {
      const { getInvitacionByToken } = await import('@/lib/invitaciones');
      const { getEventosByInvitacion } = await import('@/lib/eventos');
      
      const invitacion = await getInvitacionByToken(token);
      const eventosPublicos = await getEventosPublicos();
      
      if (invitacion) {
        const eventosPrivados = await getEventosByInvitacion(invitacion.id);
        allEventos = [...eventosPublicos, ...eventosPrivados];
      } else {
        allEventos = eventosPublicos;
      }
    } else {
      allEventos = await getEventosPublicos();
    }
  } catch {
    return null;
  }

  allEventos.sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime());

  if (allEventos.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center px-4">
          <MaterialIcon name="calendar" className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="font-serif text-3xl text-primary mb-4">Próximamente</h2>
          <p className="font-sans text-dark/50">
            Los eventos serán anunciados pronto.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {allEventos.map((evento) => (
        <EventCard
          key={evento.id}
          evento={evento}
          showPrivateInfo={evento.es_publico || !!token}
          token={token}
        />
      ))}
    </>
  );
}