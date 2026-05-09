'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LottieIconProps {
  src: string;
  size?: number;
  autoplay?: boolean;
  loop?: boolean;
}

export default function LottieIcon({ 
  src, 
  size = 120, 
  autoplay = true, 
  loop = true 
}: LottieIconProps) {
  return (
    <div style={{ width: size, height: size }} className="mx-auto">
      <DotLottieReact
        src={src}
        autoplay={autoplay}
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}