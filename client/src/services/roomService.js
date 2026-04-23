import api, { authConfig } from './api';

export const fetchRooms = async (query = '') => {
  const response = await api.get(`/rooms${query ? `?${query}` : ''}`);
  return response.data;
};

export const createRoom = async (payload, token) => {
  const response = await api.post('/rooms', payload, authConfig(token));
  return response.data;
};

export const updateRoom = async (id, payload, token) => {
  const response = await api.put(`/rooms/${id}`, payload, authConfig(token));
  return response.data;
};

export const deleteRoom = async (id, token) => {
  const response = await api.delete(`/rooms/${id}`, authConfig(token));
  return response.data;
};
