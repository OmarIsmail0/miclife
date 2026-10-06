import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../lib/locales/en.json";
import ar from "../../lib/locales/ar.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ar: {
      translation: ar,
    },
  },
  lng: typeof window !== "undefined" && localStorage.getItem("language") ? localStorage.getItem("language") : "ar",
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
