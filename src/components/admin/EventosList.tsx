'use client';

import { useState, useEffect, useCallback } from 'react';
import { Evento } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import EventoForm from './EventoForm';
import Toast from '@/components/ui/Toast';

export default function EventosList() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchEventos = useCallback(async () => {
    try {
      const res = await fetch('/api/eventos');
      const data = await res.json();
      if (data.success) {
        setEventos(data.data);
      }
    } catch {
      setToast({ message: 'Error al cargar eventos', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este evento permanentemente?')) return;

    try {
      const res = await fetch(`/api/eventos/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToast({ message: 'Evento eliminado', type: 'success' });
        fetchEventos();
      }
    } catch {
      setToast({ message: 'Error al eliminar', type: 'error' });
    }
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
        <Toast message={toast.message} type={toast.type} isVisible onClose={() => setToast(null)} />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-dark">Eventos</h2>
          <p className="font-sans text-sm text-dark/50 mt-1">
            {eventos.length} evento(s) creado(s)
          </p>
        </div>
        <Button onClick={() => { setEditingEvento(null); setShowForm(true); }}>
          + Nuevo evento
        </Button>
      </div>

      {eventos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <div className="text-5xl mb-4">📅</div>
          <p className="font-serif text-xl text-dark/50">No hay eventos aún</p>
          <p className="font-sans text-dark/30 mt-2">Crea tu primer evento</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-white rounded-xl p-5 shadow-elegant hover:shadow-elegant-hover transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {evento.tipo_evento === 'presencial' ? '📍' : '💻'}
                    </span>
                    <h3 className="font-sans font-medium text-dark text-lg">
                      {evento.nombre}
                    </h3>
                    <Badge variant={evento.es_publico ? 'info' : 'neutral'}>
                      {evento.es_publico ? 'Público' : 'Privado'}
                    </Badge>
                    {evento.permite_rsvp && (
                      <Badge variant="success">RSVP</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm font-sans text-dark/50">
                    <span>
                      {new Date(evento.fecha_hora).toLocaleDateString('es', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span>·</span>
                    <span>
                      {new Date(evento.fecha_hora).toLocaleTimeString('es', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>·</span>
                    <span>
                      {evento.tipo_evento === 'presencial'
                        ? evento.lugar_publico
                        : evento.asunto_virtual}
                    </span>
                  </div>

                  {evento.lottie_icon_url && (
                    <p className="font-sans text-xs text-dark/30 mt-2">
                      🎬 Animación: {evento.lottie_icon_url}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingEvento(evento); setShowForm(true); }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(evento.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} size="xl">
        <EventoForm
          evento={editingEvento}
          onSuccess={() => {
            setShowForm(false);
            fetchEventos();
            setToast({
              message: editingEvento ? 'Evento actualizado' : 'Evento creado',
              type: 'success',
            });
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}