const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Goals API
export const goalsAPI = {
  getAll: () => apiRequest('/goals'),
  getOne: (id) => apiRequest(`/goals/${id}`),
  create: (data) => apiRequest('/goals', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/goals/${id}`, { method: 'DELETE' }),
};

// Consumption API
export const consumptionAPI = {
  getAll: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/consumption${query ? `?${query}` : ''}`);
  },
  getLive: () => apiRequest('/consumption/live'),
  getBreakdown: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/consumption/breakdown${query ? `?${query}` : ''}`);
  },
  create: (data) => apiRequest('/consumption', { method: 'POST', body: JSON.stringify(data) }),
};

// Meters API
export const metersAPI = {
  getAll: () => apiRequest('/meters'),
  getOne: (id) => apiRequest(`/meters/${id}`),
  create: (data) => apiRequest('/meters', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/meters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/meters/${id}`, { method: 'DELETE' }),
};

// Reports API
export const reportsAPI = {
  schedule: (data) => apiRequest('/reports/schedule', { method: 'POST', body: JSON.stringify(data) }),
  generate: (data) => apiRequest('/reports/generate', { method: 'POST', body: JSON.stringify(data) }),
};

// Analytics API
export const analyticsAPI = {
  getStats: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/analytics${query ? `?${query}` : ''}`);
  },
  getPrediction: () => apiRequest('/analytics/prediction'),
  getComparison: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/analytics/comparison${query ? `?${query}` : ''}`);
  },
};

// Admin API
export const adminAPI = {
  // User Management
  getUsers: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${query ? `?${query}` : ''}`);
  },
  getPending: () => apiRequest('/admin/pending'),
  getVerified: () => apiRequest('/admin/verified'),
  verifyUser: (id) => apiRequest(`/admin/verify/${id}`, { method: 'PATCH' }),
  rejectUser: (id, reason) => apiRequest(`/admin/reject/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
  }),
  deactivateUser: (id, reason) => apiRequest(`/admin/users/${id}/deactivate`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  }),
  reactivateUser: (id) => apiRequest(`/admin/users/${id}/reactivate`, { method: 'PATCH' }),
  getUserAuditLogs: (id) => apiRequest(`/admin/users/${id}/audit-logs`),
  
  // Analytics
  getAnalytics: () => apiRequest('/admin/analytics'),
  
  // Support Tickets
  getTickets: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/tickets${query ? `?${query}` : ''}`);
  },
  getTicket: (id) => apiRequest(`/admin/tickets/${id}`),
  replyToTicket: (id, message) => apiRequest(`/admin/tickets/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
  updateTicketStatus: (id, status) => apiRequest(`/admin/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  // Global Notifications
  getNotifications: () => apiRequest('/admin/notifications'),
  createNotification: (data) => apiRequest('/admin/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteNotification: (id) => apiRequest(`/admin/notifications/${id}`, { method: 'DELETE' }),
  
  // System Settings
  getSettings: () => apiRequest('/admin/settings'),
  updateRates: (data) => apiRequest('/admin/settings/rates', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  updateConfig: (data) => apiRequest('/admin/settings/config', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

// Auth API
export const authAPI = {
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/auth/me'),
};

export default {
  goals: goalsAPI,
  consumption: consumptionAPI,
  meters: metersAPI,
  reports: reportsAPI,
  analytics: analyticsAPI,
  admin: adminAPI,
  auth: authAPI,
};
