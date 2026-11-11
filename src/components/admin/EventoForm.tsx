'use client';

import { useState } from 'react';
import { Evento, TipoEvento, BackgroundType } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MaterialIcon from '@/components/ui/MaterialIcon';

interface EventoFormProps {
  evento?: Evento | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EventoForm({ evento, onSuccess, onCancel }: EventoFormProps) {
  const [nombre, setNombre] = useState(evento?.nombre || '');
  const [fecha, setFecha] = useState(evento?.fecha_hora ? evento.fecha_hora.split('T')[0] : '');
  const [hora, setHora] = useState(evento?.fecha_hora ? evento.fecha_hora.split('T')[1].substring(0, 5) : '');
  const [esPublico, setEsPublico] = useState(evento?.es_publico || false);
  const [permiteRsvp, setPermiteRsvp] = useState(evento?.permite_rsvp ?? true);
  const [tipoEvento, setTipoEvento] = useState<TipoEvento>(evento?.tipo_evento || 'presencial');
  const [lugarPublico, setLugarPublico] = useState(evento?.lugar_publico || '');
  const [direccionPrivada, setDireccionPrivada] = useState(evento?.direccion_privada || '');
  const [mapsLink, setMapsLink] = useState(evento?.maps_link || '');
  const [asuntoVirtual, setAsuntoVirtual] = useState(evento?.asunto_virtual || '');
  const [descripcionVirtual, setDescripcionVirtual] = useState(evento?.descripcion_virtual || '');
  const [linkVirtual, setLinkVirtual] = useState(evento?.link_virtual || '');
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(evento?.background_type || 'image');
  const [backgroundImage, setBackgroundImage] = useState(evento?.background_image || '');
  const [gradientCss, setGradientCss] = useState(evento?.gradient_css || '');
  const [lottieIcon, setLottieIcon] = useState(evento?.lottie_icon_url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!evento;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fechaVenezuela = `${fecha}T${hora}:00-04:00`;

    const data = {
      nombre,
      fecha_hora: fechaVenezuela,
      es_publico: esPublico,
      permite_rsvp: permiteRsvp,
      tipo_evento: tipoEvento,
      lugar_publico: tipoEvento === 'presencial' ? lugarPublico : null,
      direccion_privada: tipoEvento === 'presencial' ? direccionPrivada || null : null,
      maps_link: tipoEvento === 'presencial' ? mapsLink || null : null,
      asunto_virtual: tipoEvento === 'virtual' ? asuntoVirtual : null,
      descripcion_virtual: tipoEvento === 'virtual' ? descripcionVirtual || null : null,
      link_virtual: tipoEvento === 'virtual' ? linkVirtual || null : null,
      background_type: backgroundType,
      background_image: backgroundType === 'image' ? backgroundImage || null : null,
      gradient_css: backgroundType === 'gradient' ? gradientCss || null : null,
      lottie_icon_url: lottieIcon || null,
    };

    setIsLoading(true);

    try {
      const url = isEditing ? `/api/eventos/${evento.id}` : '/api/eventos';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Error al guardar');
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
        {isEditing ? 'Editar evento' : 'Nuevo evento'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
        {/* Datos básicos */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <h4 className="font-sans text-sm font-semibold text-dark/50 uppercase tracking-wider">
            Datos básicos
          </h4>
          
          <Input
            label="Nombre del evento"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Ceremonia y Celebración"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <Input
              label="Hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={esPublico}
                onChange={() => setEsPublico(true)}
                className="w-4 h-4 text-primary"
              />
              <span className="font-sans text-sm text-dark">Público</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!esPublico}
                onChange={() => setEsPublico(false)}
                className="w-4 h-4 text-primary"
              />
              <span className="font-sans text-sm text-dark">Privado</span>
            </label>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={permiteRsvp}
              onChange={(e) => setPermiteRsvp(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20"
            />
            <span className="font-sans text-sm text-dark">Permitir confirmación de asistencia (RSVP)</span>
          </label>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={tipoEvento === 'presencial'}
                onChange={() => setTipoEvento('presencial')}
                className="w-4 h-4 text-primary"
              />
              <span className="inline-flex items-center gap-1 font-sans text-sm text-dark">
                <MaterialIcon name="location" className="w-4 h-4 text-primary" /> Presencial
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={tipoEvento === 'virtual'}
                onChange={() => setTipoEvento('virtual')}
                className="w-4 h-4 text-primary"
              />
              <span className="inline-flex items-center gap-1 font-sans text-sm text-dark">
                <MaterialIcon name="computer" className="w-4 h-4 text-primary" /> Virtual
              </span>
            </label>
          </div>
        </div>

        {/* Datos según tipo */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <h4 className="font-sans text-sm font-semibold text-dark/50 uppercase tracking-wider">
            <span className="inline-flex items-center gap-2">
              <MaterialIcon
                name={tipoEvento === 'presencial' ? 'location' : 'computer'}
                className="w-4 h-4"
              />
              {tipoEvento === 'presencial' ? 'Ubicación' : 'Conexión'}
            </span>
          </h4>

          {tipoEvento === 'presencial' ? (
            <>
              <Input
                label="Lugar (nombre visible)"
                value={lugarPublico}
                onChange={(e) => setLugarPublico(e.target.value)}
                placeholder="Ej: Salón del Reino de Lechería"
              />
              <Input
                label="Dirección (solo invitados)"
                value={direccionPrivada}
                onChange={(e) => setDireccionPrivada(e.target.value)}
                placeholder="Ej: #23, Av. Intercomunal, Barcelona"
              />
              <Input
                label="Link de Google Maps"
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                type="url"
              />
            </>
          ) : (
            <>
              <Input
                label="Asunto"
                value={asuntoVirtual}
                onChange={(e) => setAsuntoVirtual(e.target.value)}
                placeholder="Ej: Reunión por Zoom"
              />
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5 font-sans">
                  Descripción
                </label>
                <textarea
                  value={descripcionVirtual}
                  onChange={(e) => setDescripcionVirtual(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-dark font-sans
                             focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={3}
                  placeholder="ID: 123 456 789 | Código: bodas2026"
                />
              </div>
              <Input
                label="Enlace directo"
                value={linkVirtual}
                onChange={(e) => setLinkVirtual(e.target.value)}
                placeholder="https://zoom.us/j/..."
                type="url"
              />
            </>
          )}
        </div>

        {/* Visuales */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <h4 className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-dark/50 uppercase tracking-wider">
            <MaterialIcon name="palette" className="w-4 h-4" />
            Apariencia visual
          </h4>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={backgroundType === 'image'}
                onChange={() => setBackgroundType('image')}
                className="w-4 h-4 text-primary"
              />
              <span className="font-sans text-sm text-dark">Imagen</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={backgroundType === 'gradient'}
                onChange={() => setBackgroundType('gradient')}
                className="w-4 h-4 text-primary"
              />
              <span className="font-sans text-sm text-dark">Gradiente</span>
            </label>
          </div>

          {backgroundType === 'image' ? (
            <Input
              label="Ruta de imagen de fondo"
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
              placeholder="/images/events/mi-evento.webp"
              helperText="Sube la imagen a /public primero"
            />
          ) : (
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5 font-sans">
                CSS del gradiente
              </label>
              <textarea
                value={gradientCss}
                onChange={(e) => setGradientCss(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-dark font-mono text-sm
                           focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                rows={2}
                placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              />
            </div>
          )}

          <Input
            label="Ícono Lottie (.json)"
            value={lottieIcon}
            onChange={(e) => setLottieIcon(e.target.value)}
            placeholder="/lottie/paloma.json"
            helperText="Sube el archivo .json a /public/lottie/"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 font-sans">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            {isEditing ? 'Guardar cambios' : 'Crear evento'}
          </Button>
        </div>
      </form>
    </div>
  );
}