import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function SupportSection() {
  const t = useTranslations('support');
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '';
  const email = process.env.NEXT_PUBLIC_EMAIL || '';

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Título */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 mb-8">
          <span className="text-4xl">🎁</span>
        </div>
        
        <h2 className="font-serif text-4xl md:text-5xl text-gold mb-4">
          {t('title')}
        </h2>

        <p className="font-sans text-dark/60 text-lg mb-10 leading-relaxed">
          {t('description')}
        </p>

        {/* Tarjeta de contacto */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <div className="space-y-6">
            {/* WhatsApp */}
            {whatsapp && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-green-50/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💬</span>
                  <div className="text-left">
                    <p className="font-sans text-sm text-dark/50">WhatsApp</p>
                    <p className="font-sans text-dark font-medium">{whatsapp}</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg 
                             font-sans text-sm hover:bg-green-600 transition-colors whitespace-nowrap"
                >
                  {t('whatsapp')}
                </a>
              </div>
            )}

            {/* Email */}
            {email && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gold/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📧</span>
                  <div className="text-left">
                    <p className="font-sans text-sm text-dark/50">Email</p>
                    <p className="font-sans text-dark font-medium">{email}</p>
                  </div>
                </div>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-white rounded-lg 
                             font-sans text-sm hover:bg-gold-dark transition-colors whitespace-nowrap"
                >
                  Enviar correo
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje final */}
        <p className="font-serif text-xl text-gold/60 mt-8 italic">
          Gracias por ser parte de este momento especial ✨
        </p>
      </div>
    </section>
  );
}