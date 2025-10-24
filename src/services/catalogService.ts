import axios from 'axios';
import type { PostObjective, VisualStyle } from '@/models';
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

// Interfaces for catalog responses
export interface ObjectivesResponse {
  objectives: PostObjective[];
}

export interface StylesResponse {
  styles: VisualStyle[];
}

// Request interfaces
export interface CreateObjectiveRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateObjectiveRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateStyleRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateStyleRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

// Catalog service
export const catalogService = {
  // ===== OBJECTIVES =====
  
  // Get all post objectives
  getObjectives: async (): Promise<ApiResponse<ObjectivesResponse>> => {
    try {
      const response = await axios.get(API_ENDPOINTS.CATALOG.GET_OBJECTIVES, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Objetivos obtenidos exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió objetivos válidos'
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Get single objective by ID
  getObjectiveById: async (id: number): Promise<ApiResponse<PostObjective>> => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.CATALOG.DELETE_OBJECTIVES}${id}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Objetivo obtenido exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió el objetivo válido'
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return ApiResponseHandler.error(
          'NOT_FOUND',
          'Objetivo no encontrado',
          'El objetivo solicitado no existe'
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Create new objective
  createObjective: async (data: CreateObjectiveRequest): Promise<ApiResponse<PostObjective>> => {
    try {
      const response = await axios.post(API_ENDPOINTS.CATALOG.POST_OBJECTIVES, data, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Objetivo creado exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no confirmó la creación'
      );
    } catch (error: any) {
      if (error.response?.status === 400) {
        return ApiResponseHandler.error(
          'VALIDATION_ERROR',
          'Error de validación',
          error.response?.data?.error || 'Los datos proporcionados no son válidos',
          undefined,
          error.response?.data?.validation
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Update objective
  updateObjective: async (id: number, data: UpdateObjectiveRequest): Promise<ApiResponse<PostObjective>> => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.CATALOG.UPDATE_OBJECTIVES}${id}`, data, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Objetivo actualizado exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no confirmó la actualización'
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return ApiResponseHandler.error(
          'NOT_FOUND',
          'Objetivo no encontrado',
          'El objetivo que intentas actualizar no existe'
        );
      }
      
      if (error.response?.status === 400) {
        return ApiResponseHandler.error(
          'VALIDATION_ERROR',
          'Error de validación',
          error.response?.data?.error || 'Los datos proporcionados no son válidos',
          undefined,
          error.response?.data?.validation
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // ===== STYLES =====

  // Get all visual styles
  getStyles: async (): Promise<ApiResponse<StylesResponse>> => {
    try {
      const response = await axios.get(API_ENDPOINTS.CATALOG.GET_STYLES, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Estilos obtenidos exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió estilos válidos'
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Get single style by ID
  getStyleById: async (id: number): Promise<ApiResponse<VisualStyle>> => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.CATALOG.DELETE_STYLES}${id}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Estilo obtenido exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió el estilo válido'
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return ApiResponseHandler.error(
          'NOT_FOUND',
          'Estilo no encontrado',
          'El estilo solicitado no existe'
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Create new style
  createStyle: async (data: CreateStyleRequest): Promise<ApiResponse<VisualStyle>> => {
    try {
      const response = await axios.post(API_ENDPOINTS.CATALOG.POST_STYLES, data, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Estilo creado exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no confirmó la creación'
      );
    } catch (error: any) {
      if (error.response?.status === 400) {
        return ApiResponseHandler.error(
          'VALIDATION_ERROR',
          'Error de validación',
          error.response?.data?.error || 'Los datos proporcionados no son válidos',
          undefined,
          error.response?.data?.validation
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Update style
  updateStyle: async (id: number, data: UpdateStyleRequest): Promise<ApiResponse<VisualStyle>> => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.CATALOG.UPDATE_STYLES}${id}`, data, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Estilo actualizado exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no confirmó la actualización'
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return ApiResponseHandler.error(
          'NOT_FOUND',
          'Estilo no encontrado',
          'El estilo que intentas actualizar no existe'
        );
      }
      
      if (error.response?.status === 400) {
        return ApiResponseHandler.error(
          'VALIDATION_ERROR',
          'Error de validación',
          error.response?.data?.error || 'Los datos proporcionados no son válidos',
          undefined,
          error.response?.data?.validation
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // ===== UTILITY METHODS =====

  // Load all catalogs at once
  loadAllCatalogs: async (): Promise<ApiResponse<{
    objectives: PostObjective[];
    styles: VisualStyle[];
  }>> => {
    try {
      const [objectivesRes, stylesRes] = await Promise.all([
        catalogService.getObjectives(),
        catalogService.getStyles()
      ]);

      if (ApiResponseHandler.isSuccess(objectivesRes) && ApiResponseHandler.isSuccess(stylesRes)) {
        return ApiResponseHandler.success(
          {
            objectives: objectivesRes.data.objectives,
            styles: stylesRes.data.styles
          },
          'Catálogos cargados exitosamente'
        );
      }

      // Si alguno falló, retornar el error
      if (!ApiResponseHandler.isSuccess(objectivesRes)) {
        return objectivesRes as any;
      }
      return stylesRes as any;

    } catch (error: any) {
      return ApiResponseHandler.handleHttpError(error);
    }
  }
};

