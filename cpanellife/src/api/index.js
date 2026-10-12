/**
 * API Services Index
 * Central export point for all API services
 */

import authService from "./services/authService";
import documentService from "./services/documentService";
import lobService from "./services/lobService";
import productService from "./services/productService";
import sectionService from "./services/sectionService";
import questionService from "./services/questionService";
import catalogService from "./services/catalogService";
import blockService from "./services/blockService";
import investorService from "./services/investorService";
import boardMembersService from "./services/boardMembersService";
import shareholderService from "./services/shareholderService";
import branchService from "./services/branchService";
import ticketService from "./services/ticketService";
import ticketActivityService from "./services/ticketActivityService";
import albumService from "./services/albumService";
import formTemplateService from "./services/formTemplateService";
import quotationTemplateService from "./services/quotationTemplateService";
import apiClient from "./client";
import { API_CONFIG, STORAGE_KEYS } from "./config";

// Export all services
export {
  authService,
  documentService,
  lobService,
  productService,
  sectionService,
  questionService,
  catalogService,
  blockService,
  investorService,
  boardMembersService,
  shareholderService,
  branchService,
  ticketService,
  ticketActivityService,
  albumService,
  formTemplateService,
  quotationTemplateService,
  apiClient,
  API_CONFIG,
  STORAGE_KEYS,
};

// Default export with all services
export default {
  auth: authService,
  document: documentService,
  lob: lobService,
  product: productService,
  section: sectionService,
  question: questionService,
  catalog: catalogService,
  block: blockService,
  investor: investorService,
  boardMembers: boardMembersService,
  shareholder: shareholderService,
  branch: branchService,
  ticket: ticketService,
  ticketActivity: ticketActivityService,
  album: albumService,
  formTemplateService: formTemplateService,
  quotationTemplate: quotationTemplateService,
  client: apiClient,
  config: API_CONFIG,
};
