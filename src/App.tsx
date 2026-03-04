import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

// Sentry-wrapped Routes for automatic transaction tracking
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

export default function App() {
  return (
    <BrowserRouter>
      <SentryRoutes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />

        {/* Trade category pages (Phase 2) */}
        {/* <Route path="/electricians" element={<TradeCategoryPage />} /> */}
        {/* <Route path="/builders" element={<TradeCategoryPage />} /> */}
        {/* <Route path="/plumbers" element={<TradeCategoryPage />} /> */}

        {/* Individual listing page (Phase 3) */}
        {/* <Route path="/:trade/:slug" element={<ListingPage />} /> */}

        {/* Quiz (Phase 4) */}
        {/* <Route path="/quiz" element={<QuizPage />} /> */}

        {/* Vendor submission (Phase 5) */}
        {/* <Route path="/submit" element={<SubmitPage />} /> */}

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </SentryRoutes>
    </BrowserRouter>
  )
}
