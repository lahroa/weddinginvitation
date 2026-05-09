'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useMusic(audioSrc: string) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.2;
    audioRef.current = audio;

    audio.addEventListener('canplaythrough', () => setIsLoaded(true));

    const enableAudio = () => {
      if (!hasInteracted.current && audioRef.current) {
        hasInteracted.current = true;
        audioRef.current.play().catch(() => {
          // Autoplay bloqueado, esperar interacción
        });
        setIsPlaying(true);
      }
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('scroll', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('scroll', enableAudio);
    document.addEventListener('touchstart', enableAudio);

    return () => {
      audio.pause();
      audio.removeEventListener('canplaythrough', () => setIsLoaded(true));
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('scroll', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
  }, [audioSrc]);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return { isPlaying, isLoaded, toggleMusic };
}