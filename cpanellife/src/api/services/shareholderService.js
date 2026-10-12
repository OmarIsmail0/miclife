/**
 * Shareholder Service
 * Handles all shareholder-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const shareholderService = {
  /**
   * Get all shareholders with pagination
   * @param {Object} params - Query parameters
   * @param {boolean} params.IsActive - Filter by active status
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SHAREHOLDER.GET_ALL, params);
    return response.data;
  },

  /**
   * Get shareholder by ID
   * @param {number} id - Shareholder ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SHAREHOLDER.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new shareholder
   * @param {Object} data - Shareholder data
   * @param {string} data.Title - Shareholder title
   * @param {string} data.Description - Shareholder description
   * @param {string} data.ImageUrl - Image URL
   * @param {number} data.DisplayOrder - Display order
   * @param {string} data.Share - percentage of shares
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SHAREHOLDER.CREATE, data);
    return response.data;
  },

  /**
   * Update shareholder
   * @param {Object} data - Shareholder data
   * @param {number} data.Id - Shareholder ID
   * @param {string} data.Title - Shareholder title
   * @param {string} data.Description - Shareholder description
   * @param {string} data.ImageUrl - Image URL
   * @param {number} data.DisplayOrder - Display order
   * @param {string} data.Share - percentage of shares
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SHAREHOLDER.UPDATE, data);
    return response.data;
  },

  /**
   * Delete shareholder
   * @param {number} id - Shareholder ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SHAREHOLDER.DELETE(id));
    return response.data;
  },
};

export default shareholderService;
