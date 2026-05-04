import api from './api';

export const loginUser = (payload) => api.post('/auth/login', payload);
export const registerUser = (payload) => api.post('/auth/register', payload);
export const getMyBookings = () => api.get('/bookings/my');
export const getAdminDashboard = () => api.get('/admin/dashboard');
