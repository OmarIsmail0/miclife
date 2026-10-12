/**
 * Ticket Service
 * Handles all ticket-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const ticketService = {
  /**
   * Get all tickets with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.TicketType - Filter by ticket type (optional)
   * @param {number} params.TicketStatus - Filter by ticket status (optional)
   * @param {string} params.Email - Filter by email (optional)
   * @param {number} params.PageNumber - Page number
   * @param {number} params.PageSize - Page size
   * @returns {Promise}
   */
  getAll: async (params = { PageNumber: 1, PageSize: 10 }) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.TICKET.GET_ALL, params);
    return response.data;
  },

  /**
   * Get ticket by ID
   * @param {number} id - Ticket ID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.TICKET.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Create new ticket
   * @param {Object} data - Ticket data
   * @param {string} data.Title - Ticket title
   * @param {string} data.Description - Ticket description
   * @param {string} data.Email - Email address
   * @param {string} data.Phone - Phone number
   * @param {number} data.TicketType - Ticket type ID
   * @param {number} data.TicketStatus - Ticket status ID
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.TICKET.CREATE, data);
    return response.data;
  },

  /**
   * Update ticket
   * @param {Object} data - Ticket data with ID
   * @param {number} data.Id - Ticket ID
   * @param {string} data.Title - Ticket title
   * @param {string} data.Description - Ticket description
   * @param {string} data.Email - Email address
   * @param {string} data.Phone - Phone number
   * @param {number} data.TicketType - Ticket type ID
   * @param {number} data.TicketStatus - Ticket status ID
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.TICKET.UPDATE, data);
    return response.data;
  },

  /**
   * Delete ticket
   * @param {number} id - Ticket ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.TICKET.DELETE(id));
    return response.data;
  },

  /**
   * Update ticket status
   * @param {number} id - Ticket ID
   * @param {number} statusId - New status ID
   * @returns {Promise}
   */
  updateStatus: async (id, statusId) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.TICKET.UPDATE_STATUS(id), statusId);
    return response.data;
  },

  /**
   * Get ticket activities
   * @param {number} id - Ticket ID
   * @returns {Promise}
   */
  getActivities: async (id) => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.TICKET.GET_ACTIVITIES(id));
    return response.data;
  },
};

export default ticketService;
