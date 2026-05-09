import { getEventosPublicos } from '@/lib/eventos';
import { getInvitacionByToken } from '@/lib/invitaciones';
import { getAsistenciaByInvitacion } from '@/lib/asistencias';
import EventCard from './EventCard';
import { Evento } from '@/types';

interface EventSectionProps {
  token?: string | null;
  lang: string;
}

export default async function EventSection({ token, lang }: EventSectionProps) {
  let eventosPrivados: Evento[] = [];
  let invitacionData = null;
  let asistencias: Record<string, { asistira: boolean; num_acompanantes: number }> = {};
  let acompanantesUsados = 0;

  // Obtener eventos públicos (siempre visibles)
  const eventosPublicos = await getEventosPublicos();

  // Si hay token, obtener invitación y eventos privados
  if (token) {
    const invitacion = await getInvitacionByToken(token);
    
    if (invitacion) {
      invitacionData = invitacion;
      eventosPrivados = invitacion.eventos_detalle as unknown as Evento[];
      
      // Obtener asistencias previas
      const asistenciasData = await getAsistenciaByInvitacion(invitacion.id);
      
      for (const a of asistenciasData) {
        asistencias[a.evento_id] = {
          asistira: a.asistira,
          num_acompanantes: a.num_acompanantes,
        };
        if (a.asistira) {
          acompanantesUsados += a.num_acompanantes;
        }
      }
    }
  }

  // Construir lista combinada
  const allEventos: Array<{ evento: Evento; isPrivate: boolean; isAssigned: boolean }> = [
    ...eventosPublicos.map(e => ({ evento: e, isPrivate: false, isAssigned: true })),
    ...eventosPrivados.map(e => ({ evento: e, isPrivate: true, isAssigned: true })),
  ];

  // Ordenar por fecha
  allEventos.sort((a, b) => new Date(a.evento.fecha_hora).getTime() - new Date(b.evento.fecha_hora).getTime());

  if (allEventos.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      {allEventos.map(({ evento, isPrivate, isAssigned }) => {
        const showPrivateInfo = !isPrivate || isAssigned;
        const rsvpData = asistencias[evento.id] || null;

        return (
          <EventCard
            key={evento.id}
            evento={evento}
            showPrivateInfo={showPrivateInfo}
            token={token}
            maxAcompanantes={invitacionData?.max_acompanantes || 0}
            acompanantesYaUsados={acompanantesUsados}
            rsvpData={rsvpData}
          />
        );
      })}
    </section>
  );
}