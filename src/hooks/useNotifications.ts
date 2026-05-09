'use client';

import { useState, useEffect, useCallback } from 'react';
import { Notificacion } from '@/types';

export function useNotifications(token?: string | null) {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());

  const fetchNotifications = useCallback(async () => {
    try {
      const params = token ? `?token=${token}` : '';
      const res = await fetch(`/api/notificaciones${params}`);
      const data = await res.json();
      
      if (data.success && data.data) {
        setNotifications(data.data);
        setLastFetch(new Date());
      }
    } catch {
      // Silencioso
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return { notifications, lastFetch, refetch: fetchNotifications };
}