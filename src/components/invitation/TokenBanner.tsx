import { useTranslations } from 'next-intl';
import TokenInput from './TokenInput';

interface TokenBannerProps {
  lang: string;
  invitadoNombre?: string | null;
}

export default function TokenBanner({ lang, invitadoNombre }: TokenBannerProps) {
  const t = useTranslations('invitation');

  if (invitadoNombre) {
    return (
      <div className="py-8 px-4 bg-gold/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-serif text-2xl text-gold">
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
        <div className="text-5xl mb-6 animate-float">💌</div>

        {/* Título */}
        <h2 className="font-serif text-3xl md:text-4xl text-gold mb-4">
          {t('title')}
        </h2>

        {/* Descripción */}
        <p className="font-sans text-dark/60 text-lg mb-8 leading-relaxed">
          {t('description')}
        </p>

        {/* Input */}
        <TokenInput lang={lang} />

        {/* Decoración */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="w-12 h-px bg-gold/20" />
          <span className="text-gold/30 text-sm">❦</span>
          <div className="w-12 h-px bg-gold/20" />
        </div>
      </div>
    </section>
  );
}