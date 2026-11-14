'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useMusic(audioSrc: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setIsLoaded(false);

    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.2;
    audio.preload = 'auto';
    audioRef.current = audio;

    let disposed = false;
    let playbackStarted = false;

    const markLoaded = () => setIsLoaded(true);
    const markPlaying = () => setIsPlaying(true);
    const markPaused = () => setIsPlaying(false);
    const reportAudioError = () => {
      console.error(`No se pudo cargar la música de fondo: ${audioSrc}`, audio.error);
    };
    const handlePlaybackError = (error: unknown) => {
      if (error instanceof DOMException && error.name === 'NotAllowedError') return;
      console.error('No se pudo reproducir la música de fondo.', error);
    };
    const enableAudio = () => {
      if (disposed || playbackStarted || !audio.paused) return;

      void audio.play().then(() => {
        if (disposed) return;
        playbackStarted = true;
      }).catch(handlePlaybackError);
    };

    audio.addEventListener('loadeddata', markLoaded);
    audio.addEventListener('canplay', markLoaded);
    audio.addEventListener('playing', markPlaying);
    audio.addEventListener('pause', markPaused);
    audio.addEventListener('error', reportAudioError);
    window.addEventListener('invitation:open', enableAudio);

    audio.src = audioSrc;
    audio.load();
    if (audio.readyState >= 2) markLoaded();

    return () => {
      disposed = true;
      audio.pause();
      audio.removeEventListener('loadeddata', markLoaded);
      audio.removeEventListener('canplay', markLoaded);
      audio.removeEventListener('playing', markPlaying);
      audio.removeEventListener('pause', markPaused);
      audio.removeEventListener('error', reportAudioError);
      window.removeEventListener('invitation:open', enableAudio);
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [audioSrc]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'NotAllowedError') return;
        console.error('No se pudo reproducir la música de fondo.', error);
      });
    } else {
      audio.pause();
    }
  }, []);

  return { isPlaying, isLoaded, toggleMusic };
}