import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: "html-favicon-transform",
      transformIndexHtml(html) {
        // In production, use relative path; in development, use absolute path from public folder
        const faviconPath = mode === "production" ? "/mic.svg" : "/mic.svg";
        return html.replace(/href="\/mic\.svg"/, `href="${faviconPath}"`);
      },
    },
  ],
  base: "/cp",
}));
