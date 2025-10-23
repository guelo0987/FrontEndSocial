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
} as const;
