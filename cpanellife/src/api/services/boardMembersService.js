/**
 * Board Members Service
 * Handles all board members-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const boardMembersService = {
  /**
   * Get all board members with pagination
   * @param {Object} params - Query parameters
   * @param {boolean} params.IsActive - Filter by active status
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BOARD_MEMBERS.GET_ALL, params);
    return response.data;
  },

  /**
   * Get board member by ID
   * @param {number} id - Board member ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BOARD_MEMBERS.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new board member
   * @param {Object} data - Board member data
   * @param {string} data.Name - Board member name
   * @param {string} data.Title - Board member title
   * @param {string} data.Description - Board member description
   * @param {string} data.ImageUrl - Image URL
   * @param {string} data.IconUrl - Icon URL
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BOARD_MEMBERS.CREATE, data);
    return response.data;
  },

  /**
   * Update board member
   * @param {Object} data - Board member data
   * @param {number} data.Id - Board member ID
   * @param {string} data.Name - Board member name
   * @param {string} data.Title - Board member title
   * @param {string} data.Description - Board member description
   * @param {string} data.ImageUrl - Image URL
   * @param {string} data.IconUrl - Icon URL
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BOARD_MEMBERS.UPDATE, data);
    return response.data;
  },

  /**
   * Delete board member
   * @param {number} id - Board member ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.BOARD_MEMBERS.DELETE(id));
    return response.data;
  },
};

export default boardMembersService;
