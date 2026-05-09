export type TipoEvento = 'presencial' | 'virtual';
export type BackgroundType = 'image' | 'gradient';

export interface Evento {
  id: string;
  nombre: string;
  fecha_hora: string;
  es_publico: boolean;
  permite_rsvp: boolean;
  tipo_evento: TipoEvento;
  
  // Presencial
  lugar_publico: string | null;
  direccion_privada: string | null;
  maps_link: string | null;
  
  // Virtual
  asunto_virtual: string | null;
  descripcion_virtual: string | null;
  link_virtual: string | null;
  
  // Visuales
  background_image: string | null;
  background_type: BackgroundType;
  gradient_css: string | null;
  lottie_icon_url: string | null;
  
  creado_en: string;
}

export interface EventoInput {
  nombre: string;
  fecha_hora: string;
  es_publico: boolean;
  permite_rsvp: boolean;
  tipo_evento: TipoEvento;
  lugar_publico?: string | null;
  direccion_privada?: string | null;
  maps_link?: string | null;
  asunto_virtual?: string | null;
  descripcion_virtual?: string | null;
  link_virtual?: string | null;
  background_image?: string | null;
  background_type?: BackgroundType;
  gradient_css?: string | null;
  lottie_icon_url?: string | null;
}