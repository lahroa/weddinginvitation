'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ParallaxOptions {
  speed?: number;
}

export default function useParallax<T extends HTMLElement>({ 
  speed = 0.5
}: ParallaxOptions = {}) {
  const ref = useRef<T>(null);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    
    const scrolled = window.scrollY;
    const rate = scrolled * speed;
    ref.current.style.transform = `translateY(${rate}px)`;
  }, [speed]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return ref;
}