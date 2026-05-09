'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ParallaxOptions {
  speed?: number;
  disableOnMobile?: boolean;
}

export default function useParallax<T extends HTMLElement>({ 
  speed = 0.5, 
  disableOnMobile = true 
}: ParallaxOptions = {}) {
  const ref = useRef<T>(null);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    
    if (disableOnMobile && window.innerWidth < 768) {
      ref.current.style.transform = 'translateY(0)';
      return;
    }

    const scrolled = window.scrollY;
    const rate = scrolled * speed;
    ref.current.style.transform = `translateY(${rate}px)`;
  }, [speed, disableOnMobile]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return ref;
}