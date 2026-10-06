import { configureStore } from "@reduxjs/toolkit";
import languageSlice from "../features/languageSlice";
import { mainApi } from "./api/mainApi";

export function makeStore(preloadedState?: any) {
  try {
    return configureStore({
      reducer: {
        language: languageSlice,
        [mainApi.reducerPath]: mainApi.reducer,
      },
      ...(preloadedState && { preloadedState }),
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          immutableCheck: false,
          serializableCheck: false,
        }).concat(mainApi.middleware),
    });
  } catch (error) {
    // Fallback store creation if there's an error during build
    console.warn('Store creation warning during build:', error);
    return configureStore({
      reducer: {
        language: languageSlice,
        [mainApi.reducerPath]: mainApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          immutableCheck: false,
          serializableCheck: false,
        }).concat(mainApi.middleware),
    });
  }
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
