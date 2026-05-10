'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationToast from './NotificationToast';

interface NotificationBannerProps {
  token?: string | null;
}

export default function NotificationBanner({ token }: NotificationBannerProps) {
  const { notifications } = useNotifications(token);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [visibleNotifications, setVisibleNotifications] = useState<typeof notifications>([]);

  // Filtrar no descartadas y limitar a 2 visibles
  useEffect(() => {
    const active = notifications.filter((n) => !dismissedIds.includes(n.id));
    setVisibleNotifications(active.slice(0, 2));
  }, [notifications, dismissedIds]);

  // Auto-descartar después de 8 segundos
  useEffect(() => {
    if (visibleNotifications.length === 0) return;
    
    const timers = visibleNotifications.map((n) => {
      return setTimeout(() => {
        setDismissedIds((prev) => [...prev, n.id]);
      }, 8000);
    });

    return () => timers.forEach(clearTimeout);
  }, [visibleNotifications]);

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {visibleNotifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            id={notification.id}
            mensaje={notification.mensaje}
            onDismiss={(id) => {
              setDismissedIds((prev) => [...prev, id]);
            }}
          />
        ))}
      </div>
    </div>
  );
}