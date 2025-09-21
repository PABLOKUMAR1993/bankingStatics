export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  API_BASE_PATH: '/api/v1',
  ENDPOINTS: {
    CATEGORIES: {
      BASE: '/api/v1/categories',
      BULK_UPDATE: '/api/v1/categories/bulk-update',
      BULK_CREATE: '/api/v1/categories/bulk-create'
    },
    TRANSACTIONS: {
      BASE: '/api/v1/transactions',
      UPDATE: (id: number): string => `/api/v1/transactions/${id}`,
      BULK_CREATE: '/api/v1/transactions/bulk-create',
      SEARCH: '/api/v1/transactions/search',
      CURRENT_BALANCE: '/api/v1/transactions/current-balance'
    },
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout'
    }
  }
};
