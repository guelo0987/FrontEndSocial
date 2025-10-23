import axios from 'axios';
import type { GeneratedPostResponse } from '@/models';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiResponseHandler, CommonApiResponses, type ApiResponse } from '@/helpers';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Interface for paginated posts response
export interface PaginatedPostsResponse {
  posts: GeneratedPostResponse[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Posts service
export const postsService = {
  // Get all posts with pagination
  getPosts: async (page: number = 1, perPage: number = 10): Promise<ApiResponse<PaginatedPostsResponse>> => {
    try {
      const response = await axios.get(API_ENDPOINTS.POSTS.GET, {
        headers: getAuthHeaders(),
        params: {
          page,
          per_page: perPage
        }
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Posts obtenidos exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió posts válidos'
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      if (error.response?.status === 404) {
        return ApiResponseHandler.error(
          'NOT_FOUND',
          'No se encontraron posts',
          'No hay posts disponibles'
        );
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Get posts with filters
  getPostsWithFilters: async (filters: {
    status?: string;
    platform?: string;
    objective?: string;
    style?: string;
    search?: string;
    start_date?: string;
    end_date?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
  } = {}): Promise<ApiResponse<PaginatedPostsResponse>> => {
    try {
      const response = await axios.get(API_ENDPOINTS.POSTS.GET, {
        headers: getAuthHeaders(),
        params: filters
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Posts filtrados obtenidos exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió posts válidos'
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Get single post by ID
  getPostById: async (postId: number): Promise<ApiResponse<GeneratedPostResponse>> => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.POSTS.GET}${postId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Post obtenido exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió el post válido'
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return ApiResponseHandler.error(
          'NOT_FOUND',
          'Post no encontrado',
          'El post solicitado no existe'
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Delete post by ID
  deletePost: async (postId: number): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.POSTS.DELETE}${postId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success) {
        return ApiResponseHandler.success(
          { message: 'Post eliminado exitosamente' },
          'Post eliminado exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no confirmó la eliminación'
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return ApiResponseHandler.error(
          'NOT_FOUND',
          'Post no encontrado',
          'El post que intentas eliminar no existe'
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  }
};
