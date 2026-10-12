/**
 * Investor Service
 * Handles all investor-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const investorService = {
  /**
   * Get all investors with pagination
   * @param {Object} params - Query parameters
   * @param {boolean} params.IsActive - Filter by active status
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.INVESTOR.GET_ALL, params);
    return response.data;
  },

  /**
   * Create new investor
   * @param {Object} data - Investor data
   * @param {string} data.Title - Title
   * @param {string} data.UrlFrm - URL from
   * @param {string} data.ImageUrl - Image URL
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.INVESTOR.CREATE, data);
    return response.data;
  },

  /**
   * Update investor
   * @param {Object} data - Investor data with ID
   * @param {number} data.id - Investor ID
   * @param {string} data.Title - Title
   * @param {string} data.UrlFrm - URL from
   * @param {string} data.ImageUrl - Image URL
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.INVESTOR.UPDATE, data);
    return response.data;
  },

  /**
   * Delete investor
   * @param {number} id - Investor ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.INVESTOR.DELETE(id));
    return response.data;
  },
};

export default investorService;
