import axios from 'axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiResponseHandler, CommonApiResponses, type ApiResponse } from '@/helpers';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

// Helper function to get JSON auth headers
const getJsonAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// ===== INTERFACES =====

/**
 * Request params for generating content
 */
export interface GenerateContentRequest {
  // Required
  message: string;

  // Optional - IDs
  objective_id?: number;
  style_id?: number;
  template_id?: number;

  // Optional - Names (alternatives)
  post_objective?: string;
  post_style?: string;

  // Optional - Image settings
  image_mode?: 'auto' | 'original';
  color_palette?: string;

  // Optional - Image file
  image?: File;
}

/**
 * Request params for regenerating content (creating variation)
 */
export interface RegenerateContentRequest {
  // Required
  previous_content: string;
  original_message: string;

  // Optional - IDs
  objective_id?: number;
  style_id?: number;

  // Optional - Names (alternatives)
  post_objective?: string;
  post_style?: string;

  // Optional
  previous_image_path?: string;
  color_palette?: string;
}

/**
 * Response from content generation/regeneration
 */
export interface ContentGenerationResponse {
  content: string;
  image_url: string;
  post_id: number;
}

// ===== SERVICE =====

export const contentService = {
  /**
   * Generate new content using AI
   * Supports both JSON (for text-only) and FormData (for image uploads)
   */
  generateContent: async (
    request: GenerateContentRequest
  ): Promise<ApiResponse<ContentGenerationResponse>> => {
    try {
      let response;

      // If there's an image, use FormData; otherwise use JSON
      if (request.image) {
        const formData = new FormData();
        
        // Add required fields
        formData.append('message', request.message);

        // Add optional fields
        if (request.objective_id) formData.append('objective_id', request.objective_id.toString());
        if (request.style_id) formData.append('style_id', request.style_id.toString());
        if (request.template_id) formData.append('template_id', request.template_id.toString());
        if (request.post_objective) formData.append('post_objective', request.post_objective);
        if (request.post_style) formData.append('post_style', request.post_style);
        if (request.image_mode) formData.append('image_mode', request.image_mode);
        if (request.color_palette) formData.append('color_palette', request.color_palette);
        
        // Add image file
        formData.append('image', request.image);

        response = await axios.post(
          API_ENDPOINTS.CONTENT.GENERATE,
          formData,
          {
            headers: getAuthHeaders(), // Don't set Content-Type, let browser set it with boundary
          }
        );
      } else {
        // Use JSON for text-only requests
        const payload = {
          message: request.message,
          objective_id: request.objective_id,
          style_id: request.style_id,
          template_id: request.template_id,
          post_objective: request.post_objective,
          post_style: request.post_style,
          image_mode: request.image_mode,
          color_palette: request.color_palette,
        };

        response = await axios.post(
          API_ENDPOINTS.CONTENT.GENERATE,
          payload,
          {
            headers: getJsonAuthHeaders(),
          }
        );
      }

      // Check response structure
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Contenido generado exitosamente'
        );
      }

      // Handle error response from backend
      if (response.data && !response.data.success && response.data.error) {
        return ApiResponseHandler.error(
          'GENERATION_ERROR',
          'Error al generar contenido',
          response.data.error
        );
      }

      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió contenido válido'
      );
    } catch (error: any) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }

      // Handle validation errors
      if (error.response?.status === 400) {
        return ApiResponseHandler.error(
          'VALIDATION_ERROR',
          'Error de validación',
          error.response?.data?.error || 'Los datos proporcionados no son válidos'
        );
      }

      // Handle company info not found
      if (error.response?.data?.error?.includes('empresa')) {
        return ApiResponseHandler.error(
          'COMPANY_INFO_REQUIRED',
          'Información de empresa requerida',
          'Debes crear la información de tu empresa antes de generar contenido'
        );
      }

      // Handle generic server errors
      if (error.response?.status === 500) {
        return ApiResponseHandler.error(
          'INTERNAL_ERROR',
          'Error del servidor',
          error.response?.data?.error || 'Ocurrió un error al generar el contenido'
        );
      }

      return ApiResponseHandler.handleHttpError(error);
    }
  },

  /**
   * Regenerate content (create variation) based on previous content
   * Uses JSON only (no image upload)
   */
  regenerateContent: async (
    request: RegenerateContentRequest
  ): Promise<ApiResponse<ContentGenerationResponse>> => {
    try {
      const payload = {
        previous_content: request.previous_content,
        original_message: request.original_message,
        objective_id: request.objective_id,
        style_id: request.style_id,
        post_objective: request.post_objective,
        post_style: request.post_style,
        previous_image_path: request.previous_image_path,
        color_palette: request.color_palette,
      };

      const response = await axios.post(
        API_ENDPOINTS.CONTENT.REGENERATE,
        payload,
        {
          headers: getJsonAuthHeaders(),
        }
      );

      // Check response structure
      if (response.data && response.data.success && response.data.data) {
        return ApiResponseHandler.success(
          response.data.data,
          'Nueva variación generada exitosamente'
        );
      }

      // Handle error response from backend
      if (response.data && !response.data.success && response.data.error) {
        return ApiResponseHandler.error(
          'REGENERATION_ERROR',
          'Error al regenerar contenido',
          response.data.error
        );
      }

      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió contenido válido'
      );
    } catch (error: any) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }

      // Handle validation errors
      if (error.response?.status === 400) {
        return ApiResponseHandler.error(
          'VALIDATION_ERROR',
          'Error de validación',
          error.response?.data?.error || 'Los datos proporcionados no son válidos'
        );
      }

      // Handle company info not found
      if (error.response?.data?.error?.includes('empresa')) {
        return ApiResponseHandler.error(
          'COMPANY_INFO_REQUIRED',
          'Información de empresa requerida',
          'Debes crear la información de tu empresa antes de generar contenido'
        );
      }

      // Handle generic server errors
      if (error.response?.status === 500) {
        return ApiResponseHandler.error(
          'INTERNAL_ERROR',
          'Error del servidor',
          error.response?.data?.error || 'Ocurrió un error al regenerar el contenido'
        );
      }

      return ApiResponseHandler.handleHttpError(error);
    }
  },
};

