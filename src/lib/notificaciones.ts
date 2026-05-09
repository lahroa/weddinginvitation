import sql from './db';
import { Notificacion } from '@/types';

export async function getNotificaciones(
  tipo_destino?: string,
  evento_id?: string,
  invitacion_id?: string
): Promise<Notificacion[]> {
  let result;
  
  if (tipo_destino === 'todos' || (!tipo_destino && !evento_id && !invitacion_id)) {
    result = await sql`
      SELECT * FROM notificaciones WHERE tipo_destino = 'todos'
      ORDER BY creado_en DESC
    `;
  } else if (tipo_destino === 'evento' && evento_id) {
    result = await sql`
      SELECT * FROM notificaciones 
      WHERE tipo_destino = 'todos' 
         OR (tipo_destino = 'evento' AND evento_id = ${evento_id})
      ORDER BY creado_en DESC
    `;
  } else if (tipo_destino === 'invitacion' && invitacion_id) {
    result = await sql`
      SELECT * FROM notificaciones 
      WHERE tipo_destino = 'todos' 
         OR (tipo_destino = 'invitacion' AND invitacion_id = ${invitacion_id})
      ORDER BY creado_en DESC
    `;
  } else {
    result = await sql`
      SELECT * FROM notificaciones WHERE tipo_destino = 'todos'
      ORDER BY creado_en DESC
    `;
  }
  
  return result as Notificacion[];
}

export async function getNotificacionesParaInvitacion(
  invitacionId: string, 
  eventoIds: string[]
): Promise<Notificacion[]> {
  const result = await sql`
    SELECT DISTINCT n.* FROM notificaciones n
    WHERE 
      n.tipo_destino = 'todos'
      OR (n.tipo_destino = 'evento' AND n.evento_id = ANY(${eventoIds}))
      OR (n.tipo_destino = 'invitacion' AND n.invitacion_id = ${invitacionId})
    ORDER BY n.creado_en DESC
  `;
  
  return result as Notificacion[];
}

export async function createNotificacion(data: {
  mensaje: string;
  tipo_destino: 'todos' | 'evento' | 'invitacion';
  evento_id?: string | null;
  invitacion_id?: string | null;
}): Promise<Notificacion> {
  const result = await sql`
    INSERT INTO notificaciones (mensaje, tipo_destino, evento_id, invitacion_id)
    VALUES (
      ${data.mensaje}, 
      ${data.tipo_destino}, 
      ${data.evento_id || null}, 
      ${data.invitacion_id || null}
    )
    RETURNING *
  `;
  
  return (result as Notificacion[])[0];
}

export async function getAllNotificaciones(): Promise<Notificacion[]> {
  const result = await sql`
    SELECT n.*, 
           CASE 
             WHEN n.tipo_destino = 'evento' THEN e.nombre
             WHEN n.tipo_destino = 'invitacion' THEN i.nombre_invitado
             ELSE 'Todos'
           END as destino_nombre
    FROM notificaciones n
    LEFT JOIN eventos e ON n.evento_id = e.id
    LEFT JOIN invitaciones i ON n.invitacion_id = i.id
    ORDER BY n.creado_en DESC
  `;
  
  return result as Notificacion[];
}