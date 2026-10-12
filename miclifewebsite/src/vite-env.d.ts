/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_BASE_URL: string;
  readonly NEXT_PUBLIC_BASE_IMAGE_URL: string;
  readonly NEXT_PUBLIC_API_URL?: string;
  readonly NEXT_PUBLIC_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
