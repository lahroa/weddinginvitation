import sql from './db';

export async function registrarAsistencia(data: {
  invitacion_id: string;
  evento_id: string;
  asistira: boolean;
  num_acompanantes: number;
  notas?: string;
}): Promise<boolean> {
  // Verificar que el invitado tiene acceso a este evento
  const acceso = await sql`
    SELECT 1 FROM invitacion_evento 
    WHERE invitacion_id = ${data.invitacion_id} AND evento_id = ${data.evento_id}
  `;
  
  if (!acceso[0]) {
    throw new Error('No tienes acceso a este evento');
  }
  
  // Verificar máximo de acompañantes
  const invitacion = await sql`
    SELECT max_acompanantes FROM invitaciones WHERE id = ${data.invitacion_id}
  `;
  
  if (invitacion[0]) {
    // Sumar acompañantes de todas las asistencias excepto este evento
    const totalAcompanantes = await sql`
      SELECT COALESCE(SUM(num_acompanantes), 0) as total 
      FROM asistencias 
      WHERE invitacion_id = ${data.invitacion_id} 
        AND evento_id != ${data.evento_id}
        AND asistira = true
    `;
    
    const sumaTotal = Number(totalAcompanantes[0]?.total || 0) + data.num_acompanantes;
    
    if (sumaTotal > invitacion[0].max_acompanantes) {
      throw new Error(
        `Excedes el máximo de ${invitacion[0].max_acompanantes} acompañantes totales`
      );
    }
  }
  
  // Upsert
  await sql`
    INSERT INTO asistencias (invitacion_id, evento_id, asistira, num_acompanantes, notas)
    VALUES (${data.invitacion_id}, ${data.evento_id}, ${data.asistira}, ${data.num_acompanantes}, ${data.notas || null})
    ON CONFLICT (invitacion_id, evento_id) 
    DO UPDATE SET 
      asistira = ${data.asistira},
      num_acompanantes = ${data.num_acompanantes},
      notas = ${data.notas || null}
  `;
  
  return true;
}

export async function getAsistenciaByInvitacion(invitacionId: string) {
  return sql`
    SELECT a.*, e.nombre as evento_nombre 
    FROM asistencias a
    INNER JOIN eventos e ON a.evento_id = e.id
    WHERE a.invitacion_id = ${invitacionId}
  `;
}