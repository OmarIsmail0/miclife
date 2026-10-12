// Application Constants
export const APP_CONFIG = {
  COMPANY_NAME: "Mohandes Insurance Co",
  NAME: "cPanel",
  VERSION: "1.0.0",
  TEAM: "MIC Team",
  LOCALE: "en",
  DIRECTION: "ltr",
  LOGO: import.meta.env.PROD ? "./logo.svg" : "/cp/logo.svg",
};

// Authentication Constants
export const AUTH_CONFIG = {
  LOGIN_PATH: "/cp/signin",
  HOME_PATH: "/cp",
  FILE_MANAGER: "/cp/file-manager",
  CONTENT_MANAGER: "/cp/content-manager",
  TICKET_MANAGER: "/cp/ticket-manager",
  MEDIA_MANAGER: "/cp/media-manager",
  FORM_MANAGER: "/cp/form-manager",
  QUOTATION_TEMPLATES: "/cp/quotation-templates",
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL: "Please enter a valid email address",
  PASSWORD: "Password must be at least 8 characters long",
  CONFIRM_PASSWORD: "Passwords do not match",
  USERNAME_REQUIRED: "Please input your username!",
  PASSWORD_REQUIRED: "Please input your password!",
  TWO_FACTOR_CODE_REQUIRED: "Please enter your 2FA code",
  TWO_FACTOR_CODE_INVALID: "Please enter a valid 6-digit code",
};

// API Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Please check your connection to server",
  BAD_REQUEST: "Please contact your administrator",
  UNAUTHORIZED: "Session expired. Please login again",
  FORBIDDEN: "You do not have permission to access this resource",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Internal server error. Please try again later",
  GENERIC_ERROR: "An error occurred. Please try again",
  TWO_FACTOR_INVALID: "Invalid two-factor authentication code",
};
