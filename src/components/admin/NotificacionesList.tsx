'use client';

import { useState, useCallback } from 'react';
import NotificacionForm from './NotificacionForm';
import Toast from '@/components/ui/Toast';

export default function NotificacionesList() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSuccess = useCallback(() => {
    setToast({ message: 'Notificación enviada correctamente', type: 'success' });
  }, []);

  return (
    <div>
      {toast && (
        <Toast message={toast.message} type={toast.type} isVisible onClose={() => setToast(null)} />
      )}

      <div className="mb-8">
        <h2 className="font-serif text-3xl text-dark">Notificaciones</h2>
        <p className="font-sans text-sm text-dark/50 mt-1">
          Envía avisos a los invitados
        </p>
      </div>

      <NotificacionForm onSuccess={handleSuccess} />
    </div>
  );
}