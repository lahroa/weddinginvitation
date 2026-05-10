import sql from './db';
import { Evento, EventoInput } from '@/types';

export async function getEventosPublicos(): Promise<Evento[]> {
  const result = await sql`
    SELECT * FROM eventos 
    WHERE es_publico = true 
    ORDER BY fecha_hora ASC
  `;
  return result as Evento[];
}

export async function getEventosByInvitacion(invitacionId: string): Promise<Evento[]> {
  const result = await sql`
    SELECT e.* FROM eventos e
    INNER JOIN invitacion_evento ie ON e.id = ie.evento_id
    WHERE ie.invitacion_id = ${invitacionId}
    ORDER BY e.fecha_hora ASC
  `;
  return result as Evento[];
}

export async function getAllEventos(): Promise<Evento[]> {
  const result = await sql`
    SELECT * FROM eventos 
    ORDER BY fecha_hora ASC
  `;
  return result as Evento[];
}

export async function getEventoById(id: string): Promise<Evento | null> {
  const result = await sql`
    SELECT * FROM eventos WHERE id = ${id}
  `;
  return (result[0] as Evento) || null;
}

export async function createEvento(data: EventoInput): Promise<Evento> {
  const result = await sql`
    INSERT INTO eventos (
      nombre, fecha_hora, es_publico, permite_rsvp, tipo_evento,
      lugar_publico, direccion_privada, maps_link,
      asunto_virtual, descripcion_virtual, link_virtual,
      background_image, background_type, gradient_css, lottie_icon_url
    ) VALUES (
      ${data.nombre}, ${data.fecha_hora}, ${data.es_publico}, ${data.permite_rsvp}, ${data.tipo_evento},
      ${data.lugar_publico || null}, ${data.direccion_privada || null}, ${data.maps_link || null},
      ${data.asunto_virtual || null}, ${data.descripcion_virtual || null}, ${data.link_virtual || null},
      ${data.background_image || null}, ${data.background_type || 'image'}, ${data.gradient_css || null}, ${data.lottie_icon_url || null}
    )
    RETURNING *
  `;
  return result[0] as Evento;
}

export async function updateEvento(id: string, data: Partial<EventoInput>): Promise<Evento | null> {
  const current = await getEventoById(id);
  if (!current) return null;

  const nombre = data.nombre ?? current.nombre;
  const fecha_hora = data.fecha_hora ?? current.fecha_hora;
  const es_publico = data.es_publico ?? current.es_publico;
  const permite_rsvp = data.permite_rsvp ?? current.permite_rsvp;
  const tipo_evento = data.tipo_evento ?? current.tipo_evento;
  const lugar_publico = data.lugar_publico !== undefined ? data.lugar_publico : current.lugar_publico;
  const direccion_privada = data.direccion_privada !== undefined ? data.direccion_privada : current.direccion_privada;
  const maps_link = data.maps_link !== undefined ? data.maps_link : current.maps_link;
  const asunto_virtual = data.asunto_virtual !== undefined ? data.asunto_virtual : current.asunto_virtual;
  const descripcion_virtual = data.descripcion_virtual !== undefined ? data.descripcion_virtual : current.descripcion_virtual;
  const link_virtual = data.link_virtual !== undefined ? data.link_virtual : current.link_virtual;
  const background_image = data.background_image !== undefined ? data.background_image : current.background_image;
  const background_type = data.background_type ?? current.background_type;
  const gradient_css = data.gradient_css !== undefined ? data.gradient_css : current.gradient_css;
  const lottie_icon_url = data.lottie_icon_url !== undefined ? data.lottie_icon_url : current.lottie_icon_url;

  const result = await sql`
    UPDATE eventos SET
      nombre = ${nombre},
      fecha_hora = ${fecha_hora},
      es_publico = ${es_publico},
      permite_rsvp = ${permite_rsvp},
      tipo_evento = ${tipo_evento},
      lugar_publico = ${lugar_publico},
      direccion_privada = ${direccion_privada},
      maps_link = ${maps_link},
      asunto_virtual = ${asunto_virtual},
      descripcion_virtual = ${descripcion_virtual},
      link_virtual = ${link_virtual},
      background_image = ${background_image},
      background_type = ${background_type},
      gradient_css = ${gradient_css},
      lottie_icon_url = ${lottie_icon_url}
    WHERE id = ${id}
    RETURNING *
  `;
  
  return (result[0] as Evento) || null;
}

export async function deleteEvento(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM eventos WHERE id = ${id}
  `;
  return (result as unknown as { count: number }).count > 0;
}