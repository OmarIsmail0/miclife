import { createSlice } from "@reduxjs/toolkit";
import i18n from "../i18n";

const namespace = "LANGUAGE";

const initialState = {
  language: typeof window !== "undefined" 
    ? (localStorage.getItem("language") || "ar")
    : "ar",
  direction: typeof window !== "undefined"
    ? (localStorage.getItem("direction") || "rtl")
    : "rtl",
};

const languageSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    LangAr: (state) => {
      state.language = "ar";
      state.direction = "rtl";

      if (typeof window !== "undefined") {
        i18n.changeLanguage(state.language);
        localStorage.setItem("language", state.language);
        localStorage.setItem("direction", state.direction);
      }
    },
    LangEng: (state) => {
      state.language = "en";
      state.direction = "ltr";

      if (typeof window !== "undefined") {
        i18n.changeLanguage(state.language);
        localStorage.setItem("language", state.language);
        localStorage.setItem("direction", state.direction);
      }
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      state.direction = action.payload === "ar" ? "rtl" : "ltr";
      
      if (typeof window !== "undefined") {
        i18n.changeLanguage(state.language);
        localStorage.setItem("language", state.language);
        localStorage.setItem("direction", state.direction);
      }
    },
  },
});

export const { LangAr, LangEng, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
