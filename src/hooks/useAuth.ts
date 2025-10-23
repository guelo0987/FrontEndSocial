import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useNotifications } from '@/helpers';
import type { ClientResponse } from '@/models';

interface AuthState {
  isAuthenticated: boolean;
  user: ClientResponse | null;
  isLoading: boolean;
  token: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    token: null,
  });
  
  const navigate = useNavigate();
  const { auth } = useNotifications();

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          token: null,
        });
        return;
      }

      // Verificar si el token es válido
      const response = await authService.verifyToken(token);
      
      if (response.status === 'success' && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: response.data,
          isLoading: false,
          token,
        });
      } else {
        // Token inválido, limpiar datos
        clearAuthData();
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          token: null,
        });
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      clearAuthData();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        token: null,
      });
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.status === 'success' && response.data) {
        const { token, user } = response.data;
        
        // Guardar datos en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          token,
        });
        
        auth.loginSuccess();
        return { success: true };
      } else {
        auth.loginError(response.message);
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error en login:', error);
      auth.loginError('Error inesperado al iniciar sesión');
      return { success: false, error: 'Error inesperado' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      clearAuthData();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        token: null,
      });
      
      auth.logoutSuccess();
      navigate('/auth');
    }
  };

  const requireAuth = () => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      navigate('/auth');
      return false;
    }
    return true;
  };

  return {
    ...authState,
    login,
    logout,
    requireAuth,
    checkAuthStatus,
  };
};
