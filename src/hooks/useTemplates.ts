import { useState, useEffect } from 'react';
import { templateService } from '@/services/templateService';
import type { ImageTemplateResponse } from '@/models/ImageTemplate';

/**
 * Custom hook to manage templates
 * Fetches and provides templates for the authenticated user
 */
export const useTemplates = () => {
  const [templates, setTemplates] = useState<ImageTemplateResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar plantillas';
      setError(errorMessage);
      console.error('Error fetching templates:', err);
      // Don't show toast on initial load to avoid noise
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  /**
   * Refresh templates list
   */
  const refreshTemplates = async () => {
    await fetchTemplates();
  };

  /**
   * Get template preview URL
   */
  const getTemplatePreviewUrl = (storagePath: string): string => {
    return templateService.getTemplatePreviewUrl(storagePath);
  };

  return {
    templates,
    isLoading,
    error,
    refreshTemplates,
    getTemplatePreviewUrl,
  };
};

