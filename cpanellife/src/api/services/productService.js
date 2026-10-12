/**
 * Product Service
 * Handles all product-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const productService = {
  /**
   * Get all products with pagination
   * @param {Object} params - Query parameters
   * @param {boolean} params.IsActive - Filter by active status
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.PRODUCT.GET_ALL, params);
    return response.data;
  },

  /**
   * Get product by ID
   * @param {number} id - Product ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.PRODUCT.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Get products by LOB ID
   * @param {number} lobId - LOB ID
   * @returns {Promise}
   */
  getByLob: async (lobId) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.PRODUCT.GET_BY_LOB(lobId));
    return response.data;
  },

  /**
   * Get product by slug
   * @param {string} slug - Product slug
   * @returns {Promise}
   */
  getBySlug: async (slug) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.PRODUCT.GET_BY_SLUG(slug));
    return response.data;
  },

  /**
   * Create new product
   * @param {Object} data - Product data
   * @param {number} data.LOBId - LOB ID
   * @param {string} data.Slug - Slug
   * @param {string} data.ImageUrl - Image URL
   * @param {number} data.DisplayOrder - Display order
   * @param {boolean} data.IsActive - Active status
   * @param {Array} data.Translations - Translations array
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.PRODUCT.CREATE, data);
    return response.data;
  },

  /**
   * Update product
   * @param {number} id - Product ID
   * @param {Object} data - Product data
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.PRODUCT.UPDATE, data);
    return response.data;
  },

  /**
   * Delete product
   * @param {number} id - Product ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.PRODUCT.DELETE(id));
    return response.data;
  },

  /**
   * Toggle product status (active/inactive)
   * @param {number} id - Product ID
   * @param {boolean} isActive - Active status (default: true)
   * @returns {Promise}
   */
  toggleStatus: async (id, isActive = true) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.PRODUCT.TOGGLE_STATUS(id), isActive);
    return response.data;
  },
};

export default productService;
