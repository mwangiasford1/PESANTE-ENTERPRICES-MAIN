import axios from 'axios';

const API_BASE = '/api';

// 🔐 Automatically attach JWT token to every request
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('pesante_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- ✅ Properties ---
export const getProperties = () => axios.get(`${API_BASE}/properties`).then(r => r.data);
export const addProperty = (data) => axios.post(`${API_BASE}/properties`, data).then(r => r.data);
export const updateProperty = (id, data) => axios.put(`${API_BASE}/properties/${id}`, data).then(r => r.data);
export const deleteProperty = (id) => axios.delete(`${API_BASE}/properties/${id}`).then(r => r.data);

// --- 🗓️ Appointments ---
export const getAppointments = () => axios.get(`${API_BASE}/appointments`).then(r => r.data);
export const addAppointment = (data) => axios.post(`${API_BASE}/appointments`, data).then(r => r.data);
export const updateAppointment = (id, data) => axios.put(`${API_BASE}/appointments/${id}`, data).then(r => r.data);
export const deleteAppointment = (id) => axios.delete(`${API_BASE}/appointments/${id}`).then(r => r.data);

// --- 💬 Inquiries ---
export const getInquiries = () => axios.get(`${API_BASE}/inquiries`).then(r => r.data);
export const addInquiry = (data) => axios.post(`${API_BASE}/inquiries`, data).then(r => r.data);
export const updateInquiry = (id, data) => axios.put(`${API_BASE}/inquiries/${id}`, data).then(r => r.data);
export const deleteInquiry = (id) => axios.delete(`${API_BASE}/inquiries/${id}`).then(r => r.data);
