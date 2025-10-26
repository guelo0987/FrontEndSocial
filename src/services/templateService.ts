import type { ImageTemplateCreateRequest, ImageTemplateUpdateRequest, ImageTemplateResponse } from '../models/ImageTemplate';
import { API_ENDPOINTS } from '../api/endpoints';
import axios, { type AxiosResponse } from 'axios';

class TemplateService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token de autorización
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de respuesta
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
        throw new Error(errorMessage);
      }
    );
  }


  /**
   * Obtener todos los templates del cliente
   */
  async getTemplates(): Promise<ImageTemplateResponse[]> {
    const response: AxiosResponse<{data: {templates: ImageTemplateResponse[]}, success: boolean}> = 
      await this.axiosInstance.get(API_ENDPOINTS.TEMPLATES.GET);
    return response.data.data.templates;
  }

  /**
   * Obtener un template específico por ID
   */
  async getTemplateById(id: number): Promise<ImageTemplateResponse> {
    const response: AxiosResponse<ImageTemplateResponse> = 
      await this.axiosInstance.get(`${API_ENDPOINTS.TEMPLATES.GET_BY_ID}${id}`);
    return response.data;
  }

  /**
   * Crear un nuevo template
   */
  async createTemplate(templateData: ImageTemplateCreateRequest): Promise<ImageTemplateResponse> {
    const response: AxiosResponse<ImageTemplateResponse> = 
      await this.axiosInstance.post(API_ENDPOINTS.TEMPLATES.CREATE, templateData);
    return response.data;
  }

  /**
   * Actualizar un template existente
   */
  async updateTemplate(id: number, templateData: ImageTemplateUpdateRequest): Promise<ImageTemplateResponse> {
    const response: AxiosResponse<ImageTemplateResponse> = 
      await this.axiosInstance.put(`${API_ENDPOINTS.TEMPLATES.UPDATE}/${id}`, templateData);
    return response.data;
  }

  /**
   * Eliminar un template
   */
  async deleteTemplate(id: number): Promise<void> {
    await this.axiosInstance.delete(`${API_ENDPOINTS.TEMPLATES.DELETE}/${id}`);
  }

  /**
   * Subir archivo de template
   */
  async uploadTemplateFile(file: File): Promise<{ storage_path: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response: AxiosResponse<{ storage_path: string }> = 
      await this.axiosInstance.post(`${API_ENDPOINTS.TEMPLATES.CREATE}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    return response.data;
  }

  /**
   * Obtener URL de preview del template
   */
  getTemplatePreviewUrl(storagePath: string): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    // Si la ruta ya incluye /static/, usar la ruta completa
    if (storagePath.startsWith('/static/')) {
      return `${baseUrl}${storagePath}`;
    }
    // Si no, construir la ruta completa
    return `${baseUrl}/uploads/templates/${storagePath}`;
  }

  /**
   * Validar archivo de template
   */
  validateTemplateFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de archivo no soportado. Use JPG, PNG, GIF o WebP.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'El archivo es demasiado grande. Máximo 10MB.'
      };
    }

    return { isValid: true };
  }
}

export const templateService = new TemplateService();
export default templateService;
