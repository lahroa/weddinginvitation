export interface Invitacion {
  id: string;
  token: string;
  nombre_invitado: string;
  max_acompanantes: number;
  activa: boolean;
  eventos: string[]; // IDs de eventos asignados
  creado_en: string;
}

export interface InvitacionInput {
  nombre_invitado: string;
  max_acompanantes: number;
  eventos_ids: string[];
}

export interface InvitacionConEventos extends Invitacion {
  eventos_detalle: {
    id: string;
    nombre: string;
    fecha_hora: string;
    es_publico: boolean;
    tipo_evento: string;
  }[];
}