import axios from 'axios';

const API_URL = 'https://ielts-backend-0u1s.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  signup: (email, password, name) => api.post('/api/auth/signup', { email, password, name }),
  getProfile: () => api.get('/api/auth/profile'),
  saveOnboarding: (data) => api.post('/api/auth/onboarding', data),
};

export const essayAPI = {
  evaluate: (essay) => api.post('/api/evaluate-essay', { essay }),
  rewrite: (essay, question, feedback) => api.post('/api/rewrite-essay', { essay, question, feedback }),
  evaluateTask1: (data) => api.post('/api/writing-task1/submit', data),
};

export default api;