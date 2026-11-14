'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function PageLoadingGate({
  children,
  guestName,
}: {
  children: React.ReactNode;
  guestName?: string | null;
}) {
  const t = useTranslations('loading');
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const revealPage = () => {
      const criticalImages = Array.from(
        contentRef.current?.querySelectorAll<HTMLImageElement>(
          'img:not([loading="lazy"])'
        ) ?? []
      );
      const resources = [
        document.fonts.ready,
        ...criticalImages.map((image) =>
          image.decode().catch((error: unknown) => {
            console.error(`No se pudo decodificar la imagen ${image.currentSrc || image.src}.`, error);
          })
        ),
      ];

      void Promise.all(resources).then(() => {
        if (!cancelled) setIsReady(true);
      });
    };

    if (document.readyState === 'complete') {
      revealPage();
    } else {
      window.addEventListener('load', revealPage, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', revealPage);
    };
  }, []);

  const openInvitation = () => {
    window.dispatchEvent(new Event('invitation:open'));
    setIsOpen(true);
  };

  return (
    <>
      <motion.div
        ref={contentRef}
        aria-hidden={!isOpen}
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="invitation-cover"
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          >
            <LoadingScreen
              isReady={isReady}
              preparingText={t('preparing')}
              greetingText={guestName ? t('greeting', { name: guestName }) : null}
              openText={t('open')}
              onOpen={isReady ? openInvitation : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
