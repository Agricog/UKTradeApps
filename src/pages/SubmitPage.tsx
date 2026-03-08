import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Zap,
  Wrench,
  Droplets,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Send,
  type LucideIcon,
} from 'lucide-react'
import { trackSubmission } from '../utils/analytics'
import { captureError } from '../utils/errorTracking'
import { validateInput } from '../utils/validation'

const APP_URL = import.meta.env.VITE_APP_URL || 'https://uktradeapps.co.uk'
const API_BASE = import.meta.env.VITE_API_BASE_URL

/* =========================================================================
   Constants
   ========================================================================= */

interface TradeOption {
  slug: string
  name: string
  icon: LucideIcon
}

const TRADE_OPTIONS: TradeOption[] = [
  { slug: 'electricians', name: 'Electricians', icon: Zap },
  { slug: 'builders', name: 'Builders', icon: Wrench },
  { slug: 'plumbers', name: 'Plumbers', icon: Droplets },
]

/* =========================================================================
   Structured Data
   ========================================================================= */

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${APP_URL}/submit/#webpage`,
      url: `${APP_URL}/submit`,
      name: 'List Your App on UKTradeApps | Submit Your Trade Software',
      description:
        'Submit your trade software for review and listing on the UK\u2019s first trade-specific app directory. Free to list, independently reviewed.',
      isPartOf: { '@id': `${APP_URL}/#website` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'List Your App',
          item: `${APP_URL}/submit`,
        },
      ],
    },
  ],
}

/* =========================================================================
   SubmitPage Component
   ========================================================================= */

export default function SubmitPage() {
  const [appName, setAppName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [tradeSlugs, setTradeSlugs] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [pricingInfo, setPricingInfo] = useState('')

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleToggleTrade = (slug: string) => {
    setTradeSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next.tradeSlugs
      return next
    })
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (!appName.trim() || appName.trim().length < 2) {
      errors.appName = 'App name must be at least 2 characters'
    }
    if (appName.trim().length > 100) {
      errors.appName = 'App name must be under 100 characters'
    }

    const urlResult = validateInput(websiteUrl.trim(), 'url')
    if (!websiteUrl.trim()) {
      errors.websiteUrl = 'Website URL is required'
    } else if (!urlResult.isValid) {
      errors.websiteUrl = 'Enter a valid URL starting with https://'
    }

    if (!contactName.trim() || contactName.trim().length < 2) {
      errors.contactName = 'Contact name must be at least 2 characters'
    }

    const emailResult = validateInput(contactEmail.trim(), 'email')
    if (!contactEmail.trim()) {
      errors.contactEmail = 'Email address is required'
    } else if (!emailResult.isValid) {
      errors.contactEmail = 'Enter a valid email address'
    }

    if (tradeSlugs.length === 0) {
      errors.tradeSlugs = 'Select at least one trade'
    }

    if (!description.trim() || description.trim().length < 20) {
      errors.description = 'Description must be at least 20 characters'
    }
    if (description.trim().length > 2000) {
      errors.description = 'Description must be under 2000 characters'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError(null)
    trackSubmission('started')

    try {
      const response = await fetch(`${API_BASE}/api/v1/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: appName.trim(),
          websiteUrl: websiteUrl.trim(),
          contactName: contactName.trim(),
          contactEmail: contactEmail.trim().toLowerCase(),
          tradeSlugs,
          description: description.trim(),
          pricingInfo: pricingInfo.trim() || null,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        throw new Error(errData?.error || `Server error: ${response.status}`)
      }

      setIsSuccess(true)
      trackSubmission('completed')
    } catch (err) {
      captureError(err, 'SubmitPage.handleSubmit', { appName })
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ---- Success view ----
  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>Submission Received | UKTradeApps</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur-sm">
          <nav
            className="container-app flex h-16 items-center justify-between"
            aria-label="Main navigation"
          >
            <Link
              to="/"
              className="font-display text-xl font-bold text-brand-700"
            >
              UK<span className="text-accent-500">Trade</span>Apps
            </Link>
            <Link to="/quiz" className="btn-primary text-sm">
              Find My Stack
            </Link>
          </nav>
        </header>

        <main
          id="main-content"
          className="flex min-h-[60vh] items-center justify-center bg-surface-50"
        >
          <div className="container-app py-20">
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="mt-6 font-display text-3xl font-extrabold text-surface-900">
                Submission received
              </h1>
              <p className="mt-4 text-lg text-surface-600">
                Thank you for submitting{' '}
                <span className="font-semibold text-surface-900">
                  {appName}
                </span>
                . We will review your app and get back to you within 5 working
                days.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/" className="btn-secondary">
                  <ArrowLeft className="h-4 w-4" />
                  Back to home
                </Link>
                <Link to="/electricians" className="btn-primary">
                  Browse directory
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-surface-200 bg-white py-10">
          <div className="container-app text-center text-xs text-surface-400">
            {'\u00a9'} {new Date().getFullYear()} UKTradeApps. Part of the
            Autaimate portfolio. All rights reserved.
          </div>
        </footer>
      </>
    )
  }

  // ---- Form view ----
  return (
    <>
      <Helmet>
        <title>
          List Your App on UKTradeApps | Submit Your Trade Software
        </title>
        <meta
          name="description"
          content="Submit your trade software for review and listing on the UK\u2019s first trade-specific app directory. Free to list, independently reviewed."
        />
        <link rel="canonical" href={`${APP_URL}/submit`} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        <meta
          property="og:title"
          content="List Your App on UKTradeApps"
        />
        <meta
          property="og:description"
          content="Submit your trade software for review and listing on the UK\u2019s first trade-specific app directory."
        />
        <meta
          property="og:image"
          content={`${APP_URL}/og-uktradeapps.jpg`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${APP_URL}/submit`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="List Your App on UKTradeApps"
        />
        <meta
          name="twitter:description"
          content="Submit your trade software for review and listing."
        />
        <meta
          name="twitter:image"
          content={`${APP_URL}/og-uktradeapps.jpg`}
        />

        <meta name="author" content="UKTradeApps \u2014 Autaimate Portfolio" />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur-sm">
        <nav
          className="container-app flex h-16 items-center justify-between"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="font-display text-xl font-bold text-brand-700"
          >
            UK<span className="text-accent-500">Trade</span>Apps
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/electricians"
              className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 lg:block"
            >
              Electricians
            </Link>
            <Link
              to="/builders"
              className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 lg:block"
            >
              Builders
            </Link>
            <Link
              to="/plumbers"
              className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 lg:block"
            >
              Plumbers
            </Link>
            <Link
              to="/quiz"
              className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 sm:block"
            >
              Find My Stack
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(63,104,235,0.3),transparent)]" />
          <div className="container-app relative py-12 text-center sm:py-16">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              List your app on{' '}
              <span className="text-accent-400">UKTradeApps</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-surface-300">
              Get your software in front of thousands of UK tradespeople.
              Free to list, independently reviewed, no hidden fees.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="section-spacing bg-surface-50">
          <div className="container-app">
            <div className="mx-auto max-w-2xl">
              {/* What we check */}
              <div className="mb-10 rounded-xl border border-brand-200 bg-brand-50 px-6 py-5">
                <h2 className="font-display text-sm font-bold text-brand-900">
                  What happens after you submit
                </h2>
                <p className="mt-2 text-sm text-brand-700 leading-relaxed">
                  We manually review every submission against our UK compliance
                  checklist, verify pricing in GBP, test offline capability, and
                  check for UK-based support. You will hear back within 5
                  working days.
                </p>
              </div>

              {/* App name */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="app-name"
                    className="block font-display text-sm font-bold text-surface-900"
                  >
                    App name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="app-name"
                    type="text"
                    value={appName}
                    onChange={(e) => {
                      setAppName(e.target.value)
                      setFieldErrors((prev) => {
                        const next = { ...prev }
                        delete next.appName
                        return next
                      })
                    }}
                    placeholder="e.g. CertVoice"
                    maxLength={100}
                    className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      fieldErrors.appName
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-surface-300 focus:border-brand-500'
                    }`}
                    autoComplete="off"
                  />
                  {fieldErrors.appName && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.appName}
                    </p>
                  )}
                </div>

                {/* Website URL */}
                <div>
                  <label
                    htmlFor="website-url"
                    className="block font-display text-sm font-bold text-surface-900"
                  >
                    Website URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="website-url"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value)
                      setFieldErrors((prev) => {
                        const next = { ...prev }
                        delete next.websiteUrl
                        return next
                      })
                    }}
                    placeholder="https://yourapp.co.uk"
                    maxLength={500}
                    className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      fieldErrors.websiteUrl
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-surface-300 focus:border-brand-500'
                    }`}
                    autoComplete="url"
                  />
                  {fieldErrors.websiteUrl && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.websiteUrl}
                    </p>
                  )}
                </div>

                {/* Contact name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-display text-sm font-bold text-surface-900"
                  >
                    Your name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={contactName}
                    onChange={(e) => {
                      setContactName(e.target.value)
                      setFieldErrors((prev) => {
                        const next = { ...prev }
                        delete next.contactName
                        return next
                      })
                    }}
                    placeholder="e.g. John Smith"
                    maxLength={100}
                    className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      fieldErrors.contactName
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-surface-300 focus:border-brand-500'
                    }`}
                    autoComplete="name"
                  />
                  {fieldErrors.contactName && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.contactName}
                    </p>
                  )}
                </div>

                {/* Contact email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-display text-sm font-bold text-surface-900"
                  >
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => {
                      setContactEmail(e.target.value)
                      setFieldErrors((prev) => {
                        const next = { ...prev }
                        delete next.contactEmail
                        return next
                      })
                    }}
                    placeholder="you@company.co.uk"
                    maxLength={254}
                    className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      fieldErrors.contactEmail
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-surface-300 focus:border-brand-500'
                    }`}
                    autoComplete="email"
                  />
                  {fieldErrors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.contactEmail}
                    </p>
                  )}
                </div>

                {/* Trade selection */}
                <div>
                  <p className="font-display text-sm font-bold text-surface-900">
                    Which trades does your app serve?{' '}
                    <span className="text-red-500">*</span>
                  </p>
                  <p className="mt-1 text-2xs text-surface-500">
                    Select all that apply.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {TRADE_OPTIONS.map((trade) => {
                      const Icon = trade.icon
                      const isSelected = tradeSlugs.includes(trade.slug)
                      return (
                        <button
                          key={trade.slug}
                          type="button"
                          onClick={() => handleToggleTrade(trade.slug)}
                          className={`flex items-center gap-2.5 rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-brand-600 bg-brand-50 text-brand-700'
                              : 'border-surface-200 bg-white text-surface-600 hover:border-brand-300'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <Icon className="h-4 w-4" />
                          {trade.name}
                        </button>
                      )
                    })}
                  </div>
                  {fieldErrors.tradeSlugs && (
                    <p className="mt-2 text-sm text-red-600">
                      {fieldErrors.tradeSlugs}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block font-display text-sm font-bold text-surface-900"
                  >
                    Describe your app <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-1 text-2xs text-surface-500">
                    What does it do? What makes it different? Why is it good for
                    UK tradespeople? (20{'\u2013'}2000 characters)
                  </p>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      setFieldErrors((prev) => {
                        const next = { ...prev }
                        delete next.description
                        return next
                      })
                    }}
                    rows={5}
                    maxLength={2000}
                    className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      fieldErrors.description
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-surface-300 focus:border-brand-500'
                    }`}
                    placeholder="Tell us about your app and why UK tradespeople should use it..."
                  />
                  <div className="mt-1 flex justify-between">
                    {fieldErrors.description ? (
                      <p className="text-sm text-red-600">
                        {fieldErrors.description}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="text-2xs text-surface-400">
                      {description.length}/2000
                    </span>
                  </div>
                </div>

                {/* Pricing info */}
                <div>
                  <label
                    htmlFor="pricing-info"
                    className="block font-display text-sm font-bold text-surface-900"
                  >
                    Pricing information{' '}
                    <span className="font-normal text-surface-400">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="pricing-info"
                    type="text"
                    value={pricingInfo}
                    onChange={(e) => setPricingInfo(e.target.value)}
                    placeholder="e.g. Free tier available, Pro from \u00a329.99/month"
                    maxLength={500}
                    className="mt-1.5 w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    autoComplete="off"
                  />
                </div>

                {/* Error */}
                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
                    <AlertTriangle className="mr-2 inline-block h-4 w-4" />
                    {submitError}
                  </div>
                )}

                {/* Submit button */}
                <div className="flex items-center justify-between border-t border-surface-200 pt-6">
                  <Link to="/" className="btn-secondary">
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                  </Link>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-primary px-8 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit for review
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-white py-10">
        <div className="container-app text-center text-xs text-surface-400">
          {'\u00a9'} {new Date().getFullYear()} UKTradeApps. Built by{' '}<a href="https://autaimate.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-surface-600">Autaimate</a>. All rights reserved.
        </div>
      </footer>
    </>
  )
}
