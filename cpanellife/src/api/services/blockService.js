/**
 * Block Service
 * Handles all block-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const blockService = {
  /**
   * Get all blocks with pagination
   * @param {Object} params - Query parameters
   * @param {boolean} params.IsActive - Filter by active status
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BLOCK.GET_ALL, params);
    return response.data;
  },

  /**
   * Get block by ID
   * @param {number} id - Block ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BLOCK.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Get block by slug
   * @param {string} slug - Block slug
   * @returns {Promise}
   */
  getBySlug: async (slug) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BLOCK.GET_BY_SLUG(slug));
    return response.data;
  },

  /**
   * Create new block
   * @param {Object} data - Block data
   * @param {string} data.Slug - Slug
   * @param {string} data.ImageUrl - Image URL
   * @param {number} data.DisplayOrder - Display order
   * @param {boolean} data.IsActive - Active status
   * @param {Array} data.Translations - Translations array
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BLOCK.CREATE, data);
    return response.data;
  },

  /**
   * Update block
   * @param {Object} data - Block data with ID
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BLOCK.UPDATE, data);
    return response.data;
  },

  /**
   * Delete block
   * @param {number} id - Block ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BLOCK.DELETE(id));
    return response.data;
  },

  /**
   * Toggle block status (active/inactive)
   * @param {number} id - Block ID
   * @param {boolean} isActive - Active status
   * @returns {Promise}
   */
  toggleStatus: async (id, isActive = true) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BLOCK.TOGGLE_STATUS(id), isActive);
    return response.data;
  },

  /**
   * Assign sections to block
   * @param {Object} data - Block data
   * @param {number} data.BlockId - Block ID
   * @param {Array} data.SectionIds - Section IDs
   * @returns {Promise}
   */
  assignSections: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BLOCK.ASSIGN_SECTIONS, data);
    return response.data;
  },
};

export default blockService;
