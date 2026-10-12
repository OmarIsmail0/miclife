/**
 * Branch Service
 * Handles all branch-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const branchService = {
  /**
   * Get all branches with pagination
   * @param {Object} params - Query parameters
   * @param {boolean} params.IsActive - Filter by active status
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BRANCH.GET_ALL, params);
    return response.data;
  },

  /**
   * Get branch by ID
   * @param {number} id - Branch ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BRANCH.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new branch
   * @param {Object} data - Branch data
   * @param {string} data.Title - Branch title
   * @param {string} data.Description - Branch description
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BRANCH.CREATE, data);
    return response.data;
  },

  /**
   * Update branch
   * @param {Object} data - Branch data
   * @param {number} data.Id - Branch ID
   * @param {string} data.Title - Branch title
   * @param {string} data.Description - Branch description
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BRANCH.UPDATE, data);
    return response.data;
  },

  /**
   * Delete branch
   * @param {number} id - Branch ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BRANCH.DELETE(id));
    return response.data;
  },
};

export default branchService;
