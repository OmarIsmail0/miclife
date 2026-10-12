/**
 * Ticket Activity Service
 * Handles all ticket activity-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const ticketActivityService = {
  /**
   * Create new ticket activity (comment)
   * @param {Object} data - Ticket activity data
   * @param {number} data.TicketId - Ticket ID
   * @param {string} data.TicketComment - Comment text
   * @returns {Promise}
   */
  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.TICKET_ACTIVITY.CREATE, data);
    return response.data;
  },

  /**
   * Update ticket activity
   * @param {Object} data - Ticket activity data
   * @param {number} data.Id - Activity ID
   * @param {number} data.TicketId - Ticket ID
   * @param {string} data.TicketComment - Comment text
   * @returns {Promise}
   */
  update: async (data) => {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.TICKET_ACTIVITY.UPDATE, data);
    return response.data;
  },

  /**
   * Delete ticket activity
   * @param {number} id - Activity ID
   * @returns {Promise}
   */
  delete: async (id) => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.TICKET_ACTIVITY.DELETE(id));
    return response.data;
  },
};

export default ticketActivityService;
