// Export all models
export * from './Client';
export * from './SocialAccount';
export * from './ImageTemplate';
export * from './CompanyInfo';
export * from './GeneratedPost';
export * from './PostAnalytics';
export * from './Brand';
export * from './Template';

// Common types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  message?: string;
  error?: string;
};

export type SortOrder = 'asc' | 'desc';

export type FilterOptions = {
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  page?: number;
  limit?: number;
};
