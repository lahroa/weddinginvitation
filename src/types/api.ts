export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TokenValidationResponse {
  valido: boolean;
  invitacion?: {
    id: string;
    token: string;
    nombre_invitado: string;
    max_acompanantes: number;
    eventos: {
      id: string;
      nombre: string;
      fecha_hora: string;
      es_publico: boolean;
      permite_rsvp: boolean;
      tipo_evento: 'presencial' | 'virtual';
      lugar_publico: string | null;
      direccion_privada: string | null;
      maps_link: string | null;
      asunto_virtual: string | null;
      descripcion_virtual: string | null;
      link_virtual: string | null;
      background_image: string | null;
      background_type: 'image' | 'gradient';
      gradient_css: string | null;
      lottie_icon_url: string | null;
    }[];
  };
}

export interface AsistenciaInput {
  token: string;
  evento_id: string;
  asistira: boolean;
  num_acompanantes: number;
  notas?: string;
}

export interface Notificacion {
  id: string;
  mensaje: string;
  tipo_destino: 'todos' | 'evento' | 'invitacion';
  evento_id: string | null;
  invitacion_id: string | null;
  creado_en: string;
}