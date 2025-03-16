// Use relative URLs when in development mode
const API_BASE_URL = import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : '';

export const authAPI = {
  // In your authAPI.signup method
signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });
    return response.json();
  },

  verifyEmail: async (otp) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
      credentials: 'include'
    });
    return response.json();
  },

  // Add similar methods for other endpoints
  // forgetPassword, resetPassword, checkAuth, etc.

  // Add these methods to authAPI in api.js
checkAuth: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/check-auth`, {
      method: 'GET',
      credentials: 'include'
    });
    return response.json();
  },
  
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/forget-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include'
    });
    return response.json();
  },
  
  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
      credentials: 'include'
    });
    return response.json();
  }
};