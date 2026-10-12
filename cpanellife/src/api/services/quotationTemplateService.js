/**
 * Quotation Template Service
 * Handles all quotation template-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const quotationTemplateService = {
  /**
   * Get all quotation templates with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 1000 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.QUOTATION_TEMPLATE.GET_ALL, params);
    return response.data;
  },

  /**
   * Get quotation template by ID
   * @param {number} id - Quotation template ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.QUOTATION_TEMPLATE.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new quotation template
   * @param {Object} data - Quotation template data
   * @param {string} data.Name - Template name
   * @param {number} data.FormTemplateId - Form template ID
   * @param {string} data.Type - Template type
   * @param {string} data.ReplyJson - Reply JSON (optional)
   * @param {string} data.Contact - Contact information (optional)
   * @param {string} data.Expiration - Expiration date (optional)
   * @param {boolean} data.isActive - Active status
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.QUOTATION_TEMPLATE.CREATE, data);
    return response.data;
  },

  /**
   * Update quotation template
   * @param {Object} data - Quotation template data with ID
   * @param {number} data.Id - Template ID
   * @param {string} data.Name - Template name
   * @param {number} data.FormTemplateId - Form template ID
   * @param {string} data.Type - Template type
   * @param {string} data.ReplyJson - Reply JSON (optional)
   * @param {string} data.Contact - Contact information (optional)
   * @param {boolean} data.Replied - Replied status
   * @param {string} data.Expiration - Expiration date (optional)
   * @param {boolean} data.isActive - Active status
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.QUOTATION_TEMPLATE.UPDATE, data);
    return response.data;
  },

  /**
   * Delete quotation template
   * @param {number} id - Quotation template ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.QUOTATION_TEMPLATE.DELETE(id));
    return response.data;
  },
};

export default quotationTemplateService;
