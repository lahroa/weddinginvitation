'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GalleryImage from './GalleryImage';
import Lightbox from './Lightbox';
import Button from '@/components/ui/Button';
import MaterialIcon from '@/components/ui/MaterialIcon';

interface GalleryItem {
  src: string;
  alt: string;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
}

// Configuración de la galería (personalizable)
const galleryImages: GalleryItem[] = [
  { src: '/images/gallery/foto-1.jpg', alt: 'Momento especial 1', size: 'large' },
  { src: '/images/gallery/foto-2.jpg', alt: 'Momento especial 2', size: 'small' },
  { src: '/images/gallery/foto-3.jpg', alt: 'Momento especial 3', size: 'medium' },
  { src: '/images/gallery/foto-4.jpg', alt: 'Momento especial 4', size: 'wide' },
  { src: '/images/gallery/foto-5.jpg', alt: 'Momento especial 5', size: 'small' },
  { src: '/images/gallery/foto-6.jpg', alt: 'Momento especial 6', size: 'medium' },
  { src: '/images/gallery/foto-7.jpg', alt: 'Momento especial 7', size: 'tall' },
  { src: '/images/gallery/foto-8.jpg', alt: 'Momento especial 8', size: 'small' },
  { src: '/images/gallery/foto-9.jpg', alt: 'Momento especial 9', size: 'wide' },
  { src: '/images/gallery/foto-10.jpg', alt: 'Momento especial 10', size: 'small' },
];

export default function GalleryGrid() {
  const t = useTranslations('gallery');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-3">
            {t('title')}
          </h2>
          <p className="font-sans text-dark/50 text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Grid Masonry */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[150px] md:auto-rows-[200px] gap-3 md:gap-4">
          {galleryImages.map((img, index) => (
            <GalleryImage
              key={img.src}
              src={img.src}
              alt={img.alt}
              size={img.size}
              onClick={() => handleImageClick(index)}
              priority={index < 4}
            />
          ))}
        </div>

        {/* Botón Google Photos */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.open('https://photos.google.com', '_blank')}
          >
            <MaterialIcon name="camera" className="w-5 h-5 mr-2" />
            {t('addPhotos')}
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={galleryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}