import axios from 'axios';

// The API base URL is read from an environment variable so it can be
// changed at build/deploy time (Docker, Kubernetes) without touching code.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getTasks = async () => {
  const response = await apiClient.get('/tasks');
  return response.data.data;
};

export const getTaskById = async (id) => {
  const response = await apiClient.get(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (task) => {
  const response = await apiClient.post('/tasks', task);
  return response.data.data;
};

export const updateTask = async (id, task) => {
  const response = await apiClient.put(`/tasks/${id}`, task);
  return response.data.data;
};

export const deleteTask = async (id) => {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await apiClient.patch(`/tasks/${id}/status`, { status });
  return response.data.data;
};

export default apiClient;
