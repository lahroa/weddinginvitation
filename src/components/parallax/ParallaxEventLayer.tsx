'use client';

import { ReactNode } from 'react';
import useParallax from '@/hooks/useParallax';

interface ParallaxEventLayerProps {
  backgroundImage?: string | null;
  backgroundType?: 'image' | 'gradient';
  gradientCss?: string | null;
  children: ReactNode;
  overlayOpacity?: number;
}

export default function ParallaxEventLayer({
  backgroundImage,
  backgroundType = 'image',
  gradientCss,
  children,
  overlayOpacity = 0.3,
}: ParallaxEventLayerProps) {
  const bgRef = useParallax<HTMLDivElement>({ speed: 0.2 });

  const bgStyle: React.CSSProperties = backgroundType === 'gradient' && gradientCss
    ? { background: gradientCss }
    : backgroundImage
      ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {
          background: 'linear-gradient(135deg, #FDF8F4 0%, #E8D5C8 100%)',
        };

  return (
    <div className="relative min-h-[600px] md:min-h-[700px] overflow-hidden">
      {/* Fondo con parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0"
        style={{
          ...bgStyle,
          willChange: 'transform',
        }}
      >
        <div
          className="absolute inset-0 bg-cream"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] md:min-h-[700px] px-4 py-16">
        {children}
      </div>
    </div>
  );
}