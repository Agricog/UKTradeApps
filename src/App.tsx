import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import HomePage from './pages/HomePage'
import TradeCategoryPage from './pages/TradeCategoryPage'
import ListingPage from './pages/ListingPage'
import QuizPage from './pages/QuizPage'
import SubmitPage from './pages/SubmitPage'
import QuoteBuilderPage from './pages/QuoteBuilderPage'
import NotFoundPage from './pages/NotFoundPage'

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

export default function App() {
  return (
    <BrowserRouter>
      <SentryRoutes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />

        {/* Quiz — must be before /:tradeSlug */}
        <Route path="/quiz" element={<QuizPage />} />

        {/* Vendor submission — must be before /:tradeSlug */}
        <Route path="/submit" element={<SubmitPage />} />

        {/* Quote builder — must be before /:tradeSlug */}
        <Route path="/quote" element={<QuoteBuilderPage />} />

        {/* Trade category pages */}
        <Route path="/:tradeSlug" element={<TradeCategoryPage />} />

        {/* Individual listing page */}
        <Route path="/:tradeSlug/:listingSlug" element={<ListingPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </SentryRoutes>
    </BrowserRouter>
  )
}
