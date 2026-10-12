/**
 * Album Service
 * Handles all album-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const albumService = {
  /**
   * Get all albums
   * @returns {Promise}
   */
  getAll: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ALBUM.GET_ALL);
    return response.data;
  },

  /**
   * Create new album
   * @param {Object} data - Album data
   * @param {number} data.DisplayOrder - Display order
   * @param {boolean} data.IsActive - Active status
   * @param {number} data.Type - Album type
   * @param {Array<Object>} data.Translations - Translations array
   * @param {string} data.Translations[].LanguageCode - Language code (e.g., "en", "ar")
   * @param {string} data.Translations[].Name - Album name in the language
   * @param {string} data.Translations[].Description - Album description in the language
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.ALBUM.CREATE, data);
    return response.data;
  },

  /**
   * Get album by ID
   * @param {number} id - Album ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ALBUM.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Update album
   * @param {Object} data - Album data
   * @param {number} data.id - Album ID
   * @param {number} data.DisplayOrder - Display order
   * @param {boolean} data.IsActive - Active status
   * @param {number} data.Type - Album type
   * @param {Array<Object>} data.Translations - Translations array
   * @param {string} data.Translations[].LanguageCode - Language code (e.g., "en", "ar")
   * @param {string} data.Translations[].Name - Album name in the language
   * @param {string} data.Translations[].Description - Album description in the language
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.ALBUM.UPDATE, data);
    return response.data;
  },

  /**
   * Delete album
   * @param {number} id - Album ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.ALBUM.DELETE(id));
    return response.data;
  },

  /**
   * Upload images to album
   * @param {number} id - Album ID
   * @param {Array<File>} files - Array of files to upload
   * @returns {Promise}
   */
  uploadImages: async (id, files) => {
    const formData = new FormData();
    // Append each file individually to support multiple file uploads
    files.forEach((file) => {
      formData.append("files", file);
    });
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.ALBUM.UPLOAD(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default albumService;
