/**
 * Catalog Service
 * Handles all catalog-related API calls
 */

import apiClient from "../client";
import { API_CONFIG } from "../config";

const catalogService = {
  /**
   * Get entity types catalog
   * @returns {Promise}
   */
  getEntityTypes: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CATALOG.GET_ENTITY_TYPES);
    return response.data;
  },

  /**
   * Get ticket status catalog
   * @returns {Promise}
   */
  getTicketStatus: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CATALOG.GET_TICKET_STATUS);
    return response.data;
  },

  /**
   * Get ticket types catalog
   * @returns {Promise}
   */
  getTicketType: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CATALOG.GET_TICKET_TYPE);
    return response.data;
  },

  /**
   * Get album types catalog
   * @returns {Promise}
   */
  getAlbumType: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CATALOG.GET_ALBUM_TYPE);
    console.log("response", response);
    return response.data;
  },
};

export default catalogService;
