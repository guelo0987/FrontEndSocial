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

// Catalog service
export const catalogService = {
  // Get all post objectives
  getObjectives: async (): Promise<ApiResponse<ObjectivesResponse>> => {
    try {
      const response = await axios.get(API_ENDPOINTS.CATALOG.OBJECTIVES, {
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

  // Get all visual styles
  getStyles: async (): Promise<ApiResponse<StylesResponse>> => {
    try {
      const response = await axios.get(API_ENDPOINTS.CATALOG.STYLES, {
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

