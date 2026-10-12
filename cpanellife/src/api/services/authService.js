/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient from "../client";
import { API_CONFIG, STORAGE_KEYS } from "../config";

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.fullname - Full name
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @returns {Promise}
   */
  register: async (userData) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Email address
   * @param {string} credentials.password - Password
   * @returns {Promise}
   */
  login: async (credentials) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
  },

  /**
   * Verify 2FA code
   * @param {Object} data - 2FA verification data
   * @param {string} data.email - Email address
   * @param {string} data.code - 2FA code
   * @returns {Promise}
   */
  verify2FA: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_2FA, data);

    // Store token if verification successful
    if (response.data.token) {
      const token = response.data.token;
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    }

    return response.data;
  },

  /**
   * Get all roles
   * @returns {Promise}
   */
  getRoles: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.GET_ROLES);
    return response.data;
  },

  /**
   * Get current user ID
   * @returns {Promise}
   */
  getUserId: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.GET_USER_ID);
    return response.data;
  },

  /**
   * Assign role to user
   * @param {Object} data - Role assignment data
   * @param {string} data.UserId - User ID
   * @param {string} data.Role - Role name
   * @returns {Promise}
   */
  assignRole: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.ASSIGN_ROLE, data);
    return response.data;
  },

  /**
   * Unassign role from user
   * @param {Object} data - Role unassignment data
   * @param {string} data.UserId - User ID
   * @param {string} data.Role - Role name
   * @returns {Promise}
   */
  unassignRole: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.UNASSIGN_ROLE, data);
    return response.data;
  },

  /**
   * Get stored token from localStorage
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Get stored user data
   * @returns {Object|null}
   */
  getUserData: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },
};

export default authService;
