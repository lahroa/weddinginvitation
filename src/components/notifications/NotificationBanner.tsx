'use client';

import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationToast from './NotificationToast';

interface NotificationBannerProps {
  token?: string | null;
}

export default function NotificationBanner({ token }: NotificationBannerProps) {
  const { notifications } = useNotifications(token);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeNotifications = notifications.filter(
    (n) => !dismissedIds.includes(n.id)
  );

  if (activeNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {activeNotifications.slice(0, 3).map((notification) => (
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