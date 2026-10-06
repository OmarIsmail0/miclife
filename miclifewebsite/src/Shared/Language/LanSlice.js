import { createSlice } from "@reduxjs/toolkit";
import i18n from "../constants/i18n";
const namespace = "LANGUAGE";
const initialState = {
  language: typeof window !== "undefined" && localStorage.getItem("language") ? localStorage.getItem("language") : "ar",
  direction: typeof window !== "undefined" && localStorage.getItem("direction") ? localStorage.getItem("direction") : "rtl",
};
const LanSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    LangAr: (state) => {
      state.language = "ar";
      state.direction = "rtl";

      i18n.changeLanguage(state.language);

      if (typeof window !== "undefined") {
        localStorage.setItem("language", state.language);
        localStorage.setItem("direction", state.direction);
      }
    },
    LangEng: (state) => {
      state.language = "en";
      state.direction = "ltr";

      i18n.changeLanguage(state.language);

      if (typeof window !== "undefined") {
        localStorage.setItem("language", state.language);
        localStorage.setItem("direction", state.direction);
      }
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      state.direction = action.payload === "ar" ? "rtl" : "ltr"; // Auto-switch direction
    },
  },
});

export const { LangAr, LangEng, setLanguage } = LanSlice.actions;
export default LanSlice.reducer;
