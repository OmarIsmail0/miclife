/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  // Base URL - can be changed based on environment
  BASE_URL: import.meta.env.VITE_CONFIG_URL,
  API_URL: import.meta.env.VITE_API_URL,
  // Request timeout
  TIMEOUT: 30000,

  // API endpoints structure
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/auth/register",
      LOGIN: "/auth/token",
      LOGOUT: "/auth/blacklist-token",
      VERIFY_2FA: "/auth/verifiy2FA",
      GET_ROLES: "/auth/GetRoles",
      GET_USER_ID: "/auth/GetUserId",
      ASSIGN_ROLE: "/auth/AssignRole",
      UNASSIGN_ROLE: "/auth/UnAssignRole",
    },

    DOCUMENT: {
      GET_ALL: "/document/getall",
      GET_BY_ID: (id) => `/document/${id}`,
      DOWNLOAD: (id) => `/document/download/${id}`,
      EXISTS: (id) => `/api/exists${id}`,
      GET_BY_TAG: "/document/tags/",
      GET_BY_ENTITY: "/document/entity",
      CREATE: "/document",
      DELETE: (id) => `/document/${id}`,
      SOFT_DELETE: (id) => `/Document/${id}/softdelete`,
      SEARCH: "/Document/search",
    },

    CONTENT_MANAGE: {
      LOB: {
        GET_ALL: "/ContentManage/lob/getall",
        CREATE: "/ContentManage/lob/create",
        GET_BY_ID: (id) => `/ContentManage/lob/${id}`,
        GET_BY_SLUG: (slug) => `/ContentManage/lob/slug/${slug}`,
        UPDATE: "/ContentManage/lob/update",
        DELETE: (id) => `/ContentManage/lob/${id}`,
        TOGGLE_STATUS: (id) => `/ContentManage/lob/${id}/toggle-status`,
      },
      PRODUCT: {
        GET_ALL: "/ContentManage/product/getall",
        CREATE: "/ContentManage/product/create",
        UPDATE: "/ContentManage/product/update",
        GET_BY_ID: (id) => `/ContentManage/product/${id}`,
        GET_BY_LOB: (lobId) => `/ContentManage/product/lob/${lobId}`,
        GET_BY_SLUG: (slug) => `/ContentManage/product/slug/${slug}`,
        UPDATE_BY_ID: (id) => `/ContentManage/product/update/${id}`,
        DELETE: (id) => `/ContentManage/product/${id}`,
        TOGGLE_STATUS: (id) => `/ContentManage/product/${id}/toggle-status`,
      },
      SECTION: {
        GET_ALL: "/ContentManage/section/getall",
        CREATE: "/ContentManage/section/create",
        GET_BY_ID: (id) => `/ContentManage/section/${id}`,
        GET_BY_KEY: (key) => `/ContentManage/section/key/${key}`,
        GET_BY_SLUG: (slug) => `/ContentManage/section/slug/${slug}`,
        UPDATE: "/ContentManage/section/update",
        DELETE: (id) => `/ContentManage/section/${id}`,
        TOGGLE_STATUS: (id) => `/ContentManage/section/${id}/toggle-status`,
      },
      QUESTION: {
        GET_ALL: "/ContentManage/question/getall",
        CREATE: "/ContentManage/question/create",
        GET_BY_ID: (id) => `/ContentManage/question/${id}`,
        UPDATE: "/ContentManage/question/update",
        DELETE: (id) => `/ContentManage/question/${id}`,
        TOGGLE_STATUS: (id) => `/ContentManage/question/${id}/toggle-status`,
      },
      BLOCK: {
        GET_ALL: "/ContentManage/block/getall",
        CREATE: "/ContentManage/block/create",
        GET_BY_ID: (id) => `/ContentManage/block/${id}`,
        GET_BY_SLUG: (slug) => `/ContentManage/block/slug/${slug}`,
        UPDATE: "/ContentManage/block/update",
        DELETE: (id) => `/ContentManage/block/${id}`,
        TOGGLE_STATUS: (id) => `/ContentManage/block/${id}/toggle-status`,
        ASSIGN_SECTIONS: "/ContentManage/block/assign-sections",
      },
      INVESTOR: {
        GET_ALL: "/ContentManage/innvestore/getall",
        CREATE: "/ContentManage/innvestore/create",
        UPDATE: "/ContentManage/innvestore/update",
        DELETE: (id) => `/ContentManage/innvestore/${id}`,
      },
      BRANCH: {
        GET_ALL: "/ContentManage/branch/getall",
        CREATE: "/ContentManage/branch/create",
        GET_BY_ID: (id) => `/ContentManage/branch/${id}`,
        UPDATE: "/ContentManage/branch/update",
        DELETE: (id) => `/ContentManage/branch/${id}`,
      },
      SHAREHOLDER: {
        GET_ALL: "/ContentManage/shareholder/getall",
        CREATE: "/ContentManage/shareholder/create",
        GET_BY_ID: (id) => `/ContentManage/shareholder/${id}`,
        UPDATE: "/ContentManage/shareholder/update",
        DELETE: (id) => `/ContentManage/shareholder/${id}`,
      },
      BOARD_MEMBERS: {
        GET_ALL: "/ContentManage/boardmember/getall",
        CREATE: "/ContentManage/boardmember/create",
        GET_BY_ID: (id) => `/ContentManage/boardmember/${id}`,
        UPDATE: "/ContentManage/boardmember/update",
        DELETE: (id) => `/ContentManage/boardmember/${id}`,
      },
    },

    CATALOG: {
      GET_ENTITY_TYPES: "/ContentManage/catalog/entity-types",
      GET_TICKET_STATUS: "/ContentManage/catalog/ticket-status",
      GET_TICKET_TYPE: "/ContentManage/catalog/ticket-type",
      GET_ALBUM_TYPE: "/ContentManage/catalog/media-type",
    },

    TICKET: {
      GET_ALL: "/ticketmanagement/ticket/getall",
      GET_BY_ID: (id) => `/ticketmanagement/ticket/${id}`,
      CREATE: "/ticketmanagement/ticket/create",
      UPDATE: "/ticketmanagement/ticket/update",
      DELETE: (id) => `/ticketmanagement/ticket/${id}`,
      UPDATE_STATUS: (id) => `/ticketmanagement/ticket/${id}/status`,
      GET_ACTIVITIES: (id) => `/ticketmanagement/ticket/${id}/activities`,
    },

    TICKET_ACTIVITY: {
      CREATE: "/ticketmanagement/ticket-activity/create",
      UPDATE: "/ticketmanagement/ticket-activity/update",
      DELETE: (id) => `/ticketmanagement/ticket-activity/${id}`,
    },

    ALBUM: {
      GET_ALL: "/album/getall",
      CREATE: "/album/create",
      GET_BY_ID: (id) => `/album/${id}`,
      UPDATE: "/album/update",
      DELETE: (id) => `/album/${id}`,
      UPLOAD: (id) => `/album/${id}/upload-images`,
    },

    FORMTEMPLATE: {
      GET_ALL: "/quote/form-template/getall",
      GET_BY_ID: (id) => `/quote/form-template/${id}`,
      CREATE: "/quote/form-template/create",
      UPDATE: "/quote/form-template/update",
      DELETE: (id) => `/quote/form-template/${id}`,
    },

    QUOTATION_TEMPLATE: {
      GET_ALL: "/quote/quote-template/getall",
      GET_BY_ID: (id) => `/quote/quote-template/${id}`,
      CREATE: "/quote/quote-template/create",
      UPDATE: "/quote/quote-template/update",
      DELETE: (id) => `/quote/quote-template/${id}`,
    },
  },
};

// Storage keys for localStorage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
};
