import axios from 'axios';

// A single configured axios instance so every API call shares the same
// base URL and error-shape handling — components just import this instead
// of repeating axios.get('http://localhost:5000/api/...') everywhere.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attaches the admin JWT (if one exists in localStorage) to every request.
// Public GET requests ignore an Authorization header they don't need, so
// this is safe to send unconditionally rather than threading auth state
// through every admin-only call site.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalizes error responses so components can always read
// error.message, whether it came from our backend's JSON error shape
// or from a network failure (server down, no internet, etc.).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
