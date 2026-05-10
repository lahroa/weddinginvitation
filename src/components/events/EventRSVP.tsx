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
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 max-w-md mx-auto border border-white/20">
      {success ? (
        <div className="text-center py-4">
          <div className="text-5xl mb-4">✅</div>
          <p className="font-serif text-2xl text-white mb-2">¡Gracias!</p>
          <p className="font-sans text-white/70">{t('attendanceRegistered')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3 className="font-serif text-xl text-white text-center mb-6">
            {t('confirmAttendance')}
          </h3>

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
                  : 'border-white/50 group-hover:border-white'
              }`}>
                {asistira && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="font-sans text-white">{t('willAttend')}</span>
          </label>

          {asistira && (
            <>
              <div className="mb-6 animate-fade-in">
                <label className="block font-sans text-sm text-white/70 mb-2">
                  {t('companions')} ({t('maxCompanions')} {maxAcompanantes})
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setNumAcompanantes(Math.max(0, numAcompanantes - 1))}
                    className="w-10 h-10 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:bg-white/10 transition-colors text-xl"
                  >
                    −
                  </button>
                  <span className="font-mono text-2xl text-white min-w-[3ch] text-center">
                    {numAcompanantes}
                  </span>
                  <button
                    type="button"
                    onClick={() => setNumAcompanantes(Math.min(disponibles, numAcompanantes + 1))}
                    className="w-10 h-10 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:bg-white/10 transition-colors text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-6 animate-fade-in">
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans text-sm resize-none focus:outline-none focus:border-white/50"
                  rows={2}
                  maxLength={500}
                  placeholder="Alergias, restricciones alimenticias..."
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-red-300 mb-4 font-sans">{error}</p>
          )}

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {t('confirm')}
          </Button>
        </form>
      )}
    </div>
  );
}