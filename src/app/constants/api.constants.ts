export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    TRANSACTIONS: {
      BASE: '/transactions',
      BY_ID: (id: number): string => `/transactions/${id}`,
    },
    CATEGORIES: {
      BASE: '/categories',
      BY_ID: (id: number): string => `/categories/${id}`,
    }
  }
};
