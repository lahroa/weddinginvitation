import { z } from 'zod';

export const eventoInputSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  fecha_hora: z.string().datetime('Fecha inválida'),
  es_publico: z.boolean(),
  permite_rsvp: z.boolean(),
  tipo_evento: z.enum(['presencial', 'virtual']),
  lugar_publico: z.string().nullable().optional(),
  direccion_privada: z.string().nullable().optional(),
  maps_link: z.string().url('URL inválida').nullable().optional().or(z.literal('')),
  asunto_virtual: z.string().nullable().optional(),
  descripcion_virtual: z.string().nullable().optional(),
  link_virtual: z.string().url('URL inválida').nullable().optional().or(z.literal('')),
  background_image: z.string().nullable().optional(),
  background_type: z.enum(['image', 'gradient']).optional().default('image'),
  gradient_css: z.string().nullable().optional(),
  lottie_icon_url: z.string().nullable().optional(),
}).refine((data) => {
  if (data.tipo_evento === 'presencial') {
    return !!data.lugar_publico;
  }
  return true;
}, {
  message: 'El lugar es requerido para eventos presenciales',
  path: ['lugar_publico'],
}).refine((data) => {
  if (data.tipo_evento === 'virtual') {
    return !!data.asunto_virtual && !!data.link_virtual;
  }
  return true;
}, {
  message: 'Asunto y enlace son requeridos para eventos virtuales',
  path: ['asunto_virtual'],
});

export const invitacionInputSchema = z.object({
  nombre_invitado: z.string().min(1, 'El nombre es requerido'),
  max_acompanantes: z.number().int().min(0, 'Debe ser 0 o más').max(20, 'Máximo 20'),
  eventos_ids: z.array(z.string().uuid('ID de evento inválido')),
});

export const asistenciaInputSchema = z.object({
  token: z.string().length(7, 'Token inválido'),
  evento_id: z.string().uuid('ID de evento inválido'),
  asistira: z.boolean(),
  num_acompanantes: z.number().int().min(0).max(20).optional().default(0),
  notas: z.string().max(500).optional(),
});

export const notificacionInputSchema = z.object({
  mensaje: z.string().min(1, 'El mensaje no puede estar vacío').max(1000),
  tipo_destino: z.enum(['todos', 'evento', 'invitacion']),
  evento_id: z.string().uuid().nullable().optional(),
  invitacion_id: z.string().uuid().nullable().optional(),
}).refine((data) => {
  if (data.tipo_destino === 'evento') return !!data.evento_id;
  if (data.tipo_destino === 'invitacion') return !!data.invitacion_id;
  return true;
}, {
  message: 'Debe especificar el destino según el tipo seleccionado',
});