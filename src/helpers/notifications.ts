import { toast } from "@/hooks/use-toast";

/**
 * Tipos de notificaciones disponibles
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interfaz para las opciones de notificación
 */
export interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
}

/**
 * Clase para manejar notificaciones del sistema
 */
export class NotificationHelper {
  /**
   * Muestra una notificación de éxito
   */
  static success(options: NotificationOptions = {}) {
    return toast({
      title: options.title || "¡Éxito!",
      description: options.description || "Operación completada correctamente",
      variant: "default",
      duration: options.duration || 5000,
    });
  }

  /**
   * Muestra una notificación de error
   */
  static error(options: NotificationOptions = {}) {
    return toast({
      title: options.title || "Error",
      description: options.description || "Ha ocurrido un error inesperado",
      variant: "destructive",
      duration: options.duration || 7000,
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  static warning(options: NotificationOptions = {}) {
    return toast({
      title: options.title || "Advertencia",
      description: options.description || "Ten cuidado con esta acción",
      variant: "default",
      duration: options.duration || 6000,
    });
  }

  /**
   * Muestra una notificación informativa
   */
  static info(options: NotificationOptions = {}) {
    return toast({
      title: options.title || "Información",
      description: options.description || "Información importante",
      variant: "default",
      duration: options.duration || 5000,
    });
  }

  /**
   * Muestra una notificación de carga
   */
  static loading(options: NotificationOptions = {}) {
    return toast({
      title: options.title || "Cargando...",
      description: options.description || "Procesando tu solicitud",
      variant: "default",
      duration: options.duration || 0, // 0 significa que no se cierra automáticamente
    });
  }

  /**
   * Notificaciones específicas para autenticación
   */
  static auth = {
    loginSuccess: () => this.success({
      title: "¡Bienvenido!",
      description: "Has iniciado sesión correctamente"
    }),
    
    loginError: (message?: string) => this.error({
      title: "Error de inicio de sesión",
      description: message || "Credenciales incorrectas"
    }),
    
    logoutSuccess: () => this.info({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente"
    }),
    
    sessionExpired: () => this.warning({
      title: "Sesión expirada",
      description: "Tu sesión ha expirado, por favor inicia sesión nuevamente"
    })
  };

  /**
   * Notificaciones específicas para posts
   */
  static posts = {
    created: () => this.success({
      title: "Post creado",
      description: "Tu post se ha creado exitosamente"
    }),
    
    updated: () => this.success({
      title: "Post actualizado",
      description: "Tu post se ha actualizado correctamente"
    }),
    
    deleted: () => this.success({
      title: "Post eliminado",
      description: "Tu post se ha eliminado correctamente"
    }),
    
    error: (message?: string) => this.error({
      title: "Error en el post",
      description: message || "No se pudo procesar el post"
    })
  };

  /**
   * Notificaciones específicas para la API
   */
  static api = {
    connectionError: () => this.error({
      title: "Error de conexión",
      description: "No se pudo conectar con el servidor"
    }),
    
    serverError: () => this.error({
      title: "Error del servidor",
      description: "El servidor está experimentando problemas"
    }),
    
    networkError: () => this.error({
      title: "Error de red",
      description: "Verifica tu conexión a internet"
    }),
    
    timeout: () => this.error({
      title: "Tiempo de espera agotado",
      description: "La solicitud tardó demasiado en responder"
    })
  };
}

/**
 * Hook personalizado para usar las notificaciones
 */
export const useNotifications = () => {
  return {
    success: NotificationHelper.success,
    error: NotificationHelper.error,
    warning: NotificationHelper.warning,
    info: NotificationHelper.info,
    loading: NotificationHelper.loading,
    auth: NotificationHelper.auth,
    posts: NotificationHelper.posts,
    api: NotificationHelper.api,
  };
};

export default NotificationHelper;
