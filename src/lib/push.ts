import { sendNotification, setVapidDetails, type PushSubscription } from 'web-push';
import sql from './db';
import { Notificacion } from '@/types';

interface PushTarget {
  endpoint: string;
  p256dh: string;
  auth: string;
  lang: string;
  token: string | null;
}

interface PushDeliverySummary {
  configured: boolean;
  sent: number;
  failed: number;
}

function configureWebPush(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) return false;

  setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:notifications@example.com',
    publicKey,
    privateKey
  );
  return true;
}

export async function savePushSubscription(
  subscription: PushSubscription,
  invitationId: string | null,
  lang: string
): Promise<void> {
  await sql`
    INSERT INTO suscripciones_push (endpoint, p256dh, auth, invitacion_id, idioma)
    VALUES (
      ${subscription.endpoint},
      ${subscription.keys.p256dh},
      ${subscription.keys.auth},
      ${invitationId},
      ${lang}
    )
    ON CONFLICT (endpoint) DO UPDATE SET
      p256dh = EXCLUDED.p256dh,
      auth = EXCLUDED.auth,
      invitacion_id = EXCLUDED.invitacion_id,
      idioma = EXCLUDED.idioma,
      actualizado_en = NOW()
  `;
}

async function getPushTargets(notification: Notificacion): Promise<PushTarget[]> {
  if (notification.tipo_destino === 'evento' && notification.evento_id) {
    const result = await sql`
      SELECT DISTINCT s.endpoint, s.p256dh, s.auth, s.idioma AS lang, i.token
      FROM suscripciones_push s
      INNER JOIN invitaciones i ON i.id = s.invitacion_id AND i.activa = true
      WHERE s.invitacion_id IN (
        SELECT invitacion_id FROM invitacion_evento
        WHERE evento_id = ${notification.evento_id}
      )
    `;
    return result as PushTarget[];
  }

  if (notification.tipo_destino === 'invitacion' && notification.invitacion_id) {
    const result = await sql`
      SELECT s.endpoint, s.p256dh, s.auth, s.idioma AS lang, i.token
      FROM suscripciones_push s
      INNER JOIN invitaciones i ON i.id = s.invitacion_id AND i.activa = true
      WHERE s.invitacion_id = ${notification.invitacion_id}
    `;
    return result as PushTarget[];
  }

  const result = await sql`
    SELECT s.endpoint, s.p256dh, s.auth, s.idioma AS lang, i.token
    FROM suscripciones_push s
    LEFT JOIN invitaciones i ON i.id = s.invitacion_id AND i.activa = true
    WHERE s.invitacion_id IS NULL OR i.id IS NOT NULL
  `;
  return result as PushTarget[];
}

export async function sendPushNotification(
  notification: Notificacion
): Promise<PushDeliverySummary> {
  if (!configureWebPush()) {
    return { configured: false, sent: 0, failed: 0 };
  }

  const targets = await getPushTargets(notification);
  const results = await Promise.all(
    targets.map(async (target) => {
      const subscription: PushSubscription = {
        endpoint: target.endpoint,
        keys: { p256dh: target.p256dh, auth: target.auth },
      };
      const tokenQuery = target.token
        ? `?invitacion=${encodeURIComponent(target.token)}`
        : '';
      const payload = JSON.stringify({
        title: process.env.NEXT_PUBLIC_NOMBRES_NOVIOS || 'Luis & Daniela',
        body: notification.mensaje,
        url: `/${target.lang}${tokenQuery}`,
      });

      try {
        await sendNotification(subscription, payload);
        return true;
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await sql`DELETE FROM suscripciones_push WHERE endpoint = ${target.endpoint}`;
        }
        return false;
      }
    })
  );

  const sent = results.filter(Boolean).length;
  return {
    configured: true,
    sent,
    failed: results.length - sent,
  };
}
