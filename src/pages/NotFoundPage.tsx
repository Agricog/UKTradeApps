import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | UKTradeApps</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 px-6">
        <div className="max-w-md text-center">
          <p className="font-display text-7xl font-extrabold text-brand-600">404</p>

          <h1 className="mt-4 font-display text-2xl font-bold text-surface-900">
            Page not found
          </h1>

          <p className="mt-3 text-surface-600">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Try browsing our trade categories instead.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="btn-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <Link to="/quiz" className="btn-secondary">
              <Search className="h-4 w-4" />
              Find my stack
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
