'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

interface TokenInputProps {
  lang: string;
}

export default function TokenInput({ lang }: TokenInputProps) {
  const t = useTranslations('invitation');
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanCode = code.trim().toUpperCase();
    
    if (cleanCode.length !== 7) {
      setError(t('invalid'));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/invitaciones/token?t=${cleanCode}`);
      const data = await res.json();

      if (data.success) {
        router.push(`/${lang}?invitacion=${cleanCode}`);
      } else {
        setError(t('invalid'));
      }
    } catch {
      setError(t('invalid'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            placeholder={t('placeholder')}
            maxLength={7}
            className="w-full px-5 py-4 rounded-xl border-2 border-gold/30 bg-white/80 backdrop-blur-sm 
                       text-center font-mono text-xl tracking-[0.3em] text-dark
                       placeholder:text-gray-400 placeholder:tracking-normal placeholder:text-base
                       transition-all duration-200
                       focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10
                       uppercase"
          />
          {error && (
            <p className="absolute -bottom-6 left-0 right-0 text-sm text-red-500 font-sans text-center">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" variant="primary" isLoading={isLoading} className="whitespace-nowrap">
          {t('button')}
        </Button>
      </div>
    </form>
  );
}