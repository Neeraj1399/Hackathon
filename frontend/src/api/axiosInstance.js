import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Crucial for sending cookies
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retried, and NOT a login/register request
    const isAuthRequest = originalRequest.url.includes('auth/login') || originalRequest.url.includes('auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        const res = await axios.post('http://localhost:5000/api/auth/refresh', {}, {
          withCredentials: true
        });

        if (res.data.success) {
          localStorage.setItem('token', res.data.token);
          
          // Update the original request header
          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
