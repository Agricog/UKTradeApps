/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_GA4_MEASUREMENT_ID: string
  readonly VITE_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
