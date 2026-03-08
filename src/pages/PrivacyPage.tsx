import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const APP_URL = import.meta.env.VITE_APP_URL || 'https://uktradeapps.co.uk'

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | UKTradeApps</title>
        <meta name="description" content="Privacy policy for UKTradeApps. How we collect, use, and protect your data. GDPR compliant." />
        <link rel="canonical" href={`${APP_URL}/privacy`} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <a href="#main-content" className="skip-nav">Skip to main content</a>

      <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur-sm">
        <nav className="container-app flex h-16 items-center justify-between" aria-label="Main navigation">
          <Link to="/" className="font-display text-xl font-bold text-brand-700">
            UK<span className="text-accent-500">Trade</span>Apps
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/quiz" className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 sm:block">Find My Stack</Link>
            <Link to="/submit" className="btn-primary text-sm">List Your App</Link>
          </div>
        </nav>
      </header>

      <main id="main-content" className="section-spacing bg-surface-50">
        <div className="container-app">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-3xl font-extrabold text-surface-900 sm:text-4xl">Privacy Policy</h1>
            <p className="mt-2 text-sm text-surface-500">Last updated: 5 March 2026</p>

            <div className="mt-8 space-y-8 text-surface-700 leading-relaxed">
              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">1. Who we are</h2>
                <p className="mt-3">
                  UKTradeApps is operated by Autaimate, a UK-based business. Our website is uktradeapps.co.uk.
                  When we refer to {'"'}we{'"'}, {'"'}us{'"'}, or {'"'}our{'"'} in this policy, we mean Autaimate
                  trading as UKTradeApps.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">2. What data we collect</h2>
                <p className="mt-3">We collect the following types of data:</p>
                <p className="mt-3">
                  <span className="font-semibold text-surface-900">Newsletter subscribers:</span> email address,
                  trade preference (optional), and signup source.
                </p>
                <p className="mt-3">
                  <span className="font-semibold text-surface-900">Quiz results:</span> trade, team size, budget,
                  pain points, email (optional), and recommended listings. No personally identifiable information
                  is required to use the quiz.
                </p>
                <p className="mt-3">
                  <span className="font-semibold text-surface-900">Vendor submissions:</span> app name, website URL,
                  contact name, contact email, trade categories, description, and pricing information.
                </p>
                <p className="mt-3">
                  <span className="font-semibold text-surface-900">Analytics:</span> anonymised usage data via
                  Google Analytics 4, including pages visited, quiz completion rates, and quote builder usage.
                  We do not track personally identifiable information through analytics.
                </p>
                <p className="mt-3">
                  <span className="font-semibold text-surface-900">Error tracking:</span> anonymised error reports
                  via Sentry to help us fix bugs. These never contain personal data.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">3. How we use your data</h2>
                <p className="mt-3">We use your data to:</p>
                <p className="mt-3">
                  Send you our weekly newsletter if you subscribed. Provide personalised software recommendations
                  through our quiz. Review and process vendor app submissions. Improve our website and tools based
                  on anonymised usage patterns. Fix bugs and technical issues.
                </p>
                <p className="mt-3">
                  We never sell your data to third parties. We never share your email address with software vendors
                  or advertisers without your explicit consent.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">4. Legal basis for processing</h2>
                <p className="mt-3">
                  Under the UK General Data Protection Regulation (UK GDPR), our legal basis for processing your
                  data is: consent (newsletter signups), legitimate interest (improving our service, analytics),
                  and contractual necessity (processing vendor submissions).
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">5. How we store and protect your data</h2>
                <p className="mt-3">
                  Your data is stored in Neon PostgreSQL databases hosted in AWS eu-west-2 (London). All data is
                  encrypted in transit via TLS and at rest. Our API runs on Cloudflare Workers with enterprise-grade
                  security. Authentication is handled by Clerk with industry-standard encryption.
                </p>
                <p className="mt-3">
                  We retain newsletter subscriber data until you unsubscribe. Quiz results are retained for 24 months
                  for analytics purposes, then automatically deleted. Vendor submission data is retained for the
                  duration of the listing relationship.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">6. Cookies</h2>
                <p className="mt-3">
                  We use essential cookies for authentication (Clerk) and analytics cookies (Google Analytics 4).
                  Analytics cookies are anonymised and do not track personally identifiable information. You can
                  disable cookies in your browser settings, though this may affect site functionality.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">7. Affiliate links</h2>
                <p className="mt-3">
                  Some pages on our site contain affiliate links to software products we review. If you sign up
                  for a product through an affiliate link, we may earn a commission at no additional cost to you.
                  Affiliate relationships never influence our reviews, recommendations, or quiz results. All
                  affiliate content is clearly disclosed.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">8. Your rights</h2>
                <p className="mt-3">Under UK GDPR, you have the right to:</p>
                <p className="mt-3">
                  Access your personal data. Correct inaccurate data. Delete your data ({'"'}right to be forgotten{'"'}).
                  Restrict processing. Data portability. Object to processing. Withdraw consent at any time.
                </p>
                <p className="mt-3">
                  To exercise any of these rights, contact us at privacy@autaimate.com. We will respond within
                  30 days.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">9. Third-party services</h2>
                <p className="mt-3">We use the following third-party services that may process your data:</p>
                <p className="mt-3">
                  <span className="font-semibold text-surface-900">Clerk</span> (authentication),{' '}
                  <span className="font-semibold text-surface-900">Neon</span> (database),{' '}
                  <span className="font-semibold text-surface-900">Cloudflare</span> (hosting and CDN),{' '}
                  <span className="font-semibold text-surface-900">Google Analytics</span> (anonymised analytics),{' '}
                  <span className="font-semibold text-surface-900">Sentry</span> (error tracking).
                  Each provider has their own privacy policy and processes data in accordance with GDPR.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">10. Changes to this policy</h2>
                <p className="mt-3">
                  We may update this policy from time to time. Any changes will be posted on this page with an
                  updated {'"'}last updated{'"'} date. If we make significant changes, we will notify newsletter
                  subscribers by email.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">11. Contact</h2>
                <p className="mt-3">
                  For any privacy-related questions or to exercise your data rights, contact us at
                  privacy@autaimate.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-surface-200 bg-white py-10">
        <div className="container-app text-center text-xs text-surface-400">
          {'\u00a9'} {new Date().getFullYear()} UKTradeApps. Built by{' '}
          <a href="https://autaimate.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-surface-600">Autaimate</a>.
          All rights reserved.
        </div>
      </footer>
    </>
  )
}
