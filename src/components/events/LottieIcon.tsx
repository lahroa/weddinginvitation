'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';

interface LottieIconProps {
  src: string;
  size?: number;
  autoplay?: boolean;
  loop?: boolean;
  color?: 'original' | 'light';
  marker?: string;
  playOnHover?: boolean;
  hoverEnabled?: boolean;
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
}: LottieIconProps) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const isHovered = useRef(false);
  const setDotLottieRef = useCallback((instance: DotLottie | null) => {
    setDotLottie(instance);
  }, []);

  const playHoverAnimation = useCallback(() => {
    if (!dotLottie?.isLoaded) return;

    const hoverMarker = marker
      ? undefined
      : dotLottie.markers().find(({ name }) => name.startsWith('default:hover-'));
    const selectedMarker = marker ?? hoverMarker?.name;

    if (selectedMarker) dotLottie.setMarker(selectedMarker);
    dotLottie.play();
  }, [dotLottie, marker]);

  useEffect(() => {
    if (!playOnHover || !dotLottie) return;
    if (!hoverEnabled) {
      dotLottie.stop();
      return;
    }

    const onLoad = () => {
      if (isHovered.current) playHoverAnimation();
    };

    dotLottie.addEventListener('load', onLoad);
    if (dotLottie.isLoaded && isHovered.current) {
      playHoverAnimation();
    }

    return () => dotLottie.removeEventListener('load', onLoad);
  }, [dotLottie, hoverEnabled, playHoverAnimation, playOnHover]);

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