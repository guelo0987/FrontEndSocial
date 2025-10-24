/**
 * Archivo principal de exportación para todos los servicios
 */

// Auth Service
export { authService } from './authService';

// Company Info Service
export { companyInfoService } from './companyInfoService';

// Posts Service
export { 
  postsService,
  type PaginatedPostsResponse
} from './postsService';

// Catalog Service
export { 
  catalogService,
  type ObjectivesResponse,
  type StylesResponse
} from './catalogService';

// Template Service
export { 
  templateService
} from './templateService';

// Content Generation Service
export {
  contentService,
  type GenerateContentRequest,
  type RegenerateContentRequest,
  type ContentGenerationResponse
} from './contentService';

