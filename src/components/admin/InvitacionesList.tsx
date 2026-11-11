'use client';

import { useState, useEffect, useCallback } from 'react';
import { InvitacionConEventos } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import InvitacionForm from './InvitacionForm';
import Toast from '@/components/ui/Toast';
import MaterialIcon from '@/components/ui/MaterialIcon';

export default function InvitacionesList() {
  const [invitaciones, setInvitaciones] = useState<InvitacionConEventos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvitacion, setEditingInvitacion] = useState<InvitacionConEventos | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchInvitaciones = useCallback(async () => {
    try {
      const res = await fetch('/api/invitaciones');
      const data = await res.json();
      if (data.success) {
        setInvitaciones(data.data);
      }
    } catch {
      setToast({ message: 'Error al cargar invitaciones', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitaciones();
  }, [fetchInvitaciones]);

  const handleToggleStatus = async (id: string, activa: boolean) => {
    try {
      const res = await fetch(`/api/invitaciones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activa: !activa }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: activa ? 'Invitación revocada' : 'Invitación reactivada', type: 'success' });
        fetchInvitaciones();
      }
    } catch {
      setToast({ message: 'Error al actualizar', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta invitación permanentemente?')) return;

    try {
      const res = await fetch(`/api/invitaciones/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToast({ message: 'Invitación eliminada', type: 'success' });
        fetchInvitaciones();
      }
    } catch {
      setToast({ message: 'Error al eliminar', type: 'error' });
    }
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/?invitacion=${token}`;
    navigator.clipboard.writeText(url);
    setToast({ message: 'Enlace copiado al portapapeles', type: 'success' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-dark">Invitaciones</h2>
          <p className="font-sans text-sm text-dark/50 mt-1">
            {invitaciones.length} invitación(es) creada(s)
          </p>
        </div>
        <Button onClick={() => { setEditingInvitacion(null); setShowForm(true); }}>
          + Nueva invitación
        </Button>
      </div>

      {/* Lista */}
      {invitaciones.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <MaterialIcon name="mail" className="w-12 h-12 mx-auto mb-4 text-primary" />
          <p className="font-serif text-xl text-dark/50">No hay invitaciones aún</p>
          <p className="font-sans text-dark/30 mt-2">Crea la primera invitación para empezar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {invitaciones.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-xl p-5 shadow-elegant hover:shadow-elegant-hover transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-sans font-medium text-dark text-lg">
                      {inv.nombre_invitado}
                    </h3>
                    <Badge variant={inv.activa ? 'success' : 'error'}>
                      {inv.activa ? 'Activa' : 'Revocada'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm font-sans text-dark/50">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {inv.token}
                    </span>
                    <span>·</span>
                    <span>Máx. {inv.max_acompanantes} acompañantes</span>
                    {inv.eventos_detalle.length > 0 && (
                      <>
                        <span>·</span>
                        <span>
                          {inv.eventos_detalle.map(e => e.nombre).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyLink(inv.token)}
                  >
                    <span className="inline-flex items-center gap-1">
                      <MaterialIcon name="copy" className="w-4 h-4" />
                      Copiar
                    </span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingInvitacion(inv); setShowForm(true); }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleStatus(inv.id, inv.activa)}
                  >
                    {inv.activa ? 'Revocar' : 'Activar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(inv.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal formulario */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} size="lg">
        <InvitacionForm
          invitacion={editingInvitacion}
          onSuccess={() => {
            setShowForm(false);
            fetchInvitaciones();
            setToast({ message: editingInvitacion ? 'Invitación actualizada' : 'Invitación creada', type: 'success' });
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}