'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar sesión llamando a un endpoint protegido
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/session', {
          credentials: 'include',
        });

        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setIsAuthenticated(true);
      return true;
    }

    if (res.status === 401) return false;
    throw new Error(data.error || 'Error al iniciar sesión');
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/admin/logout', { 
      method: 'POST',
      credentials: 'include' 
    });
    setIsAuthenticated(false);
    router.push('/es');
  }, [router]);

  return { isAuthenticated, isLoading, login, logout };
}