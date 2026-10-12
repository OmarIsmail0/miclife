# MIC Life Website

Multilingual Arabic/English insurance website built with React 19, TypeScript, Vite, React Router, Tailwind CSS v4, Redux Toolkit, and i18next.

## Development

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open http://localhost:5173. Existing `NEXT_PUBLIC_*` environment names are supported by Vite. API and image URLs default to `https://mohinsservice.com/`; configure them in `.env` for your backend. The backend must allow browser requests from your development and production origins. Restart Vite after changing environment variables; production values are embedded when building.

## Build and validation

```powershell
npm run build
npm run preview
npm run lint
```

The build runs TypeScript checks and produces `dist/`. Lint also checks existing components and currently reports legacy typing, unused variable, and React hook issues.

## Structure

- `src/main.tsx`: React root, browser router, Redux and language providers.
- `src/App.tsx`: lazy-loaded routes, including dynamic insurance and director detail URLs, careers, document viewer, and fallback page.
- `src/page-components/`: existing page content.
- `src/Shared/Components/`: shared navigation, forms, modals, and layout.
- `src/lib/env.ts`: validated public environment configuration.
- `src/lib/locales/`: Arabic and English translations.
- `src/globals.css`: Tailwind and global styles.

## Deployment

Host the contents of `dist/` and serve `index.html` for client-side routes. Apache and Netlify fallback configuration is included in `public/`. Configure API and image URLs before building.

Every build includes `dist/cp/`, copied from `public/cp/`. Place the separate control-panel build (including its `index.html` and assets) in this folder when deploying to `wwwroot/cp`. The ASP.NET backend routes `/cp` to that index file; creating the folder alone does not build the control-panel app. The Apache website fallback also excludes `/cp` and its subpaths.

Metadata is updated in the browser. The React app fetches its content from the backend; server-rendered route HTML from Next.js is no longer generated. Search and social crawlers that do not execute JavaScript receive the default metadata in `index.html`.

Proprietary – © MIC Life. All rights reserved.
