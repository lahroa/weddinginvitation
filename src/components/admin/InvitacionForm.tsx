'use client';

import { useState, useEffect } from 'react';
import { InvitacionConEventos, Evento } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface InvitacionFormProps {
  invitacion?: InvitacionConEventos | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function InvitacionForm({ invitacion, onSuccess, onCancel }: InvitacionFormProps) {
  const [nombre, setNombre] = useState(invitacion?.nombre_invitado || '');
  const [maxAcompanantes, setMaxAcompanantes] = useState(invitacion?.max_acompanantes || 2);
  const [selectedEventos, setSelectedEventos] = useState<string[]>(invitacion?.eventos || []);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!invitacion;

  useEffect(() => {
    fetch('/api/eventos')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const privados = data.data.filter((e: Evento) => !e.es_publico);
          setEventos(privados);
        }
      })
      .catch(() => {});
  }, []);

  const toggleEvento = (eventoId: string) => {
    setSelectedEventos(prev =>
      prev.includes(eventoId)
        ? prev.filter(id => id !== eventoId)
        : [...prev, eventoId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    setIsLoading(true);

    try {
      const url = isEditing
        ? `/api/invitaciones/${invitacion.id}`
        : '/api/invitaciones';
      
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_invitado: nombre.trim(),
          max_acompanantes: maxAcompanantes,
          eventos_ids: selectedEventos,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || 'Error al guardar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-serif text-2xl text-dark mb-6">
        {isEditing ? 'Editar invitación' : 'Nueva invitación'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombre del invitado"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Familia Gómez"
        />

        <div>
          <label className="block text-sm font-medium text-dark mb-1.5 font-sans">
            Máximo de acompañantes
          </label>
          <input
            type="number"
            value={maxAcompanantes}
            onChange={(e) => setMaxAcompanantes(Number(e.target.value))}
            min={0}
            max={20}
            className="w-24 px-4 py-3 rounded-lg border-2 border-gray-200 text-center text-lg font-mono
                       focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        </div>

        {/* Eventos privados disponibles */}
        {eventos.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-dark mb-3 font-sans">
              Eventos a los que se invita
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {eventos.map((evento) => (
                <label
                  key={evento.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer
                             hover:border-gold/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedEventos.includes(evento.id)}
                    onChange={() => toggleEvento(evento.id)}
                    className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold/20"
                  />
                  <div>
                    <p className="font-sans text-dark font-medium">{evento.nombre}</p>
                    <p className="font-sans text-xs text-dark/40">
                      {new Date(evento.fecha_hora).toLocaleDateString('es', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {eventos.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="font-sans text-sm text-yellow-800">
              No hay eventos privados disponibles.{' '}
              Crea eventos privados primero para poder asignarlos a invitaciones.
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 font-sans">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            {isEditing ? 'Guardar cambios' : 'Crear invitación'}
          </Button>
        </div>
      </form>
    </div>
  );
}