'use client';

import { useTranslations } from 'next-intl';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import TokenInput from './TokenInput';
import LottieIcon from '@/components/events/LottieIcon';

interface TokenBannerProps {
  lang: string;
  invitadoNombre?: string | null;
}

export default function TokenBanner({ lang, invitadoNombre }: TokenBannerProps) {
  const t = useTranslations('invitation');
  const { ref: iconRef, isVisible: iconVisible } = useScrollReveal();

  if (invitadoNombre) {
    return (
      <div className="py-8 px-4 bg-accent-2/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-serif text-2xl text-primary">
            {t('welcome', { name: invitadoNombre })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-cream">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Ícono */}
        <div ref={iconRef} aria-hidden="true" className="mb-6">
          <LottieIcon
            src="/lottie/3090-mail-open-document.json"
            size={64}
            autoplay={false}
            loop={false}
            playOnReveal
            revealEnabled={iconVisible}
            repeatHoverAfterReveal
          />
        </div>

        {/* Título */}
        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
          {t('title')}
        </h2>

        {/* Descripción */}
        <p className="font-sans text-dark/60 text-lg mb-8 leading-relaxed">
          {t('description')}
        </p>

        {/* Input */}
        <TokenInput lang={lang} />
      </div>
    </section>
  );
}