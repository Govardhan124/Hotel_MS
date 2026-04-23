import api, { authConfig } from './api';

export const getProfile = async (token) => {
  const response = await api.get('/auth/me', authConfig(token));
  return response.data;
};

export const fetchUsers = async (token) => {
  const response = await api.get('/users', authConfig(token));
  return response.data;
};

export const updateUserRole = async (id, role, token) => {
  const response = await api.put(`/users/${id}/role`, { role }, authConfig(token));
  return response.data;
};

export const deleteUser = async (id, token) => {
  const response = await api.delete(`/users/${id}`, authConfig(token));
  return response.data;
};
