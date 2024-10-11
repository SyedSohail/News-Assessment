import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add a request interceptor to inject the token into headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    // Store the token after successful login
    localStorage.setItem('token', response.data.token); // Store token in localStorage
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export default api;
