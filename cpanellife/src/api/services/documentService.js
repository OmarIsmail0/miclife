/**
 * Document Service
 * Handles all document-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const documentService = {
  /**
   * Get all documents with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.DOCUMENT.GET_ALL, params);
    return response.data;
  },

  /**
   * Get document by ID
   * @param {number} id - Document ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DOCUMENT.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Download document
   * @param {number} id - Document ID
   * @returns {Promise}
   */
  download: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DOCUMENT.DOWNLOAD(id), {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Check if document exists
   * @param {number} id - Document ID
   * @returns {Promise}
   */
  exists: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DOCUMENT.EXISTS(id));
    return response.data;
  },

  /**
   * Get documents by tag
   * @param {string} tag - Tag name
   * @returns {Promise}
   */
  getByTag: async (tag) => {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.DOCUMENT.GET_BY_TAG}${tag}`);
    return response.data;
  },

  /**
   * Get documents by entity type
   * @param {Object} data - Entity data
   * @param {number} data.EntityType - Entity type
   * @returns {Promise}
   */
  getByEntity: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.DOCUMENT.GET_BY_ENTITY, data);
    return response.data;
  },

  /**
   * Create new document
   * @param {FormData} formData - Document form data
   * @returns {Promise}
   */
  create: async (formData) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.DOCUMENT.CREATE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Delete document
   * @param {number} id - Document ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.DOCUMENT.DELETE(id));
    return response.data;
  },

  /**
   * Soft delete document
   * @param {number} id - Document ID
   * @returns {Promise}
   */
  softDelete: async (id) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.DOCUMENT.SOFT_DELETE(id));
    return response.data;
  },

  /**
   * Search documents
   * @param {Object} params - Search parameters
   * @param {string} params.SearchTerm - Search term
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  search: async (params) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.DOCUMENT.SEARCH, params);
    return response.data;
  },
};

export default documentService;
