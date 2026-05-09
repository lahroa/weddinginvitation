'use client';

import { useMusic } from '@/hooks/useMusic';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackgroundMusic() {
  const t = useTranslations('music');
  const { isPlaying, toggleMusic, isLoaded } = useMusic('/audio/musica.mp3');

  if (!isLoaded) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: 'spring' }}
      className="fixed bottom-6 right-6 z-40"
    >
      <button
        onClick={toggleMusic}
        className="relative group"
        aria-label={isPlaying ? t('off') : t('on')}
      >
        {/* Círculo exterior con pulso */}
        <div className={`absolute inset-0 rounded-full bg-gold/20 ${
          isPlaying ? 'animate-ping' : ''
        }`} />

        {/* Botón principal */}
        <div className="relative w-14 h-14 rounded-full bg-white shadow-xl border-2 border-gold/30 
                        flex items-center justify-center
                        hover:border-gold hover:shadow-2xl
                        transition-all duration-300">
          {/* Icono */}
          <span className="text-2xl">
            {isPlaying ? '🔊' : '🔇'}
          </span>

          {/* Barras de ecualizador */}
          <AnimatePresence>
            {isPlaying && (
              <div className="absolute -top-1 -right-1 flex items-end gap-0.5">
                {[2, 3, 1, 4, 2].map((height, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gold rounded-full"
                    initial={{ height: 2 }}
                    animate={{ height: height * 3 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 0.4 + i * 0.15,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-dark text-white text-xs font-sans 
                        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                        pointer-events-none">
          {isPlaying ? t('off') : t('on')}
          <div className="absolute top-full right-4 w-2 h-2 bg-dark rotate-45 -mt-1" />
        </div>
      </button>
    </motion.div>
  );
}