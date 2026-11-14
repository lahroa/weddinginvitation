import { z } from 'zod';

export const eventoInputSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  fecha_hora: z.string().refine(
    (val) => {
      // Validar formato ISO 8601 con o sin zona horaria
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2})?$/;
      if (!isoRegex.test(val)) return false;
      
      // Validar que sea una fecha real
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Fecha inválida. Formato esperado: YYYY-MM-DDTHH:mm:ss±HH:MM' }
  ),
  es_publico: z.boolean(),
  permite_rsvp: z.boolean(),
  tipo_evento: z.enum(['presencial', 'virtual']),
  lugar_publico: z.string().nullable().optional(),
  direccion_privada: z.string().nullable().optional(),
  maps_link: z.string().nullable().optional(),
  asunto_virtual: z.string().nullable().optional(),
  descripcion_virtual: z.string().nullable().optional(),
  link_virtual: z.string().nullable().optional(),
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
  eventos_ids: z.array(z.string()),
});

export const asistenciaInputSchema = z.object({
  token: z.string().length(7, 'Token inválido'),
  evento_id: z.string(),
  asistira: z.boolean(),
  num_acompanantes: z.number().int().min(0).max(20).optional().default(0),
  notas: z.string().max(500).optional(),
});

export const notificacionInputSchema = z.object({
  mensaje: z.string().min(1, 'El mensaje no puede estar vacío').max(1000),
  tipo_destino: z.enum(['todos', 'evento', 'invitacion']),
  evento_id: z.string().nullable().optional(),
  invitacion_id: z.string().nullable().optional(),
}).refine((data) => {
  if (data.tipo_destino === 'evento') return !!data.evento_id;
  if (data.tipo_destino === 'invitacion') return !!data.invitacion_id;
  return true;
}, {
  message: 'Debe especificar el destino según el tipo seleccionado',
});

export const pushSubscriptionInputSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url().max(2048).refine((value) => value.startsWith('https://'), {
      message: 'El endpoint de notificaciones no es válido',
    }),
    keys: z.object({
      p256dh: z.string().min(1).max(256),
      auth: z.string().min(1).max(256),
    }),
  }),
  token: z.string().length(7).nullable().optional(),
  lang: z.string().min(2).max(5),
});