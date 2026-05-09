import sql from './db';
import { generateUniqueToken } from './tokens';
import { Invitacion, InvitacionConEventos } from '@/types';

interface InvitacionRow {
  id: string;
  token: string;
  nombre_invitado: string;
  max_acompanantes: number;
  activa: boolean;
  creado_en: string;
}

interface EventoSimple {
  id: string;
  nombre: string;
  fecha_hora: string;
  es_publico: boolean;
  tipo_evento: string;
}

export async function getAllInvitaciones(): Promise<InvitacionConEventos[]> {
  const invitaciones = await sql`
    SELECT * FROM invitaciones ORDER BY creado_en DESC
  `;
  
  const result: InvitacionConEventos[] = [];
  
  for (const inv of invitaciones as InvitacionRow[]) {
    const eventos = await sql`
      SELECT e.id, e.nombre, e.fecha_hora, e.es_publico, e.tipo_evento 
      FROM eventos e
      INNER JOIN invitacion_evento ie ON e.id = ie.evento_id
      WHERE ie.invitacion_id = ${inv.id}
    `;
    
    const eventosList = eventos as EventoSimple[];
    
    result.push({
      ...inv,
      eventos: eventosList.map((e) => e.id),
      eventos_detalle: eventosList,
    });
  }
  
  return result;
}

export async function getInvitacionByToken(token: string): Promise<InvitacionConEventos | null> {
  const result = await sql`
    SELECT * FROM invitaciones 
    WHERE token = ${token} AND activa = true
  `;
  
  const rows = result as InvitacionRow[];
  if (!rows[0]) return null;
  
  const inv = rows[0];
  const eventos = await sql`
    SELECT e.* FROM eventos e
    INNER JOIN invitacion_evento ie ON e.id = ie.evento_id
    WHERE ie.invitacion_id = ${inv.id}
  `;
  
  const eventosList = eventos as EventoSimple[];
  
  return {
    ...inv,
    eventos: eventosList.map((e) => e.id),
    eventos_detalle: eventosList,
  };
}

export async function createInvitacion(data: {
  nombre_invitado: string;
  max_acompanantes: number;
  eventos_ids: string[];
}): Promise<InvitacionConEventos> {
  const token = await generateUniqueToken();
  
  const result = await sql`
    INSERT INTO invitaciones (token, nombre_invitado, max_acompanantes)
    VALUES (${token}, ${data.nombre_invitado}, ${data.max_acompanantes})
    RETURNING *
  `;
  
  const inv = (result as InvitacionRow[])[0];
  
  if (data.eventos_ids.length > 0) {
    for (const eventoId of data.eventos_ids) {
      await sql`
        INSERT INTO invitacion_evento (invitacion_id, evento_id)
        VALUES (${inv.id}, ${eventoId})
      `;
    }
  }
  
  return getInvitacionByToken(token) as Promise<InvitacionConEventos>;
}

export async function updateInvitacion(
  id: string, 
  data: { 
    nombre_invitado?: string; 
    max_acompanantes?: number; 
    activa?: boolean;
    eventos_ids?: string[];
  }
): Promise<InvitacionConEventos | null> {
  const updates: string[] = [];
  
  if (data.nombre_invitado !== undefined) {
    updates.push(`nombre_invitado = '${data.nombre_invitado.replace(/'/g, "''")}'`);
  }
  if (data.max_acompanantes !== undefined) {
    updates.push(`max_acompanantes = ${data.max_acompanantes}`);
  }
  if (data.activa !== undefined) {
    updates.push(`activa = ${data.activa}`);
  }
  
  if (updates.length > 0) {
    await sql`
      UPDATE invitaciones 
      SET ${sql(updates.join(', '))}
      WHERE id = ${id}
    `;
  }
  
  if (data.eventos_ids !== undefined) {
    await sql`DELETE FROM invitacion_evento WHERE invitacion_id = ${id}`;
    
    for (const eventoId of data.eventos_ids) {
      await sql`
        INSERT INTO invitacion_evento (invitacion_id, evento_id)
        VALUES (${id}, ${eventoId})
      `;
    }
  }
  
  const result = await sql`SELECT * FROM invitaciones WHERE id = ${id}`;
  const rows = result as InvitacionRow[];
  if (!rows[0]) return null;
  
  return getInvitacionByToken(rows[0].token) as Promise<InvitacionConEventos>;
}

export async function deleteInvitacion(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM invitaciones WHERE id = ${id}`;
  return ((result as unknown) as { count: number }).count > 0;
}