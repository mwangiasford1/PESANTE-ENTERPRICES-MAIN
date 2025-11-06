import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
console.log('API_BASE:', API_BASE);

// Automatically attach JWT token to every request
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

// --- 🔐 Admin ---
export const adminLogin = (data) => axios.post(`${API_BASE}/admin/login`, data).then(r => r.data);
export const changePassword = (data) => axios.post(`${API_BASE}/admin/change-password`, data).then(r => r.data);

// --- Dashboard ---
export const getDashboard = (propertyId) => axios.get(`${API_BASE}/dashboard/${propertyId}`).then(r => r.data);
export const createDashboard = (data) => axios.post(`${API_BASE}/dashboard`, data).then(r => r.data);

// --- Projects ---
export const getProjects = () => axios.get(`${API_BASE}/projects`).then(r => r.data);
export const addProject = (data) => axios.post(`${API_BASE}/projects`, data).then(r => r.data);
export const updateProject = (id, data) => axios.put(`${API_BASE}/projects/${id}`, data).then(r => r.data);
export const deleteProject = (id) => axios.delete(`${API_BASE}/projects/${id}`).then(r => r.data);

// --- Land Titles ---
export const getLandTitles = () => axios.get(`${API_BASE}/land-titles`).then(r => r.data);
export const addLandTitle = (data) => axios.post(`${API_BASE}/land-titles`, data).then(r => r.data);
export const updateLandTitle = (id, data) => axios.put(`${API_BASE}/land-titles/${id}`, data).then(r => r.data);
export const deleteLandTitle = (id) => axios.delete(`${API_BASE}/land-titles/${id}`).then(r => r.data);

// --- Compliance ---
export const getCompliance = () => axios.get(`${API_BASE}/compliance`).then(r => r.data);
export const addCompliance = (data) => axios.post(`${API_BASE}/compliance`, data).then(r => r.data);
export const updateCompliance = (id, data) => axios.put(`${API_BASE}/compliance/${id}`, data).then(r => r.data);
export const deleteCompliance = (id) => axios.delete(`${API_BASE}/compliance/${id}`).then(r => r.data);

// --- Contractors ---
export const getContractors = () => axios.get(`${API_BASE}/contractors`).then(r => r.data);
export const addContractor = (data) => axios.post(`${API_BASE}/contractors`, data).then(r => r.data);
export const updateContractor = (id, data) => axios.put(`${API_BASE}/contractors/${id}`, data).then(r => r.data);
export const deleteContractor = (id) => axios.delete(`${API_BASE}/contractors/${id}`).then(r => r.data);

// Generic GET method for dashboard
export const get = (endpoint) => axios.get(`${API_BASE}${endpoint}`);
