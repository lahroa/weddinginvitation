'use client';

import { motion } from 'framer-motion';

interface GalleryImageProps {
  src: string;
  alt: string;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  onClick: () => void;
  priority?: boolean;
}

export default function GalleryImage({ src, alt, size, onClick, priority = false }: GalleryImageProps) {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
    wide: 'col-span-2 row-span-1',
    tall: 'col-span-1 row-span-2',
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${sizeClasses[size]}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layoutId={`gallery-image-${src}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.4 }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading={priority ? 'eager' : 'lazy'}
      />
      {/* Overlay hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
          <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}