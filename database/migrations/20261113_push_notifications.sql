CREATE TABLE IF NOT EXISTS suscripciones_push (
  endpoint TEXT PRIMARY KEY,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  invitacion_id UUID REFERENCES invitaciones(id) ON DELETE CASCADE,
  idioma VARCHAR(5) NOT NULL DEFAULT 'es' CHECK (idioma IN ('es', 'en')),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suscripciones_push_invitacion
  ON suscripciones_push(invitacion_id);
