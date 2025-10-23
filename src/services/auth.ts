import axios from 'axios';
import type { ClientLoginRequest, ClientCreateRequest, ClientResponse } from '@/models';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiResponseHandler, CommonApiResponses, type ApiResponse } from '@/helpers';

// Authentication service
export const authService = {
  // Login service
  login: async (credentials: ClientLoginRequest): Promise<ApiResponse<{ token: string; user: ClientResponse }>> => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Si la respuesta es exitosa, devolver con el formato estándar
      if (response.data && response.data.token) {
        return ApiResponseHandler.success(
          { token: response.data.token, user: response.data.user },
          'Inicio de sesión exitoso'
        );
      }
      
      // Si no hay token, es un error
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió un token válido'
      );
    } catch (error: any) {
      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.loginError();
      }
      
      if (error.response?.status === 422) {
        return ApiResponseHandler.error(
          'VALIDATION_ERROR',
          'Datos de inicio de sesión inválidos',
          'Verifica que el email y contraseña sean correctos',
          undefined,
          error.response?.data?.validation
        );
      }
      
      // Error de red o servidor
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Register service
  register: async (userData: ClientCreateRequest): Promise<ApiResponse<{ token: string; user: ClientResponse }>> => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      // Si la respuesta es exitosa, devolver con el formato estándar
      if (response.data && response.data.token) {
        return CommonApiResponses.users.created(response.data.user);
      }
      
      // Si no hay token, es un error
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió un token válido'
      );
    } catch (error: any) {
      // Manejar diferentes tipos de errores
      if (error.response?.status === 409) {
        return CommonApiResponses.users.alreadyExists();
      }
      
      if (error.response?.status === 422) {
        return ApiResponseHandler.error(
          'VALIDATION_ERROR',
          'Datos de registro inválidos',
          'Verifica que todos los campos sean correctos',
          undefined,
          error.response?.data?.validation
        );
      }
      
      // Error de red o servidor
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Logout service
  logout: async (): Promise<ApiResponse<null>> => {
    try {
      // Aquí podrías hacer una llamada al servidor para invalidar el token
      // Por ahora, solo devolvemos éxito
      return CommonApiResponses.auth.logoutSuccess();
    } catch (error: any) {
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Verify token service
  verifyToken: async (token: string): Promise<ApiResponse<ClientResponse>> => {
    try {
      const response = await axios.get(API_ENDPOINTS.AUTH.VERIFY, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.user) {
        return ApiResponseHandler.success(
          response.data.user,
          'Token válido'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_TOKEN',
        'Token inválido',
        'El token proporcionado no es válido'
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Refresh token service
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ token: string; user: ClientResponse }>> => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {
        refresh_token: refreshToken
      });
      
      if (response.data && response.data.token) {
        return ApiResponseHandler.success(
          { token: response.data.token, user: response.data.user },
          'Token renovado exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_REFRESH_TOKEN',
        'Token de renovación inválido',
        'No se pudo renovar el token'
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  }
};
