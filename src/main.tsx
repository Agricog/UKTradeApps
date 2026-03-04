import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from '@sentry/react'
import App from './App'
import './index.css'

// ---------------------------------------------------------------------------
// Sentry — error tracking (production only)
// ---------------------------------------------------------------------------
const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined

if (sentryDsn && import.meta.env.PROD) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers['Authorization']
        delete event.request.headers['X-CSRF-Token']
      }
      return event
    },
  })
}

// ---------------------------------------------------------------------------
// Clerk — authentication
// ---------------------------------------------------------------------------
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

if (!clerkPubKey) {
  throw new Error(
    'Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to your .env.local file.',
  )
}

// ---------------------------------------------------------------------------
// Error fallback UI
// ---------------------------------------------------------------------------
function ErrorFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-bold text-surface-900">
          Something went wrong
        </h1>
        <p className="mt-3 text-surface-600">
          We&apos;ve been notified and are looking into it. Please try
          refreshing the page.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Refresh page
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mount
// ---------------------------------------------------------------------------
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Check index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ClerkProvider>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
