import { configureStore } from "@reduxjs/toolkit";
import fileManagerReducer from "./fileManagerSlice";
import contentManagerReducer from "./contentManagerSlice";
import ticketManagerReducer from "./ticketManagerSlice";
import dashboardReducer from "./dashboardSlice";

export const store = configureStore({
  reducer: {
    fileManager: fileManagerReducer,
    contentManager: contentManagerReducer,
    ticketManager: ticketManagerReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
