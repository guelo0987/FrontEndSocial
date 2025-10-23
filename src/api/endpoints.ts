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
    OBJECTIVES: `${BASE_URL}/api/catalog/objectives`,
    STYLES: `${BASE_URL}/api/catalog/styles`,
  },

} as const;
