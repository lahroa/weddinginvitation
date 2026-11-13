ALTER TABLE configuracion_sitio
  ADD COLUMN IF NOT EXISTS share_message_es TEXT NOT NULL DEFAULT E'Hola [nombre]\n\nDeseamos compartir contigo esta invitación a un día muy especial para nosotros. Deseamos que nos puedas acompañar este día. Encontraras más detalles en el sitio web que te dejo abajo.\n\n[enlace]',
  ADD COLUMN IF NOT EXISTS share_message_en TEXT NOT NULL DEFAULT E'Hello [nombre]\n\nWe would love to share this invitation to a very special day with you. We hope you can join us. You will find more details on the website below.\n\n[enlace]';
