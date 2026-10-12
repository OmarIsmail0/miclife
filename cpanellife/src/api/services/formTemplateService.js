/**
 * Form Service
 * Handles all form-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const formTemplateService = {
  /**
   * Get all forms with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 1000 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.FORMTEMPLATE.GET_ALL, params);
    return response.data;
  },

  /**
   * Get form by ID
   * @param {number} id - Form ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.FORMTEMPLATE.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new form
   * @param {Object} data - Form data
   * @param {string} data.name - Form name
   * @param {string} data.design - Form design (JSON string)
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.FORMTEMPLATE.CREATE, data);
    return response.data;
  },

  /**
   * Update form
   * @param {Object} data - Form data with ID
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.FORMTEMPLATE.UPDATE, data);
    return response.data;
  },

  /**
   * Delete form
   * @param {number} id - Form ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.FORMTEMPLATE.DELETE(id));
    return response.data;
  },
};

export default formTemplateService;
