import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: { nickname: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const articlesAPI = {
  getAll: (params?: { game_id?: number; tag?: string }) =>
    api.get('/articles', { params }),
  getOne: (id: number) => api.get(`/articles/${id}`),
  create: (data: any) => api.post('/articles', data),
  update: (id: number, data: any) => api.put(`/articles/${id}`, data),
  delete: (id: number) => api.delete(`/articles/${id}`),
};

export const eventsAPI = {
  getAll: () => api.get('/events'),
  create: (data: any) => api.post('/events', data),
  join: (id: number) => api.post(`/events/${id}/join`),
  leave: (id: number) => api.delete(`/events/${id}/leave`),
};

export const filesAPI = {
  getAll: () => api.get('/files'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: number) => api.delete(`/files/${id}`),
};

export const gamesAPI = {
  getAll: () => api.get('/games'),
  getOne: (id: number) => api.get(`/games/${id}`),
  create: (data: any) => api.post('/games', data),
  update: (id: number, data: any) => api.put(`/games/${id}`, data),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id: number, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
  getStatistics: () => api.get('/admin/statistics'),
};

export default api;