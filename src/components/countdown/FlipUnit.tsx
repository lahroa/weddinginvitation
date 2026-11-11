'use client';

import { useState, useEffect } from 'react';

interface FlipUnitProps {
  value: number;
}

export default function FlipUnit({ value }: FlipUnitProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  const displayValue = String(value).padStart(2, '0');

  return (
    <div className="relative w-16 h-20 md:w-20 md:h-24 perspective-400">
      <div className={`relative w-full h-full ${isFlipping ? 'animate-flip' : ''}`}>
        <div className="absolute inset-0 bg-light rounded-lg shadow-md flex items-center justify-center border border-accent-2">
          <span className="font-mono text-3xl md:text-4xl text-primary font-bold">
            {displayValue}
          </span>
        </div>
      </div>
    </div>
  );
}