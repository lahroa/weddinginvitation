'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';

const HOVER_REPEAT_DELAY_MS = 3000;

interface LottieIconProps {
  src: string;
  size?: number;
  autoplay?: boolean;
  loop?: boolean;
  color?: 'original' | 'light';
  marker?: string;
  playOnHover?: boolean;
  hoverEnabled?: boolean;
  playOnReveal?: boolean;
  revealEnabled?: boolean;
  repeatHoverAfterReveal?: boolean;
}

export default function LottieIcon({ 
  src, 
  size = 120, 
  autoplay = true, 
  loop = true,
  color = 'original',
  marker,
  playOnHover = false,
  hoverEnabled = true,
  playOnReveal = false,
  revealEnabled = false,
  repeatHoverAfterReveal = false,
}: LottieIconProps) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const isHovered = useRef(false);
  const isPlayingReveal = useRef(false);
  const setDotLottieRef = useCallback((instance: DotLottie | null) => {
    setDotLottie(instance);
  }, []);

  const playMarker = useCallback((selectedMarker?: string) => {
    if (!dotLottie?.isLoaded) return false;
    if (selectedMarker) dotLottie.setMarker(selectedMarker);
    dotLottie.play();
    return true;
  }, [dotLottie]);

  const playHoverAnimation = useCallback(() => {
    if (!dotLottie?.isLoaded) return;

    const hoverMarker = marker
      ? undefined
      : dotLottie.markers().find(({ name }) => name.startsWith('default:hover-'));
    const selectedMarker = marker ?? hoverMarker?.name;

    isPlayingReveal.current = false;
    playMarker(selectedMarker);
  }, [dotLottie, marker, playMarker]);

  useEffect(() => {
    if (!playOnReveal || !dotLottie) return;
    if (!revealEnabled) {
      isPlayingReveal.current = false;
      dotLottie.stop();
      return;
    }

    let repeatTimeout: number | null = null;
    let isPlayingRepeatedHover = false;

    const playRevealAnimation = () => {
      const markers = dotLottie.markers();
      const revealMarker = markers.find(({ name }) => name === 'in-reveal')
        ?? markers.find(({ name }) => !name.startsWith('default:hover-'));

      if (repeatHoverAfterReveal) dotLottie.setLoop(false);
      isPlayingReveal.current = playMarker(marker ?? revealMarker?.name);
    };
    const onLoad = () => playRevealAnimation();
    const onComplete = () => {
      if (isPlayingReveal.current) {
        isPlayingReveal.current = false;
        if (repeatHoverAfterReveal) {
          dotLottie.setLoop(false);
          isPlayingRepeatedHover = playMarker('default:hover-pinch');
          return;
        }
        if (isHovered.current && hoverEnabled) playHoverAnimation();
        return;
      }
      if (!repeatHoverAfterReveal || !isPlayingRepeatedHover) return;
      isPlayingRepeatedHover = false;
      repeatTimeout = window.setTimeout(() => {
        if (!revealEnabled) return;
        isPlayingRepeatedHover = playMarker('default:hover-pinch');
      }, HOVER_REPEAT_DELAY_MS);
    };

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('complete', onComplete);
    if (dotLottie.isLoaded) playRevealAnimation();

    return () => {
      dotLottie.removeEventListener('load', onLoad);
      dotLottie.removeEventListener('complete', onComplete);
      if (repeatTimeout !== null) window.clearTimeout(repeatTimeout);
    };
  }, [dotLottie, hoverEnabled, marker, playHoverAnimation, playMarker, playOnReveal, repeatHoverAfterReveal, revealEnabled]);

  const handleMouseEnter = () => {
    isHovered.current = true;
    if (playOnHover && hoverEnabled) playHoverAnimation();
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    if (playOnHover) dotLottie?.stop();
  };

  return (
    <div
      style={{ width: size, height: size }}
      className="mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DotLottieReact
        src={src}
        autoplay={autoplay}
        loop={loop}
        marker={marker}
        dotLottieRefCallback={setDotLottieRef}
        style={{
          width: '100%',
          height: '100%',
          filter: color === 'light' ? 'brightness(0) invert(1)' : undefined,
        }}
      />
    </div>
  );
}