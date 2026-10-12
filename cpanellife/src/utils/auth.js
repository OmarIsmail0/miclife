import { AUTH_CONFIG } from "../constants/config";
import { STORAGE_KEYS } from "../api/config";

/**
 * Simple authentication utility functions
 */
export class AuthService {
  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    return localStorage.getItem(AUTH_CONFIG.AUTH_STATUS_KEY) === "true";
  }

  /**
   * Get authentication token
   */
  static getToken() {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  /**
   * Set authentication data
   */
  static setAuthData(token, isAuthenticated, userData = null) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS_KEY, isAuthenticated);

    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }
  }

  /**
   * Get user data
   */
  static getUserData() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Clear all authentication data
   */
  static clearAuthData() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATUS_KEY);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Redirect to login
   */
  static redirectToLogin() {
    window.location.href = AUTH_CONFIG.LOGIN_PATH;
  }

  /**
   * Logout user
   */
  static logout() {
    this.clearAuthData();
    this.redirectToLogin();
  }
}
