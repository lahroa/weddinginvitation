'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import LottieIcon from '@/components/events/LottieIcon';
import MaterialIcon from '@/components/ui/MaterialIcon';

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '';
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || '';
const BANCO = process.env.NEXT_PUBLIC_BANCO || '';
const TITULAR = process.env.NEXT_PUBLIC_TITULAR || '';
const CUENTA = process.env.NEXT_PUBLIC_CUENTA || '';
const PAGO_MOVIL = process.env.NEXT_PUBLIC_PAGO_MOVIL || '';
const MESA_REGALOS = process.env.NEXT_PUBLIC_MESA_REGALOS || '';

const cardClass = 'flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors';
const cardLinkClass = `${cardClass} hover:border-accent/70 hover:bg-white/[0.07]`;

export default function SupportSection() {
  const t = useTranslations('support');
  const [copiado, setCopiado] = useState<string | null>(null);
  const { ref: iconRef, isVisible: iconVisible } = useScrollReveal();

  const copiar = async (valor: string) => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(valor);
      window.setTimeout(() => setCopiado((actual) => (actual === valor ? null : actual)), 2000);
    } catch {
      // Si el navegador bloquea el portapapeles, el dato queda visible para copiarlo a mano.
    }
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`;

  const datosBancarios = [
    { id: 'banco', label: t('bankName'), valor: BANCO },
    { id: 'titular', label: t('bankHolder'), valor: TITULAR },
    { id: 'cuenta', label: t('bankAccount'), valor: CUENTA },
    { id: 'pago-movil', label: t('mobilePayment'), valor: PAGO_MOVIL },
  ].filter((dato) => dato.valor);

  return (
    <section id="apoyo" className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/images/hero/luis-daniela-1.jpeg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 overlay-dark" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 md:py-28">
        <div className="text-center">
          <div ref={iconRef} aria-hidden="true" className="mb-4">
            <LottieIcon
              src="/lottie/20-heart.li.json"
              size={80}
              autoplay={false}
              loop={false}
              playOnReveal
              revealEnabled={iconVisible}
              repeatHoverAfterReveal
              color="light"
            />
          </div>
          <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-accent-2">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-serif text-4xl text-light md:text-5xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-base leading-relaxed text-light md:text-lg">
            {t('description')}
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {WHATSAPP && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group ${cardLinkClass}`}
            >
              <div className="flex items-center gap-3">
                <MaterialIcon name="chat" className="h-5 w-5 text-accent-2" />
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-light">
                  {t('whatsappLabel')}
                </span>
              </div>
              <span className="mt-5 font-serif text-xl text-light md:text-2xl">{WHATSAPP}</span>
              <span className="mt-4 inline-flex items-center gap-2 font-sans text-xs text-light transition-colors group-hover:text-accent-2">
                {t('whatsapp')}
                <MaterialIcon name="link" className="h-3.5 w-3.5" />
              </span>
            </a>
          )}

          {EMAIL && (
            <a href={`mailto:${EMAIL}`} className={`group ${cardLinkClass}`}>
              <div className="flex items-center gap-3">
                <MaterialIcon name="mail" className="h-5 w-5 text-accent-2" />
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-light">
                  {t('emailLabel')}
                </span>
              </div>
              <span className="mt-5 break-all font-serif text-xl text-light md:text-2xl">{EMAIL}</span>
              <span className="mt-4 inline-flex items-center gap-2 font-sans text-xs text-light transition-colors group-hover:text-accent-2">
                {t('email')}
                <MaterialIcon name="mail" className="h-3.5 w-3.5" />
              </span>
            </a>
          )}

          {MESA_REGALOS && (
            <a
              href={MESA_REGALOS}
              target="_blank"
              rel="noopener noreferrer"
              className={`group ${cardLinkClass}`}
            >
              <div className="flex items-center gap-3">
                <MaterialIcon name="gift" className="h-5 w-5 text-accent-2" />
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-light">
                  {t('registryTitle')}
                </span>
              </div>
              <span className="mt-5 font-serif text-xl text-light md:text-2xl">
                {t('registryValue')}
              </span>
              <span className="mt-4 inline-flex items-center gap-2 font-sans text-xs text-light transition-colors group-hover:text-accent-2">
                {t('registryCta')}
                <MaterialIcon name="link" className="h-3.5 w-3.5" />
              </span>
            </a>
          )}
        </div>

        {datosBancarios.length > 0 && (
          <div className={`mt-4 ${cardClass}`}>
            <div className="flex items-center gap-3">
              <MaterialIcon name="description" className="h-5 w-5 text-accent-2" />
              <h3 className="font-sans text-[10px] uppercase tracking-[0.24em] text-light">
                {t('bankTitle')}
              </h3>
            </div>

            <dl className="mt-4 divide-y divide-white/5">
              {datosBancarios.map((dato) => (
                <div
                  key={dato.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3"
                >
                  <dt className="font-sans text-[10px] uppercase tracking-[0.22em] text-light">
                    {dato.label}
                  </dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-sans text-sm text-light md:text-base">
                      {dato.valor}
                    </span>
                    <button
                      type="button"
                      onClick={() => copiar(dato.valor)}
                      aria-label={`${t('copy')} ${dato.label}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-accent-2/50 bg-primary text-light transition-colors hover:border-accent-2"
                    >
                      <MaterialIcon
                        name={copiado === dato.valor ? 'checkCircle' : 'copy'}
                        className="h-4 w-4"
                      />
                    </button>
                    {copiado === dato.valor && (
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-2">
                        {t('copied')}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <p className="mt-12 text-center font-serif text-lg italic text-light md:text-xl">
          {t('thanks')}
        </p>
      </div>
    </section>
  );
}
