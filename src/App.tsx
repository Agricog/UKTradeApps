import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import HomePage from './pages/HomePage'
import TradeCategoryPage from './pages/TradeCategoryPage'
import ListingPage from './pages/ListingPage'
import NotFoundPage from './pages/NotFoundPage'

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

export default function App() {
  return (
    <BrowserRouter>
      <SentryRoutes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />

        {/* Trade category pages */}
        <Route path="/:tradeSlug" element={<TradeCategoryPage />} />

        {/* Individual listing page */}
        <Route path="/:tradeSlug/:listingSlug" element={<ListingPage />} />

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
