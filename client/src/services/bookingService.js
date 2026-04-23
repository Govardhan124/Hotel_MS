import api, { authConfig } from './api';

export const checkAvailability = async ({ roomId, checkIn, checkOut }) => {
  const response = await api.get(
    `/bookings/availability?roomId=${roomId}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`
  );
  return response.data;
};

export const createBooking = async (payload, token) => {
  const response = await api.post('/bookings', payload, authConfig(token));
  return response.data;
};

export const fetchMyBookings = async (token) => {
  const response = await api.get('/bookings/my', authConfig(token));
  return response.data;
};

export const cancelBooking = async (id, token) => {
  const response = await api.patch(`/bookings/${id}/cancel`, {}, authConfig(token));
  return response.data;
};

export const fetchAllBookings = async (token, page = 1, limit = 20) => {
  const response = await api.get(`/bookings/admin/all?page=${page}&limit=${limit}`, authConfig(token));
  return response.data;
};

export const fetchRevenue = async (token) => {
  const response = await api.get('/bookings/admin/revenue', authConfig(token));
  return response.data;
};
