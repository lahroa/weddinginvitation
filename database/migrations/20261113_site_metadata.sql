CREATE TABLE IF NOT EXISTS configuracion_sitio (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  og_image_url TEXT NOT NULL DEFAULT '/images/og-image.jpg',
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO configuracion_sitio (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;
