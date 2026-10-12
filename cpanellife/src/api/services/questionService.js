/**
 * Question Service (FAQ)
 * Handles all question-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const questionService = {
  /**
   * Get all questions with pagination
   * @param {Object} params - Query parameters
   * @param {boolean} params.IsActive - Filter by active status
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.QUESTION.GET_ALL, params);
    console.log(response.data);
    return response.data;
  },

  /**
   * Get question by ID
   * @param {number} id - Question ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.QUESTION.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new question
   * @param {Object} data - Question data
   * @param {string} data.QuestionText - Question text
   * @param {string} data.Answer - Answer text
   * @param {number} data.DisplayOrder - Display order
   * @param {boolean} data.IsActive - Active status
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.QUESTION.CREATE, data);
    return response.data;
  },

  /**
   * Update question
   * @param {Object} data - Question data with ID
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.QUESTION.UPDATE, data);
    return response.data;
  },

  /**
   * Delete question
   * @param {number} id - Question ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.QUESTION.DELETE(id));
    return response.data;
  },

  /**
   * Toggle question status (active/inactive)
   * @param {number} id - Question ID
   * @param {boolean} isActive - Active status (default: true)
   * @returns {Promise}
   */
  toggleStatus: async (id, isActive = true) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.CONTENT_MANAGE.QUESTION.TOGGLE_STATUS(id), isActive);
    return response.data;
  },
};

export default questionService;
