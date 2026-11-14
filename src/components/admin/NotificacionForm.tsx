'use client';

import { useState, useEffect } from 'react';
import { Evento, InvitacionConEventos } from '@/types';
import Button from '@/components/ui/Button';
import MaterialIcon from '@/components/ui/MaterialIcon';

interface NotificacionFormProps {
  onSuccess: (push: { configured: boolean; sent: number; failed: number }) => void;
}

export default function NotificacionForm({ onSuccess }: NotificacionFormProps) {
  const [tipoDestino, setTipoDestino] = useState<'todos' | 'evento' | 'invitacion'>('todos');
  const [eventoId, setEventoId] = useState('');
  const [invitacionId, setInvitacionId] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [invitaciones, setInvitaciones] = useState<InvitacionConEventos[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/eventos')
      .then(r => r.json())
      .then(d => { if (d.success) setEventos(d.data); });

    fetch('/api/invitaciones')
      .then(r => r.json())
      .then(d => { if (d.success) setInvitaciones(d.data.filter((i: InvitacionConEventos) => i.activa)); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!mensaje.trim()) {
      setError('El mensaje es requerido');
      return;
    }

    if (tipoDestino === 'evento' && !eventoId) {
      setError('Selecciona un evento');
      return;
    }

    if (tipoDestino === 'invitacion' && !invitacionId) {
      setError('Selecciona un invitado');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/notificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: mensaje.trim(),
          tipo_destino: tipoDestino,
          evento_id: tipoDestino === 'evento' ? eventoId : null,
          invitacion_id: tipoDestino === 'invitacion' ? invitacionId : null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMensaje('');
        setTipoDestino('todos');
        onSuccess(data.push);
      } else {
        setError(data.error || 'Error al enviar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-elegant max-w-2xl">
      <h3 className="font-serif text-xl text-dark mb-6">Enviar notificación</h3>

      <div className="space-y-5">
        {/* Destino */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2 font-sans">
            Destinatarios
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-accent/50 transition-colors">
              <input
                type="radio"
                checked={tipoDestino === 'todos'}
                onChange={() => setTipoDestino('todos')}
                className="w-4 h-4 text-primary"
              />
              <span className="inline-flex items-center gap-2 font-sans text-dark">
                <MaterialIcon name="public" className="w-5 h-5 text-primary" />
                Todos los visitantes
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-accent/50 transition-colors">
              <input
                type="radio"
                checked={tipoDestino === 'evento'}
                onChange={() => setTipoDestino('evento')}
                className="w-4 h-4 text-primary"
              />
              <span className="inline-flex items-center gap-2 font-sans text-dark">
                <MaterialIcon name="calendar" className="w-5 h-5 text-primary" />
                Invitados de un evento específico
              </span>
            </label>

            {tipoDestino === 'evento' && (
              <select
                value={eventoId}
                onChange={(e) => setEventoId(e.target.value)}
                className="w-full ml-7 px-4 py-2.5 rounded-lg border-2 border-gray-200 font-sans
                           focus:outline-none focus:border-primary"
              >
                <option value="">Seleccionar evento...</option>
                {eventos.filter(e => !e.es_publico).map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.nombre}</option>
                ))}
              </select>
            )}

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-accent/50 transition-colors">
              <input
                type="radio"
                checked={tipoDestino === 'invitacion'}
                onChange={() => setTipoDestino('invitacion')}
                className="w-4 h-4 text-primary"
              />
              <span className="inline-flex items-center gap-2 font-sans text-dark">
                <MaterialIcon name="mail" className="w-5 h-5 text-primary" />
                Invitado específico
              </span>
            </label>

            {tipoDestino === 'invitacion' && (
              <select
                value={invitacionId}
                onChange={(e) => setInvitacionId(e.target.value)}
                className="w-full ml-7 px-4 py-2.5 rounded-lg border-2 border-gray-200 font-sans
                           focus:outline-none focus:border-primary"
              >
                <option value="">Seleccionar invitado...</option>
                {invitaciones.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.nombre_invitado} ({inv.token})</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2 font-sans">
            Mensaje
          </label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-dark font-sans
                       focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            rows={4}
            maxLength={1000}
            placeholder="Escribe el mensaje que quieres enviar..."
          />
          <p className="text-xs text-dark/40 font-sans mt-1 text-right">
            {mensaje.length}/1000
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-sans">{error}</p>
        )}

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          <span className="inline-flex items-center gap-2">
            <MaterialIcon name="rocket" className="w-5 h-5" />
            Enviar notificación
          </span>
        </Button>
      </div>
    </form>
  );
}