/**
 * Tipos de respuesta de la API
 */
export type ApiResponseStatus = 'success' | 'error' | 'warning' | 'info';

/**
 * Interfaz base para todas las respuestas de la API
 */
export interface BaseApiResponse {
  status: ApiResponseStatus;
  message: string;
  timestamp: string;
  path?: string;
}

/**
 * Interfaz para respuestas exitosas
 */
export interface SuccessApiResponse<T = any> extends BaseApiResponse {
  status: 'success';
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

/**
 * Interfaz para respuestas de error
 */
export interface ErrorApiResponse extends BaseApiResponse {
  status: 'error';
  error: {
    code: string;
    details?: string;
    field?: string;
    stack?: string;
  };
  validation?: {
    field: string;
    message: string;
  }[];
}

/**
 * Interfaz para respuestas de advertencia
 */
export interface WarningApiResponse extends BaseApiResponse {
  status: 'warning';
  warnings: string[];
  data?: any;
}

/**
 * Interfaz para respuestas informativas
 */
export interface InfoApiResponse extends BaseApiResponse {
  status: 'info';
  data?: any;
}

/**
 * Unión de todos los tipos de respuesta
 */
export type ApiResponse<T = any> = 
  | SuccessApiResponse<T>
  | ErrorApiResponse
  | WarningApiResponse
  | InfoApiResponse;

/**
 * Códigos de error estándar
 */
export const API_ERROR_CODES = {
  // Errores de autenticación
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Errores de validación
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Errores de recursos
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Errores del servidor
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  
  // Errores de red
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
} as const;

/**
 * Clase para manejar respuestas de la API
 */
export class ApiResponseHandler {
  /**
   * Crea una respuesta exitosa
   */
  static success<T>(data: T, message: string = 'Operación exitosa', meta?: any): SuccessApiResponse<T> {
    return {
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString(),
      meta,
    };
  }

  /**
   * Crea una respuesta de error
   */
  static error(
    code: string,
    message: string,
    details?: string,
    field?: string,
    validation?: { field: string; message: string }[]
  ): ErrorApiResponse {
    return {
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
      error: {
        code,
        details,
        field,
      },
      validation,
    };
  }

  /**
   * Crea una respuesta de advertencia
   */
  static warning(message: string, warnings: string[], data?: any): WarningApiResponse {
    return {
      status: 'warning',
      message,
      warnings,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Crea una respuesta informativa
   */
  static info(message: string, data?: any): InfoApiResponse {
    return {
      status: 'info',
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Maneja errores HTTP y los convierte a respuestas de API
   */
  static handleHttpError(error: any): ErrorApiResponse {
    const timestamp = new Date().toISOString();
    
    // Error de red
    if (!error.response) {
      return {
        status: 'error',
        message: 'Error de conexión',
        timestamp,
        error: {
          code: API_ERROR_CODES.NETWORK_ERROR,
          details: 'No se pudo conectar con el servidor',
        },
      };
    }

    const { status, data } = error.response;
    
    // Mapeo de códigos HTTP a códigos de error personalizados
    const statusCodeMap: Record<number, string> = {
      400: API_ERROR_CODES.VALIDATION_ERROR,
      401: API_ERROR_CODES.UNAUTHORIZED,
      403: API_ERROR_CODES.FORBIDDEN,
      404: API_ERROR_CODES.NOT_FOUND,
      409: API_ERROR_CODES.CONFLICT,
      422: API_ERROR_CODES.VALIDATION_ERROR,
      500: API_ERROR_CODES.INTERNAL_ERROR,
      503: API_ERROR_CODES.SERVICE_UNAVAILABLE,
    };

    return {
      status: 'error',
      message: data?.message || 'Error del servidor',
      timestamp,
      error: {
        code: statusCodeMap[status] || API_ERROR_CODES.INTERNAL_ERROR,
        details: data?.details || `Error HTTP ${status}`,
      },
      validation: data?.validation,
    };
  }

  /**
   * Valida si una respuesta es exitosa
   */
  static isSuccess<T>(response: ApiResponse<T>): response is SuccessApiResponse<T> {
    return response.status === 'success';
  }

  /**
   * Valida si una respuesta es un error
   */
  static isError(response: ApiResponse): response is ErrorApiResponse {
    return response.status === 'error';
  }

  /**
   * Valida si una respuesta es una advertencia
   */
  static isWarning<T>(response: ApiResponse<T>): response is WarningApiResponse {
    return response.status === 'warning';
  }

  /**
   * Valida si una respuesta es informativa
   */
  static isInfo<T>(response: ApiResponse<T>): response is InfoApiResponse {
    return response.status === 'info';
  }
}

/**
 * Respuestas predefinidas para casos comunes
 */
export const CommonApiResponses = {
  // Respuestas de autenticación
  auth: {
    loginSuccess: (user: any) => ApiResponseHandler.success(user, 'Inicio de sesión exitoso'),
    loginError: () => ApiResponseHandler.error(
      API_ERROR_CODES.INVALID_CREDENTIALS,
      'Credenciales incorrectas',
      'El email o contraseña no son válidos'
    ),
    logoutSuccess: () => ApiResponseHandler.success(null, 'Sesión cerrada correctamente'),
    sessionExpired: () => ApiResponseHandler.error(
      API_ERROR_CODES.TOKEN_EXPIRED,
      'Sesión expirada',
      'Tu sesión ha expirado, por favor inicia sesión nuevamente'
    ),
  },

  // Respuestas de posts
  posts: {
    created: (post: any) => ApiResponseHandler.success(post, 'Post creado exitosamente'),
    updated: (post: any) => ApiResponseHandler.success(post, 'Post actualizado exitosamente'),
    deleted: () => ApiResponseHandler.success(null, 'Post eliminado exitosamente'),
    notFound: () => ApiResponseHandler.error(
      API_ERROR_CODES.NOT_FOUND,
      'Post no encontrado',
      'El post que buscas no existe'
    ),
    validationError: (errors: { field: string; message: string }[]) => ApiResponseHandler.error(
      API_ERROR_CODES.VALIDATION_ERROR,
      'Error de validación',
      'Los datos proporcionados no son válidos',
      undefined,
      errors
    ),
  },

  // Respuestas de usuarios
  users: {
    created: (user: any) => ApiResponseHandler.success(user, 'Usuario creado exitosamente'),
    updated: (user: any) => ApiResponseHandler.success(user, 'Usuario actualizado exitosamente'),
    notFound: () => ApiResponseHandler.error(
      API_ERROR_CODES.NOT_FOUND,
      'Usuario no encontrado',
      'El usuario que buscas no existe'
    ),
    alreadyExists: () => ApiResponseHandler.error(
      API_ERROR_CODES.ALREADY_EXISTS,
      'Usuario ya existe',
      'Ya existe un usuario con este email'
    ),
  },

  // Respuestas de archivos
  files: {
    uploaded: (file: any) => ApiResponseHandler.success(file, 'Archivo subido exitosamente'),
    deleted: () => ApiResponseHandler.success(null, 'Archivo eliminado exitosamente'),
    tooLarge: () => ApiResponseHandler.error(
      API_ERROR_CODES.VALIDATION_ERROR,
      'Archivo demasiado grande',
      'El archivo excede el tamaño máximo permitido'
    ),
    invalidFormat: () => ApiResponseHandler.error(
      API_ERROR_CODES.INVALID_FORMAT,
      'Formato de archivo inválido',
      'El formato del archivo no es compatible'
    ),
  },
};

export default ApiResponseHandler;
