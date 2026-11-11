import { useTranslations } from 'next-intl';
import MaterialIcon from '@/components/ui/MaterialIcon';

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
          <MaterialIcon name="location" className="w-6 h-6 text-primary" />
          <h3 className="font-serif text-xl text-dark">{t('location')}</h3>
        </div>
        
        {lugarPublico && (
          <p className="font-serif text-2xl text-primary mb-2">{lugarPublico}</p>
        )}
        
        {showPrivateInfo && direccionPrivada && (
          <>
            <div className="flex items-start gap-2 mt-4 mb-4">
              <MaterialIcon name="location" className="w-5 h-5 mt-0.5 text-primary" />
              <p className="font-sans text-dark/70">{direccionPrivada}</p>
            </div>
            
            {mapsLink && (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-light rounded-lg font-sans text-sm hover:bg-primary/90 transition-colors mt-2"
              >
                <MaterialIcon name="map" className="w-4 h-4" />
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
        <MaterialIcon name="computer" className="w-6 h-6 text-primary" />
        <h3 className="font-serif text-xl text-dark">{t('connection')}</h3>
      </div>
      
      {asuntoVirtual && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <MaterialIcon name="target" className="w-5 h-5 text-primary" />
            <p className="font-serif text-2xl text-primary">{asuntoVirtual}</p>
          </div>
        </>
      )}
      
      {showPrivateInfo && descripcionVirtual && (
        <div className="flex items-start gap-2 mt-4 mb-4">
          <MaterialIcon name="description" className="w-5 h-5 mt-0.5 text-primary" />
          <p className="font-sans text-dark/70 whitespace-pre-wrap">{descripcionVirtual}</p>
        </div>
      )}
      
      {showPrivateInfo && linkVirtual && (
        <a
          href={linkVirtual}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-light rounded-lg font-sans text-sm hover:bg-primary/90 transition-colors mt-2"
        >
          <MaterialIcon name="link" className="w-4 h-4" />
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