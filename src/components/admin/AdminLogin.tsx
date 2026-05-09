'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface AdminLoginProps {
  onLogin: (password: string) => Promise<boolean>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const t = useTranslations('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await onLogin(password);
      if (!success) {
        setError('Contraseña incorrecta');
      }
    } catch {
      setError('Error al conectar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 mb-6">
            <span className="text-4xl">⚙️</span>
          </div>
          <h1 className="font-serif text-4xl text-gold mb-2">
            {t('dashboard')}
          </h1>
          <p className="font-sans text-dark/50">Luis & Daniela</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-elegant p-8">
          <Input
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            placeholder="••••••••"
            autoFocus
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            isLoading={isLoading}
          >
            {t('login')}
          </Button>
        </form>
      </div>
    </div>
  );
}