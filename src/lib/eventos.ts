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
  // Construir query dinámica usando template literal de SQL
  const fields: string[] = [];
  
  if (data.nombre !== undefined) fields.push(`nombre = '${data.nombre.replace(/'/g, "''")}'`);
  if (data.fecha_hora !== undefined) fields.push(`fecha_hora = '${data.fecha_hora}'`);
  if (data.es_publico !== undefined) fields.push(`es_publico = ${data.es_publico}`);
  if (data.permite_rsvp !== undefined) fields.push(`permite_rsvp = ${data.permite_rsvp}`);
  if (data.tipo_evento !== undefined) fields.push(`tipo_evento = '${data.tipo_evento}'`);
  if (data.lugar_publico !== undefined) fields.push(`lugar_publico = ${data.lugar_publico ? `'${data.lugar_publico.replace(/'/g, "''")}'` : 'NULL'}`);
  if (data.direccion_privada !== undefined) fields.push(`direccion_privada = ${data.direccion_privada ? `'${data.direccion_privada.replace(/'/g, "''")}'` : 'NULL'}`);
  if (data.maps_link !== undefined) fields.push(`maps_link = ${data.maps_link ? `'${data.maps_link.replace(/'/g, "''")}'` : 'NULL'}`);
  if (data.asunto_virtual !== undefined) fields.push(`asunto_virtual = ${data.asunto_virtual ? `'${data.asunto_virtual.replace(/'/g, "''")}'` : 'NULL'}`);
  if (data.descripcion_virtual !== undefined) fields.push(`descripcion_virtual = ${data.descripcion_virtual ? `'${data.descripcion_virtual.replace(/'/g, "''")}'` : 'NULL'}`);
  if (data.link_virtual !== undefined) fields.push(`link_virtual = ${data.link_virtual ? `'${data.link_virtual.replace(/'/g, "''")}'` : 'NULL'}`);
  if (data.background_image !== undefined) fields.push(`background_image = ${data.background_image ? `'${data.background_image.replace(/'/g, "''")}'` : 'NULL'}`);
  if (data.background_type !== undefined) fields.push(`background_type = '${data.background_type}'`);
  if (data.gradient_css !== undefined) fields.push(`gradient_css = ${data.gradient_css ? `'${data.gradient_css.replace(/'/g, "''")}'` : 'NULL'}`);
  if (data.lottie_icon_url !== undefined) fields.push(`lottie_icon_url = ${data.lottie_icon_url ? `'${data.lottie_icon_url.replace(/'/g, "''")}'` : 'NULL'}`);

  if (fields.length === 0) return getEventoById(id);

  const result = await sql`
    UPDATE eventos 
    SET ${sql(fields.join(', '))}
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