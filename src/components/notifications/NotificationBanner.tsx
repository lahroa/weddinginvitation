'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationToast from './NotificationToast';

interface NotificationBannerProps {
  token?: string | null;
}

export default function NotificationBanner({ token }: NotificationBannerProps) {
  const { notifications } = useNotifications(token);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const storageKey = `dismissed-notifications:${token || 'public'}`;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      setDismissedIds(
        Array.isArray(parsed) && parsed.every((id): id is string => typeof id === 'string')
          ? parsed
          : []
      );
    } catch {
      setDismissedIds([]);
    }
    setLoadedStorageKey(storageKey);
  }, [storageKey]);

  const dismissNotification = useCallback((id: string) => {
    setDismissedIds((previous) => {
      if (previous.includes(id)) return previous;
      const updated = [...previous, id];
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // Keep the notification dismissed for the current page if storage is unavailable.
      }
      return updated;
    });
  }, [storageKey]);

  const visibleNotifications = useMemo(
    () => loadedStorageKey === storageKey
      ? notifications.filter((notification) => !dismissedIds.includes(notification.id)).slice(0, 2)
      : [],
    [dismissedIds, loadedStorageKey, notifications, storageKey]
  );

  useEffect(() => {
    if (visibleNotifications.length === 0) return;
    
    const timers = visibleNotifications.map((n) => {
      return setTimeout(() => {
        dismissNotification(n.id);
      }, 8000);
    });

    return () => timers.forEach(clearTimeout);
  }, [dismissNotification, visibleNotifications]);

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2
                    pointer-events-none sm:bottom-6"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex flex-col gap-3 pointer-events-auto">
        {visibleNotifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            id={notification.id}
            mensaje={notification.mensaje}
            onDismiss={dismissNotification}
          />
        ))}
      </div>
    </div>
  );
}