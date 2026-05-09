'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';

interface EventRSVPProps {
  token: string;
  eventoId: string;
  maxAcompanantes: number;
  acompanantesYaUsados: number;
}

export default function EventRSVP({ 
  token, 
  eventoId, 
  maxAcompanantes, 
  acompanantesYaUsados 
}: EventRSVPProps) {
  const t = useTranslations('events');
  const [asistira, setAsistira] = useState(false);
  const [numAcompanantes, setNumAcompanantes] = useState(0);
  const [notas, setNotas] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const disponibles = maxAcompanantes - acompanantesYaUsados;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/asistencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          evento_id: eventoId,
          asistira,
          num_acompanantes: asistira ? numAcompanantes : 0,
          notas,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Error al confirmar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {success && (
        <Toast
          message={t('attendanceRegistered')}
          type="success"
          isVisible={success}
          onClose={() => setSuccess(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg max-w-lg mx-auto mt-6">
        <h3 className="font-serif text-xl text-dark text-center mb-6">
          {t('confirmAttendance')}
        </h3>

        {/* Checkbox asistiré */}
        <label className="flex items-center gap-3 cursor-pointer group mb-6">
          <div className="relative">
            <input
              type="checkbox"
              checked={asistira}
              onChange={(e) => setAsistira(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
              asistira 
                ? 'bg-gold border-gold' 
                : 'border-gray-300 group-hover:border-gold/50'
            }`}>
              {asistira && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="font-sans text-dark">{t('willAttend')}</span>
        </label>

        {/* Acompañantes */}
        {asistira && (
          <div className="mb-6 animate-fade-in">
            <label className="block font-sans text-sm text-dark/70 mb-2">
              {t('companions')} 
              <span className="text-dark/40 ml-1">
                ({t('maxCompanions')} {maxAcompanantes})
              </span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNumAcompanantes(Math.max(0, numAcompanantes - 1))}
                className="w-10 h-10 rounded-full border-2 border-gold/30 text-gold flex items-center justify-center hover:bg-gold/10 transition-colors text-xl font-sans"
              >
                −
              </button>
              <span className="font-mono text-2xl text-dark min-w-[3ch] text-center">
                {numAcompanantes}
              </span>
              <button
                type="button"
                onClick={() => setNumAcompanantes(Math.min(disponibles, numAcompanantes + 1))}
                className="w-10 h-10 rounded-full border-2 border-gold/30 text-gold flex items-center justify-center hover:bg-gold/10 transition-colors text-xl font-sans"
              >
                +
              </button>
            </div>
            {disponibles === 0 && (
              <p className="text-sm text-rose mt-2">Ya alcanzaste el máximo de acompañantes</p>
            )}
          </div>
        )}

        {/* Notas */}
        {asistira && (
          <div className="mb-6 animate-fade-in">
            <label className="block font-sans text-sm text-dark/70 mb-2">
              {t('notes')} <span className="text-dark/40">(opcional)</span>
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-dark font-sans placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-gold resize-none"
              rows={2}
              maxLength={500}
              placeholder="Alergias, restricciones alimenticias..."
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 mb-4 font-sans">{error}</p>
        )}

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          {t('confirm')}
        </Button>
      </form>
    </>
  );
}