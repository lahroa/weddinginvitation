-- Insertar eventos de ejemplo

-- Evento público: Pre-Boda (todos lo ven)
INSERT INTO eventos (
  nombre, fecha_hora, es_publico, permite_rsvp, tipo_evento,
  lugar_publico, maps_link,
  background_image, background_type,
  lottie_icon_url
) VALUES (
  'Pre-Boda en la Playa',
  '2026-07-25 15:00:00-04',
  true,
  false,
  'presencial',
  'Playa El Morro, Lechería',
  'https://maps.google.com/?q=Playa+El+Morro+Lecheria',
  '/images/events/playa-bg.webp',
  'image',
  '/lottie/paloma.json'
);

-- Evento privado: Discurso
INSERT INTO eventos (
  nombre, fecha_hora, es_publico, permite_rsvp, tipo_evento,
  lugar_publico, direccion_privada, maps_link,
  background_image, background_type,
  lottie_icon_url
) VALUES (
  'Discurso de Bodas',
  '2026-07-26 19:00:00-04',
  false,
  true,
  'presencial',
  'Salón del Reino de Lechería',
  '#23, Av. Intercomunal, Barcelona, Anzoátegui',
  'https://maps.google.com/?q=Salon+del+Reino+Lecheria',
  '/images/events/discurso-bg.webp',
  'image',
  '/lottie/microfono.json'
);

-- Evento privado: Boda principal
INSERT INTO eventos (
  nombre, fecha_hora, es_publico, permite_rsvp, tipo_evento,
  lugar_publico, direccion_privada, maps_link,
  background_image, background_type,
  lottie_icon_url
) VALUES (
  'Ceremonia y Celebración',
  '2026-07-27 16:00:00-04',
  false,
  true,
  'presencial',
  'Salón del Reino de Lechería',
  '#23, Av. Intercomunal, Barcelona, Anzoátegui',
  'https://maps.google.com/?q=Salon+del+Reino+Lecheria',
  '/images/events/boda-bg.webp',
  'image',
  '/lottie/anillos.json'
);