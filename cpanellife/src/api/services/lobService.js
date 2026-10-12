/**
 * Line of Business (LOB) Service
 * Handles all LOB-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const lobService = {
  /**
   * Get all LOBs with pagination
   * @param {Object} params - Query parameters
   * @param {boolean} params.IsActive - Filter by active status
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.LOB.GET_ALL, params);
    return response.data;
  },

  /**
   * Get LOB by ID
   * @param {number} id - LOB ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.LOB.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Get LOB by slug
   * @param {string} slug - LOB slug
   * @returns {Promise}
   */
  getBySlug: async (slug) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.LOB.GET_BY_SLUG(slug));
    return response.data;
  },

  /**
   * Create new LOB
   * @param {Object} data - LOB data
   * @param {string} data.Slug - Slug
   * @param {string} data.IconUrl - Icon URL
   * @param {boolean} data.IsActive - Active status
   * @param {number} data.DisplayOrder - Display order
   * @param {Array} data.Translations - Translations array
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.LOB.CREATE, data);
    return response.data;
  },

  /**
   * Update LOB
   * @param {Object} data - LOB data with ID
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.LOB.UPDATE, data);
    return response.data;
  },

  /**
   * Delete LOB
   * @param {number} id - LOB ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.LOB.DELETE(id));
    return response.data;
  },

  /**
   * Toggle LOB status (active/inactive)
   * @param {number} id - LOB ID
   * @param {boolean} isActive - Active status (default: true)
   * @returns {Promise}
   */
  toggleStatus: async (id, isActive = true) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.LOB.TOGGLE_STATUS(id), isActive);
    return response.data;
  },
};

export default lobService;
