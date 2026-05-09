'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay cookie de sesión válida
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/eventos');
        if (res.status === 401) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    document.cookie = 'admin_session=; path=/; max-age=0';
    setIsAuthenticated(false);
    router.push('/');
  };

  return { isAuthenticated, isLoading, login, logout };
}