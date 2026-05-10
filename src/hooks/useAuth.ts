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
        const res = await fetch('/api/invitaciones', {
          credentials: 'include', // Enviar cookies
        });
        
        // Si es 401, no está autenticado
        // Si es 200, está autenticado
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
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