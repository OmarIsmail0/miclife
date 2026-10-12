import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./globals.css";
import ReduxProvider from "./lib/providers/ReduxProvider";
import I18nProvider from "./lib/providers/I18nProvider";
import { LanguageProvider } from "./lib/contexts/LanguageContext";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root was not found in index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ReduxProvider>
        <LanguageProvider>
          <I18nProvider>
            <App />
          </I18nProvider>
        </LanguageProvider>
      </ReduxProvider>
    </BrowserRouter>
  </StrictMode>
);
