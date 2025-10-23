import { useState, useEffect } from 'react';
import { catalogService } from '@/services/catalogService';
import type { PostObjective, VisualStyle } from '@/models';
import { ApiResponseHandler } from '@/helpers';

interface UseCatalogsReturn {
  objectives: PostObjective[];
  styles: VisualStyle[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * Hook personalizado para cargar y gestionar los catálogos de objetivos y estilos
 * Se carga una sola vez al montar el componente y se cachea en el estado
 */
export const useCatalogs = (): UseCatalogsReturn => {
  const [objectives, setObjectives] = useState<PostObjective[]>([]);
  const [styles, setStyles] = useState<VisualStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await catalogService.loadAllCatalogs();
      
      if (ApiResponseHandler.isSuccess(response)) {
        setObjectives(response.data.objectives);
        setStyles(response.data.styles);
      } else {
        setError(response.message || 'Error al cargar catálogos');
      }
    } catch (err) {
      console.error('Error loading catalogs:', err);
      setError('Error inesperado al cargar catálogos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  return {
    objectives,
    styles,
    isLoading,
    error,
    reload: loadCatalogs
  };
};

