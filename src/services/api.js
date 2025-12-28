import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const userAPI = {
  register: (userData) => api.post('/users/register', userData),
  authenticate: (email, password) => api.post('/users/authenticate', { email, password }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  changePassword: (id, currentPassword, newPassword) => api.post(`/users/${id}/change-password`, { currentPassword, newPassword }),
  getAllUsers: () => api.get('/users'),
};

// Cars API
export const carAPI = {
  getAllCars: (params) => api.get('/cars', { params }),
  getCarById: (id) => api.get(`/cars/${id}`),
  addCar: (carData) => api.post('/cars', carData),
  updateCar: (id, carData) => api.put(`/cars/${id}`, carData),
  deleteCar: (id) => api.delete(`/cars/${id}`),
  getCarsByOwner: (ownerId) => api.get(`/cars/owner/${ownerId}`),
};

// Reservations API
export const reservationAPI = {
  createReservation: (reservationData) => api.post('/reservations', reservationData),
  getReservationById: (id) => api.get(`/reservations/${id}`),
  getReservationsByUser: (userId) => api.get(`/reservations/user/${userId}`),
  getReservationsByCar: (carId) => api.get(`/reservations/car/${carId}`),
  updateReservation: (id, reservationData) => api.put(`/reservations/${id}`, reservationData),
  cancelReservation: (id) => api.delete(`/reservations/${id}`),
  getAllReservations: () => api.get('/reservations'),
};

export default api;

