'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import MaterialIcon from '@/components/ui/MaterialIcon';

interface PushNotificationPromptProps {
  token?: string | null;
  lang: string;
}

type PushState = 'ready' | 'subscribed' | 'unsupported' | 'unavailable' | 'error' | 'loading';

function decodeVapidKey(value: string): ArrayBuffer {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = `${value}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }
  return bytes.buffer;
}

export default function PushNotificationPrompt({ token, lang }: PushNotificationPromptProps) {
  const t = useTranslations('events');
  const [state, setState] = useState<PushState>('ready');

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setState('unsupported');
      return;
    }

    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      setState('unavailable');
      return;
    }

    navigator.serviceWorker.getRegistration('/').then(async (registration) => {
      if (registration && await registration.pushManager.getSubscription()) {
        setState('subscribed');
      }
    }).catch(() => setState('error'));
  }, []);

  const enableNotifications = async () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setState('unavailable');
      return;
    }

    setState('loading');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState('error');
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.getSubscription()
        || await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: decodeVapidKey(publicKey),
        });
      const response = await fetch('/api/notificaciones/suscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          token: token || null,
          lang,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Subscription failed');
      }

      setState('subscribed');
    } catch {
      setState('error');
    }
  };

  const buttonLabel = {
    ready: t('remindMe'),
    subscribed: t('remindMeEnabled'),
    unsupported: t('pushUnsupported'),
    unavailable: t('pushUnavailable'),
    error: t('pushError'),
    loading: t('pushLoading'),
  }[state];

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={enableNotifications}
        disabled={state !== 'ready'}
        className="inline-flex items-center gap-2 rounded-full border border-accent-2/60 bg-primary/90 px-5 py-2.5
                   font-sans text-sm text-light shadow-lg backdrop-blur-sm transition-colors
                   hover:bg-primary disabled:cursor-default disabled:opacity-90"
        aria-live="polite"
      >
        <MaterialIcon name={state === 'subscribed' ? 'checkCircle' : 'bell'} className="h-4 w-4" />
        {buttonLabel}
      </button>
    </div>
  );
}
