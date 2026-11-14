'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MaterialIcon from '@/components/ui/MaterialIcon';

interface NotificationToastProps {
  id: string;
  mensaje: string;
  onDismiss: (id: string) => void;
}

export default function NotificationToast({ id, mensaje, onDismiss }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="rounded-xl border border-light/20 bg-primary/75 px-5 py-4 text-light shadow-xl
                     backdrop-blur-xl max-w-sm w-full"
        >
          <div className="flex items-start gap-3">
            <MaterialIcon name="bell" className="w-5 h-5 mt-0.5 text-light" />
            <p className="font-sans text-sm text-light flex-1 leading-relaxed">{mensaje}</p>
            <button
              onClick={handleDismiss}
              aria-label="Cerrar notificación"
              className="text-light/70 hover:text-light transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}