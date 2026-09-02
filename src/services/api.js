// src/services/api.js
const API_BASE = 'http://localhost:5000/api';

// Helper for headers
function getHeaders(token = null, adminKey = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (adminKey) {
    headers['x-admin-key'] = adminKey;
  }
  return headers;
}

export const api = {
  // Public
  getProducts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
    return res.json();
  },

  getProductBySlug: async (slug) => {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    return res.json();
  },

  calculateEstimate: async (data) => {
    const res = await fetch(`${API_BASE}/estimate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  submitLead: async (leadData) => {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(leadData)
    });
    return res.json();
  },

  submitContact: async (contactData) => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(contactData)
    });
    return res.json();
  },

  createBooking: async (bookingData) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
    });
    return res.json();
  },

  requestSample: async (sampleData) => {
    const res = await fetch(`${API_BASE}/samples`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sampleData)
    });
    return res.json();
  },

  // Auth
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  forgotPassword: async (email) => {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  resetPassword: async (token, password) => {
    const res = await fetch(`${API_BASE}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ password })
    });
    return res.json();
  },

  // Customer (Requires JWT)
  getCustomerProfile: async (token) => {
    const res = await fetch(`${API_BASE}/customer/profile`, {
      headers: getHeaders(token)
    });
    return res.json();
  },

  updateCustomerProfile: async (token, data) => {
    const res = await fetch(`${API_BASE}/customer/profile`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateCustomerPassword: async (token, current_password, new_password) => {
    const res = await fetch(`${API_BASE}/customer/password`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ current_password, new_password })
    });
    return res.json();
  },

  getCustomerOrders: async (token) => {
    const res = await fetch(`${API_BASE}/customer/orders`, {
      headers: getHeaders(token)
    });
    return res.json();
  },

  getCustomerConsultations: async (token) => {
    const res = await fetch(`${API_BASE}/customer/consultations`, {
      headers: getHeaders(token)
    });
    return res.json();
  },

  bookCustomerConsultation: async (token, data) => {
    const res = await fetch(`${API_BASE}/customer/consultations`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getCustomerQuotes: async (token) => {
    const res = await fetch(`${API_BASE}/customer/quotes`, {
      headers: getHeaders(token)
    });
    return res.json();
  },

  getCustomerSamples: async (token) => {
    const res = await fetch(`${API_BASE}/customer/samples`, {
      headers: getHeaders(token)
    });
    return res.json();
  },

  requestCustomerSample: async (token, data) => {
    const res = await fetch(`${API_BASE}/customer/samples`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Admin
  getAdminLeads: async (adminKey, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/leads${query ? `?${query}` : ''}`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  updateAdminLead: async (adminKey, id, data) => {
    const res = await fetch(`${API_BASE}/admin/leads/${id}`, {
      method: 'PUT',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getAdminBookings: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/bookings`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  updateAdminBooking: async (adminKey, id, data) => {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}`, {
      method: 'PUT',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getAdminQuotes: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/quotes`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  createAdminQuote: async (adminKey, quoteData) => {
    const res = await fetch(`${API_BASE}/admin/quotes`, {
      method: 'POST',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify(quoteData)
    });
    return res.json();
  },

  getAdminJobs: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/jobs`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  updateAdminJob: async (adminKey, id, data) => {
    const res = await fetch(`${API_BASE}/admin/jobs/${id}`, {
      method: 'PUT',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getAdminProducts: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  createAdminProduct: async (adminKey, productData) => {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  updateAdminProduct: async (adminKey, id, productData) => {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  toggleAdminProductStatus: async (adminKey, id, is_active) => {
    const res = await fetch(`${API_BASE}/admin/products/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify({ is_active })
    });
    return res.json();
  },

  deleteAdminProduct: async (adminKey, id) => {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  // Category Management API methods
  getAdminCategories: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  createAdminCategory: async (adminKey, categoryData) => {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify(categoryData)
    });
    return res.json();
  },

  updateAdminCategory: async (adminKey, id, categoryData) => {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify(categoryData)
    });
    return res.json();
  },

  toggleAdminCategoryStatus: async (adminKey, id, is_active) => {
    const res = await fetch(`${API_BASE}/admin/categories/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify({ is_active })
    });
    return res.json();
  },

  deleteAdminCategory: async (adminKey, id) => {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  getAdminGallery: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/gallery`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  updateAdminGallery: async (adminKey, id, data) => {
    const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
      method: 'PUT',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getAdminReports: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  getAdminSamples: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/samples`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  updateAdminSample: async (adminKey, id, data) => {
    const res = await fetch(`${API_BASE}/admin/samples/${id}`, {
      method: 'PUT',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getAdminEmailHealth: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/email-health`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  sendAdminTestEmail: async (adminKey, email) => {
    const res = await fetch(`${API_BASE}/admin/email-health/test`, {
      method: 'POST',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  // Public Customizer & Matrix Pricing
  getOptionsConfig: async () => {
    const res = await fetch(`${API_BASE}/options-config`);
    return res.json();
  },

  calculateMatrixPrice: async (data) => {
    const res = await fetch(`${API_BASE}/estimate/matrix`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Admin Matrix Pricing & Upcharges
  getAdminPricingMatrix: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/pricing-matrix`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  updateAdminPricingMatrix: async (adminKey, category, matrix) => {
    const res = await fetch(`${API_BASE}/admin/pricing-matrix/${category}`, {
      method: 'PUT',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify({ matrix })
    });
    return res.json();
  },

  getAdminOptionUpcharges: async (adminKey) => {
    const res = await fetch(`${API_BASE}/admin/option-upcharges`, {
      headers: getHeaders(null, adminKey)
    });
    return res.json();
  },

  updateAdminOptionUpcharges: async (adminKey, upcharges) => {
    const res = await fetch(`${API_BASE}/admin/option-upcharges`, {
      method: 'PUT',
      headers: getHeaders(null, adminKey),
      body: JSON.stringify({ upcharges })
    });
    return res.json();
  }
};
