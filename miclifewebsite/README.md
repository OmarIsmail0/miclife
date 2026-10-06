# MIC Life Website (Next.js)

A multilingual (AR/EN) insurance website built with Next.js (App + Pages hybrid), Tailwind CSS v4, Redux Toolkit, and i18next. The project includes product pages, life insurance flows, customer support, contact sections, and more.

## Tech Stack
- Next.js 14 (App Router + legacy Pages)
- React 18
- Tailwind CSS v4 (`@tailwindcss/postcss` plugin)
- Redux Toolkit
- i18next (react-i18next)
- Ant Design (selected components)

## Getting Started

1) Install dependencies
```bash
npm install
```

2) Run the dev server
```bash
npm run dev
```

3) Build and start
```bash
npm run build
npm start
```

The app runs on `http://localhost:3000` by default.

## Tailwind v4 Setup
Tailwind is configured via PostCSS only (no tailwind.config.js needed):
- `postcss.config.mjs`
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```
- `src/app/globals.css` includes Tailwind:
```css
@import "tailwindcss";
```

## Project Structure (high-level)
```
src/
  app/                  # Next.js app router entry
    layout.tsx
    page.tsx
    globals.css
  pages/                # Legacy pages (routes)
    HomePage.tsx
    MissionPage.tsx
    LifeInsuranceServiceDetailPage.tsx
    CustomerSupportPage.tsx
    ...
  Shared/
    Components/         # Reusable UI components
    Styles/             # CSS modules and global styles
    Constants/          # colors, language, etc.
  lib/
    locales/            # i18n translations (ar.json, en.json)
    features/           # redux slices
```

## Internationalization (i18n)
- Translations live in `src/lib/locales/en.json` and `src/lib/locales/ar.json`.
- Language and direction (ltr/rtl) are managed via Redux: `src/lib/features/languageSlice.ts`.
- Use in components:
```ts
const { t } = useTranslation();
const { language, direction } = useSelector((state: any) => state.language);
```

## Life Insurance Flow
- Card: `src/Shared/Components/LifeInsuranceServiceCard.tsx`
  - Clicking "Learn More" navigates to `/life-insurance-detail`.
  - The selected service is stored in `sessionStorage` under `lifeService` for a clean URL.
- Details: `src/pages/LifeInsuranceServiceDetailPage.tsx`
  - On mount, reads `service` from query (if present) or `sessionStorage`.
  - Redirects back to `/life-insurance` if no data is available.

## Contact and Support
- Contact section: `src/Shared/Components/ContactSection.tsx` (mobile-first with desktop background image)
- Customer Support page: `src/pages/CustomerSupportPage.tsx` (responsive layout, FAQ, CTA, resources)
- FAQ: `src/Shared/Components/FAQSection.tsx`

## Common Issues & Fixes
- Hydration errors (SSR vs Client):
  - Avoid rendering `<ul>` inside `<p>`; wrap lists in a `<div>` (fixed in `MissionPage.tsx`).
  - Do not rely on dynamic CSS variables from JS during SSR; use static styles or Tailwind classes.
  - Gate browser-only APIs with `if (typeof window !== 'undefined') { ... }`.
- Long query strings: Use `sessionStorage` or Redux instead of embedding large JSON in the URL (implemented for life insurance service details).

## Scripts
Add or adjust in `package.json` as needed:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## Styling Guidelines
- Prefer Tailwind utility classes.
- For large/conditional styles, use CSS modules under `src/Shared/Styles/`.
- Tailwind v4 uses the `@tailwindcss/postcss` plugin via PostCSS only.

## Conventions
- Components in `Shared/Components` are reusable and should be RTL-aware (`dir={direction}`) when applicable.
- Keep props minimal; prefer object props for grouped data (e.g., `service` in `LifeInsuranceServiceCard`).
- Use descriptive variable names and avoid abbreviations.

## Deployment
- Standard Next.js deployment targets (Vercel, Netlify with adapter, or custom Node server) are supported.
- Ensure environment variables and any backend API URLs are configured for production.

## License
Proprietary – © MIC Life. All rights reserved.