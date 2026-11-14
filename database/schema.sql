-- Ejecutar en la consola SQL de Neon

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Imagen usada al compartir la invitación en redes sociales
CREATE TABLE configuracion_sitio (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  og_image_url TEXT NOT NULL DEFAULT '/images/og-image.jpg',
  share_message_es TEXT NOT NULL DEFAULT E'Hola [nombre]\n\nDeseamos compartir contigo esta invitación a un día muy especial para nosotros. Deseamos que nos puedas acompañar este día. Encontraras más detalles en el sitio web que te dejo abajo.\n\n[enlace]',
  share_message_en TEXT NOT NULL DEFAULT E'Hello [nombre]\n\nWe would love to share this invitation to a very special day with you. We hope you can join us. You will find more details on the website below.\n\n[enlace]',
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO configuracion_sitio (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Tabla de eventos
CREATE TABLE eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  fecha_hora TIMESTAMPTZ NOT NULL,
  es_publico BOOLEAN DEFAULT false,
  permite_rsvp BOOLEAN DEFAULT true,
  tipo_evento VARCHAR(10) DEFAULT 'presencial' CHECK (tipo_evento IN ('presencial', 'virtual')),
  
  -- Presencial
  lugar_publico TEXT,
  direccion_privada TEXT,
  maps_link TEXT,
  
  -- Virtual
  asunto_virtual TEXT,
  descripcion_virtual TEXT,
  link_virtual TEXT,
  
  -- Visuales
  background_image TEXT,
  background_type VARCHAR(10) DEFAULT 'image' CHECK (background_type IN ('image', 'gradient')),
  gradient_css TEXT,
  lottie_icon_url TEXT,
  
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de invitaciones
CREATE TABLE invitaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(7) UNIQUE NOT NULL,
  nombre_invitado TEXT NOT NULL,
  max_acompanantes INT DEFAULT 2,
  activa BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Relación invitación-evento (eventos privados asignados)
CREATE TABLE invitacion_evento (
  invitacion_id UUID REFERENCES invitaciones(id) ON DELETE CASCADE,
  evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE,
  PRIMARY KEY (invitacion_id, evento_id)
);

-- Asistencias
CREATE TABLE asistencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitacion_id UUID REFERENCES invitaciones(id) ON DELETE CASCADE,
  evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE,
  asistira BOOLEAN NOT NULL,
  num_acompanantes INT DEFAULT 0,
  notas TEXT,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(invitacion_id, evento_id)
);

-- Notificaciones
CREATE TABLE notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mensaje TEXT NOT NULL,
  tipo_destino VARCHAR(20) NOT NULL CHECK (tipo_destino IN ('todos', 'evento', 'invitacion')),
  evento_id UUID REFERENCES eventos(id) ON DELETE SET NULL,
  invitacion_id UUID REFERENCES invitaciones(id) ON DELETE SET NULL,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Suscripciones de navegador para notificaciones push
CREATE TABLE suscripciones_push (
  endpoint TEXT PRIMARY KEY,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  invitacion_id UUID REFERENCES invitaciones(id) ON DELETE CASCADE,
  idioma VARCHAR(5) NOT NULL DEFAULT 'es' CHECK (idioma IN ('es', 'en')),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_invitaciones_token ON invitaciones(token);
CREATE INDEX idx_invitaciones_activa ON invitaciones(activa);
CREATE INDEX idx_eventos_publico ON eventos(es_publico);
CREATE INDEX idx_asistencias_invitacion ON asistencias(invitacion_id);
CREATE INDEX idx_notificaciones_destino ON notificaciones(tipo_destino);
CREATE INDEX idx_suscripciones_push_invitacion ON suscripciones_push(invitacion_id);