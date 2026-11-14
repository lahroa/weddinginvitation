'use client';

import { useMusic } from '@/hooks/useMusic';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import LottieIcon from '@/components/events/LottieIcon';
import MaterialIcon from '@/components/ui/MaterialIcon';

export default function BackgroundMusic() {
  const t = useTranslations('music');
  const { isPlaying, toggleMusic, isLoaded } = useMusic('/audio/On-Top-Of-The-World.mp3');

  if (!isLoaded) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' }}
      className="fixed bottom-6 right-6 z-40"
    >
      <button
        onClick={toggleMusic}
        className="relative group min-w-11 min-h-11"
        aria-label={isPlaying ? t('off') : t('on')}
      >
        {/* Botón principal */}
        <div className="relative w-14 h-14 rounded-full bg-primary shadow-xl border-2 border-accent-2/70 
                        flex items-center justify-center
                        hover:border-accent-2 hover:shadow-2xl
                        transition-all duration-300">
          {isPlaying ? (
            <LottieIcon
              src="/lottie/system-outline-1045.json"
              size={44}
              color="light"
              marker="default:hover-pinch"
            />
          ) : (
            <MaterialIcon name="volumeOff" className="w-6 h-6 text-light" />
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-primary text-light text-xs font-sans 
                        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                        pointer-events-none">
          {isPlaying ? t('off') : t('on')}
          <div className="absolute top-full right-4 w-2 h-2 bg-primary rotate-45 -mt-1" />
        </div>
      </button>
    </motion.div>
  );
}