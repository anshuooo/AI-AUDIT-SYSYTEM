/**
 * API Service Layer for MERN Stack
 * Handles all backend communication with proper error handling
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📡 [API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('📡 [API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ [API] Response error:', error.response?.status, error.response?.data || error.message);

    // Handle common error cases
    if (error.response?.status === 404) {
      console.error('🚫 API endpoint not found');
    } else if (error.response?.status === 500) {
      console.error('🔥 Server error');
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('🌐 Network error - check your internet connection');
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const auditAPI = {
  // Analyze audit data
  analyze: (auditData) => api.post('/api/audit', auditData),

  // Save audit results
  save: (auditData) => api.post('/api/audit/save', auditData),

  // Get audit by ID
  getById: (id) => api.get(`/api/audit/${id}`),
};

export const leadAPI = {
  // Capture lead
  capture: (leadData) => api.post('/api/lead', leadData),
};

export const healthAPI = {
  // Health check
  check: () => api.get('/health'),
};

export default api;