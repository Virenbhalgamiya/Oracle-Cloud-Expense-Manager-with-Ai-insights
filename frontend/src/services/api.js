import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Expense service
export const expenseService = {
  createExpense: async (expenseData) => {
    const response = await api.post('/expenses/', expenseData);
    return response.data;
  },

  getUserExpenses: async (params = {}) => {
    const response = await api.get('/expenses/user', { params });
    return response.data;
  },

  getAllExpenses: async (params = {}) => {
    const response = await api.get('/expenses/', { params });
    return response.data;
  },

  getExpense: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  approveExpense: async (id) => {
    const response = await api.put(`/expenses/${id}/approve`);
    return response.data;
  },

  rejectExpense: async (id) => {
    const response = await api.put(`/expenses/${id}/reject`);
    return response.data;
  },

  getExpensesByStatus: async (status, params = {}) => {
    const response = await api.get(`/expenses/status/${status}`, { params });
    return response.data;
  },
};

// Analytics service
export const analyticsService = {
  getMonthlyAnalytics: async () => {
    const response = await api.get('/analytics/monthly');
    return response.data;
  },

  getAllAnalytics: async () => {
    const response = await api.get('/analytics/all');
    return response.data;
  },

  getCategoryBreakdown: async () => {
    const response = await api.get('/analytics/categories');
    return response.data;
  },

  getMonthlyTrends: async () => {
    const response = await api.get('/analytics/trends');
    return response.data;
  },

  getStatusBreakdown: async () => {
    const response = await api.get('/analytics/status');
    return response.data;
  },

  getRecentExpenses: async () => {
    const response = await api.get('/analytics/recent');
    return response.data;
  },
};

// AI service
export const aiService = {
  getAISummary: async (days = 30) => {
    const response = await api.post('/ai/summary', { days });
    return response.data;
  },

  predictCategory: async (title, amount, description = '') => {
    const response = await api.post('/ai/predict-category', {
      title,
      amount,
      description,
    });
    return response.data;
  },

  getBudgetRecommendations: async (monthlyBudget) => {
    const response = await api.post('/ai/budget-recommendations', {
      monthly_budget: monthlyBudget,
    });
    return response.data;
  },
};

// Category service
export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories/', categoryData);
    return response.data;
  },

  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

export default api; 