/**
 * Section Service
 * Handles all section-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const sectionService = {
  /**
   * Get all sections with pagination
   * @param {Object} params - Query parameters
   * @param {boolean} params.IsActive - Filter by active status
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SECTION.GET_ALL, params);
    return response.data;
  },

  /**
   * Get section by ID
   * @param {number} id - Section ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SECTION.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Get section by key
   * @param {string} key - Section key
   * @returns {Promise}
   */
  getByKey: async (key) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SECTION.GET_BY_KEY(key));
    return response.data;
  },

  /**
   * Get section by slug
   * @param {string} slug - Section slug
   * @returns {Promise}
   */
  getBySlug: async (slug) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SECTION.GET_BY_SLUG(slug));
    return response.data;
  },

  /**
   * Create new section
   * @param {Object} data - Section data
   * @param {string} data.Slug - Slug
   * @param {string} data.SectionKey - Section key
   * @param {string} data.ImageUrl - Image URL
   * @param {boolean} data.IsActive - Active status
   * @param {Array} data.Translations - Translations array
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SECTION.CREATE, data);
    return response.data;
  },

  /**
   * Update section
   * @param {Object} data - Section data with ID
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SECTION.UPDATE, data);
    return response.data;
  },

  /**
   * Delete section
   * @param {number} id - Section ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SECTION.DELETE(id));
    return response.data;
  },

  /**
   * Toggle section status (active/inactive)
   * @param {number} id - Section ID
   * @param {boolean} isActive - Active status (default: true)
   * @returns {Promise}
   */
  toggleStatus: async (id, isActive = true) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.SECTION.TOGGLE_STATUS(id), isActive);
    return response.data;
  },
};

export default sectionService;
