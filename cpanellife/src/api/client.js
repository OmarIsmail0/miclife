/**
 * API Client
 * Axios instance with interceptors for authentication and error handling
 */

import axios from "axios";
import { API_CONFIG, STORAGE_KEYS } from "./config";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login or refresh token
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = "/login";
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access forbidden:", data);
          break;

        case 404:
          // Not found
          console.error("Resource not found:", data);
          break;

        case 500:
          // Server error
          console.error("Server error:", data);
          break;

        default:
          console.error("API Error:", data);
      }

      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error:", error.message);
      return Promise.reject({ message: "Network error. Please check your connection." });
    } else {
      // Something else happened
      console.error("Error:", error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default apiClient;
