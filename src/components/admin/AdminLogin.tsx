'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MaterialIcon from '@/components/ui/MaterialIcon';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const t = useTranslations('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await onLogin(username, password);
      if (!success) {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al conectar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-2/40 mb-6">
            <MaterialIcon name="settings" className="w-9 h-9 text-primary" />
          </div>
          <h1 className="font-serif text-4xl text-primary mb-2">
            {t('dashboard')}
          </h1>
          <p className="font-sans text-dark/50">Luis & Daniela</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-elegant p-8">
          <Input
            label={t('username')}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            autoComplete="username"
            autoCapitalize="none"
            required
          />
          <Input
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="text-base"
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