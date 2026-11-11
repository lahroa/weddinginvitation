'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { useTranslations } from 'next-intl';
import Confetti from '@/components/ui/Confetti';

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const t = useTranslations('events');
  const { days, hours, minutes, seconds, isComplete } = useCountdown(targetDate);

  if (isComplete) {
    return (
      <div className="text-center">
        <p className="font-serif text-3xl md:text-4xl text-primary animate-pulse-soft">
          {t('itsToday')}
        </p>
        <Confetti />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3 md:gap-4">
        {/* Días */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-20 md:w-20 md:h-24 bg-light rounded-lg shadow-md flex items-center justify-center border border-accent-2">
            <span className="font-mono text-3xl md:text-4xl text-primary font-bold">
              {String(days).padStart(2, '0')}
            </span>
          </div>
          <span className="font-sans text-xs text-dark/50 uppercase tracking-wider">
            {t('days')}
          </span>
        </div>

        {/* Separador */}
        <span className="font-mono text-2xl md:text-3xl text-accent/70 mt-4">:</span>

        {/* Horas */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-20 md:w-20 md:h-24 bg-light rounded-lg shadow-md flex items-center justify-center border border-accent-2">
            <span className="font-mono text-3xl md:text-4xl text-primary font-bold">
              {String(hours).padStart(2, '0')}
            </span>
          </div>
          <span className="font-sans text-xs text-dark/50 uppercase tracking-wider">
            {t('hours')}
          </span>
        </div>

        {/* Separador */}
        <span className="font-mono text-2xl md:text-3xl text-accent/70 mt-4">:</span>

        {/* Minutos */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-20 md:w-20 md:h-24 bg-light rounded-lg shadow-md flex items-center justify-center border border-accent-2">
            <span className="font-mono text-3xl md:text-4xl text-primary font-bold">
              {String(minutes).padStart(2, '0')}
            </span>
          </div>
          <span className="font-sans text-xs text-dark/50 uppercase tracking-wider">
            {t('minutes')}
          </span>
        </div>

        {/* Separador */}
        <span className="font-mono text-2xl md:text-3xl text-accent/70 mt-4">:</span>

        {/* Segundos */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-20 md:w-20 md:h-24 bg-light rounded-lg shadow-md flex items-center justify-center border border-accent-2">
            <span className="font-mono text-3xl md:text-4xl text-primary font-bold">
              {String(seconds).padStart(2, '0')}
            </span>
          </div>
          <span className="font-sans text-xs text-dark/50 uppercase tracking-wider">
            {t('seconds')}
          </span>
        </div>
      </div>
    </div>
  );
}