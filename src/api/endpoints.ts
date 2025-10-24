// API Endpoints configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    VERIFY: `${BASE_URL}/api/auth/verify`,
    REFRESH: `${BASE_URL}/api/auth/refresh`,
  },
  COMPANY_INFO: {
    GET: `${BASE_URL}/api/company-info`,
    CREATE: `${BASE_URL}/api/company-info`,
    UPDATE: `${BASE_URL}/api/company-info`,
    DELETE: `${BASE_URL}/api/company-info`,
  },
  POSTS: {
    GET: `${BASE_URL}/api/posts/`,
    GET_BY_ID: `${BASE_URL}/api/posts/`,
    DELETE: `${BASE_URL}/api/posts/`,
  },
  CATALOG: {
    GET_OBJECTIVES: `${BASE_URL}/api/catalog/objectives`,
    POST_OBJECTIVES: `${BASE_URL}/api/catalog/objectives`,
    DELETE_OBJECTIVES: `${BASE_URL}/api/catalog/objectives/`,
    UPDATE_OBJECTIVES: `${BASE_URL}/api/catalog/objectives/`,
    GET_STYLES: `${BASE_URL}/api/catalog/styles`,
    POST_STYLES: `${BASE_URL}/api/catalog/styles`,
    DELETE_STYLES: `${BASE_URL}/api/catalog/styles/`,
    UPDATE_STYLES: `${BASE_URL}/api/catalog/styles/`,
  },
  TEMPLATES: {
    GET: `${BASE_URL}/api/templates/`,
    CREATE: `${BASE_URL}/api/templates`,
    GET_BY_ID: `${BASE_URL}/api/templates`,
    UPDATE: `${BASE_URL}/api/templates`,
    DELETE: `${BASE_URL}/api/templates`,
  },
  CONTENT: {
    GENERATE: `${BASE_URL}/api/generate-content`,
    REGENERATE: `${BASE_URL}/api/regenerate-content`,
  },

} as const;
