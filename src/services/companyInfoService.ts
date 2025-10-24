import axios from 'axios';
import type { 
  CompanyInfoCreateRequest, 
  CompanyInfoUpdateRequest, 
  CompanyInfoResponse 
} from '@/models';
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

// Company Info service
export const companyInfoService = {
  // Get company info
  getCompanyInfo: async (): Promise<ApiResponse<CompanyInfoResponse>> => {
    try {
      const response = await axios.get(API_ENDPOINTS.COMPANY_INFO.GET, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.company_info) {
        return ApiResponseHandler.success(
          response.data.company_info,
          'Información de empresa obtenida exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió información válida'
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return ApiResponseHandler.error(
          'NOT_FOUND',
          'Información de empresa no encontrada',
          'No se ha configurado la información de la empresa'
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Create company info
  createCompanyInfo: async (companyData: CompanyInfoCreateRequest): Promise<ApiResponse<CompanyInfoResponse>> => {
    try {
      const response = await axios.post(API_ENDPOINTS.COMPANY_INFO.CREATE, companyData, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.company_info) {
        return ApiResponseHandler.success(
          response.data.company_info,
          'Información de empresa creada exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió información válida'
      );
    } catch (error: any) {
      if (error.response?.status === 400) {
        return ApiResponseHandler.error(
          'ALREADY_EXISTS',
          'Información de empresa ya existe',
          'Ya se ha configurado la información de la empresa para este usuario'
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      if (error.response?.status === 422) {
        return ApiResponseHandler.error(
          'VALIDATION_ERROR',
          'Datos de empresa inválidos',
          'Verifica que todos los campos sean correctos',
          undefined,
          error.response?.data?.validation
        );
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Update company info
  updateCompanyInfo: async (companyData: CompanyInfoUpdateRequest): Promise<ApiResponse<CompanyInfoResponse>> => {
    try {
      const response = await axios.put(API_ENDPOINTS.COMPANY_INFO.UPDATE, companyData, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success) {
        // Si el servidor no devuelve la información actualizada, hacer una nueva consulta
        const getResponse = await companyInfoService.getCompanyInfo();
        if (ApiResponseHandler.isSuccess(getResponse)) {
          return ApiResponseHandler.success(
            getResponse.data,
            'Información de empresa actualizada exitosamente'
          );
        }
        
        return ApiResponseHandler.success(
          {} as CompanyInfoResponse,
          'Información de empresa actualizada exitosamente'
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
          'Información de empresa no encontrada',
          'No se ha configurado la información de la empresa'
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      if (error.response?.status === 422) {
        return ApiResponseHandler.error(
          'VALIDATION_ERROR',
          'Datos de empresa inválidos',
          'Verifica que todos los campos sean correctos',
          undefined,
          error.response?.data?.validation
        );
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Delete company info
  deleteCompanyInfo: async (): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(API_ENDPOINTS.COMPANY_INFO.DELETE, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success) {
        return ApiResponseHandler.success(
          null,
          'Información de empresa eliminada exitosamente'
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
          'Información de empresa no encontrada',
          'No se ha configurado la información de la empresa'
        );
      }
      
      if (error.response?.status === 401) {
        return CommonApiResponses.auth.sessionExpired();
      }
      
      return ApiResponseHandler.handleHttpError(error);
    }
  },

  // Check if company info exists
  hasCompanyInfo: async (): Promise<boolean> => {
    try {
      const response = await companyInfoService.getCompanyInfo();
      return ApiResponseHandler.isSuccess(response);
    } catch {
      return false;
    }
  },

  // Create company info with file upload
  createCompanyInfoWithFile: async (formData: FormData): Promise<ApiResponse<CompanyInfoResponse>> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.COMPANY_INFO.CREATE, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary
        }
      });
      
      if (response.data && response.data.success && response.data.company_info) {
        return ApiResponseHandler.success(
          response.data.company_info,
          'Información de empresa creada exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió información válida'
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

  // Update company info with file upload
  updateCompanyInfoWithFile: async (formData: FormData): Promise<ApiResponse<CompanyInfoResponse>> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(API_ENDPOINTS.COMPANY_INFO.UPDATE, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary
        }
      });
      
      if (response.data && response.data.success && response.data.company_info) {
        return ApiResponseHandler.success(
          response.data.company_info,
          'Información de empresa actualizada exitosamente'
        );
      }
      
      return ApiResponseHandler.error(
        'INVALID_RESPONSE',
        'Respuesta inválida del servidor',
        'El servidor no devolvió información válida'
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return ApiResponseHandler.error(
          'NOT_FOUND',
          'Información de empresa no encontrada',
          'No se ha configurado la información de la empresa'
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
  }
};
