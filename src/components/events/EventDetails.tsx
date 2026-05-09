import { useTranslations } from 'next-intl';

interface EventDetailsProps {
  tipoEvento: 'presencial' | 'virtual';
  lugarPublico?: string | null;
  direccionPrivada?: string | null;
  mapsLink?: string | null;
  asuntoVirtual?: string | null;
  descripcionVirtual?: string | null;
  linkVirtual?: string | null;
  showPrivateInfo: boolean;
}

export default function EventDetails({
  tipoEvento,
  lugarPublico,
  direccionPrivada,
  mapsLink,
  asuntoVirtual,
  descripcionVirtual,
  linkVirtual,
  showPrivateInfo,
}: EventDetailsProps) {
  const t = useTranslations('events');

  if (tipoEvento === 'presencial') {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📍</span>
          <h3 className="font-serif text-xl text-dark">{t('location')}</h3>
        </div>
        
        {lugarPublico && (
          <p className="font-serif text-2xl text-gold mb-2">{lugarPublico}</p>
        )}
        
        {showPrivateInfo && direccionPrivada && (
          <>
            <div className="flex items-start gap-2 mt-4 mb-4">
              <span className="text-lg mt-0.5">📌</span>
              <p className="font-sans text-dark/70">{direccionPrivada}</p>
            </div>
            
            {mapsLink && (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-white rounded-lg font-sans text-sm hover:bg-gold-dark transition-colors mt-2"
              >
                <span>🗺️</span>
                {t('viewOnMaps')}
              </a>
            )}
          </>
        )}
        
        {!showPrivateInfo && (
          <p className="font-sans text-dark/50 italic mt-2">
            La ubicación exacta se revelará con tu código de invitación
          </p>
        )}
      </div>
    );
  }

  // Virtual
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💻</span>
        <h3 className="font-serif text-xl text-dark">{t('connection')}</h3>
      </div>
      
      {asuntoVirtual && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎯</span>
            <p className="font-serif text-2xl text-gold">{asuntoVirtual}</p>
          </div>
        </>
      )}
      
      {showPrivateInfo && descripcionVirtual && (
        <div className="flex items-start gap-2 mt-4 mb-4">
          <span className="text-lg mt-0.5">📝</span>
          <p className="font-sans text-dark/70 whitespace-pre-wrap">{descripcionVirtual}</p>
        </div>
      )}
      
      {showPrivateInfo && linkVirtual && (
        <a
          href={linkVirtual}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage text-white rounded-lg font-sans text-sm hover:bg-sage-light transition-colors mt-2"
        >
          <span>🔗</span>
          {t('joinLink')}
        </a>
      )}
      
      {!showPrivateInfo && (
        <p className="font-sans text-dark/50 italic mt-2">
          Los detalles de conexión se revelarán con tu código de invitación
        </p>
      )}
    </div>
  );
}