// src/services/api.ts
import axios from 'axios';
import { APP_CONFIG } from '@/config/constants';
import { useAuthStore } from '@/store/authStore';
import { Alert } from 'react-native';


const api = axios.create({
  baseURL: APP_CONFIG.API_URL,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const { token, expiresAt } = useAuthStore.getState();
    console.log('token', token);
    console.log('timeUntilExpiration', timeUntilExpiration(expiresAt));

    if (!token) {
      Alert.alert("Auth Error", "Token is missing. Please sign in again.");
      throw new axios.Cancel("Missing token");
    }

    if (expiresAt && Date.now() >= expiresAt) {
      const expiryDate = new Date(expiresAt).toLocaleString();
      Alert.alert("Token Expired", `Your session expired at ${expiryDate}. Please sign in again.`);
      throw new axios.Cancel("Token expired");
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(APP_CONFIG.API_URL, 'APP_CONFIG.API_URL')


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        });
      }

      isRefreshing = true;

      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        Alert.alert("Session Error", "Refresh token missing. Please sign in again.");
        useAuthStore.getState().clearToken();
        return Promise.reject(error);
      }

      try {
        console.log(APP_CONFIG.API_URL, 'APP_CONFIG.API_URL')
        const res = await axios.post(`${APP_CONFIG.API_URL}/auth/refresh`, { refreshToken });
        const { token, expiresAt, refreshToken: newRefresh } = res.data;

        useAuthStore.getState().setToken(token, expiresAt, newRefresh);
        processQueue(null, token);

        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().clearToken();
        Alert.alert("Session Expired", "Your session could not be refreshed. Please log in again.");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

function timeUntilExpiration(expiryTimestampMs) {
  const now = Date.now(); // current time in ms
  let diff = expiryTimestampMs - now;

  if (diff <= 0) {
    return "Expired";
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60) % 60;
  const hours = Math.floor(seconds / 3600) % 24;
  const days = Math.floor(seconds / (3600 * 24));

  return `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds remaining`;
}

// Example usage:
const expiry = 1751121125000;
console.log(timeUntilExpiration(expiry));


export default api;