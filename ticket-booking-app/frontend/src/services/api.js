import axios from 'axios';

const BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || err.message || 'Network error';
    return Promise.reject({ ...err, displayMessage: msg });
  }
);

export default api;
export const getEvent = (id) => api.get(`/events/${id}`);
export const getEvents = () => api.get('/events');
export const sendOtp = (email) => api.post('/otp/send', { email });
export const resendOtp = (email) => api.post('/otp/resend', { email });
export const verifyOtp = (email, otp) => api.post('/otp/verify', { email, otp });
export const confirmBooking = (bookingData) => api.post('/bookings', bookingData);
export const getBooking = (id) => api.get(`/bookings/${id}`);
