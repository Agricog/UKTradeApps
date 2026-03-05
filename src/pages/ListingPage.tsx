import { Helmet } from 'react-helmet-async'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ExternalLink,
  Shield,
  CheckCircle2,
  XCircle,
  Monitor,
  Star,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import { getListingBySlug } from '../services/api'
import { captureError } from '../utils/errorTracking'
import { trackListingView, trackListingClick } from '../utils/analytics'
import type { Listing } from '../types/listing'

const APP_URL = import.meta.env.VITE_APP_URL || 'https://uktradeapps.co.uk'

function CheckItem({
  label,
  checked,
  detail,
}: {
  label: string
  checked: boolean
  detail?: string | null
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      {checked ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-surface-300" />
      )}
      <div>
        <p
          className={`text-sm font-medium ${
            checked ? 'text-surface-900' : 'text-surface-400'
          }`}
        >
          {label}
        </p>
        {detail && checked && (
          <p className="mt-0.5 text-2xs text-surface-500">{detail}</p>
        )}
      </div>
    </div>
  )
}

function buildStructuredData(listing: Listing, tradeSlug: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: listing.name,
        description: listing.description,
        url: listing.websiteUrl,
        applicationCategory: 'BusinessApplication',
        operatingSystem: listing.platforms.join(', ') || 'Web',
        offers: {
          '@type': 'Offer',
          price: listing.hasFreeTier
            ? '0'
            : listing.priceFromMonthly
              ? String(listing.priceFromMonthly)
              : undefined,
          priceCurrency: 'GBP',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: APP_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tradeSlug.charAt(0).toUpperCase() + tradeSlug.slice(1),
            item: `${APP_URL}/${tradeSlug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: listing.name,
            item: `${APP_URL}/${tradeSlug}/${listing.slug}`,
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${APP_URL}/${tradeSlug}/${listing.slug}/#webpage`,
        url: `${APP_URL}/${tradeSlug}/${listing.slug}`,
        name: `${listing.name} Review | UKTradeApps`,
        description: listing.tagline,
        isPartOf: { '@id': `${APP_URL}/#website` },
      },
    ],
  }
}

export default function ListingPage() {
  const { tradeSlug, listingSlug } = useParams<{
    tradeSlug: string
    listingSlug: string
  }>()

  const [listing, setListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!listingSlug) return

    let cancelled = false

    async function fetchListing() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getListingBySlug(listingSlug as string)
        if (!cancelled) {
          setListing(data)
          trackListingView(listingSlug as string, tradeSlug as string)
        }
      } catch (err) {
        if (!cancelled) {
          captureError(err, 'ListingPage.fetchListing', { listingSlug })
          setError('Failed to load listing. Please try again.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchListing()

    return () => {
      cancelled = true
    }
  }, [listingSlug, tradeSlug])

  if (!tradeSlug || !listingSlug) {
    return <Navigate to="/" replace />
  }

  const handleVisitWebsite = () => {
    trackListingClick(listingSlug, 'website')
  }

  const metaTitle = listing
    ? `${listing.name} \u2014 ${listing.tagline} | UKTradeApps`
    : 'Loading... | UKTradeApps'

  const metaDescription = listing
    ? `${listing.name}: ${listing.tagline}. ${listing.hasFreeTier ? 'Free to use.' : listing.priceFromMonthly ? `From \u00A3${listing.priceFromMonthly}/month.` : ''} UK pricing, independently reviewed on UKTradeApps.`
    : ''

  return (
    <>
      {listing && (
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          <link rel="canonical" href={`${APP_URL}/${tradeSlug}/${listing.slug}`} />
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:image" content={`${APP_URL}/og-uktradeapps.jpg`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content={`${APP_URL}/${tradeSlug}/${listing.slug}`} />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en_GB" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={metaDescription} />
          <meta name="twitter:image" content={`${APP_URL}/og-uktradeapps.jpg`} />

          <meta name="author" content="UKTradeApps \u2014 Autaimate Portfolio" />

          <script type="application/ld+json">
            {JSON.stringify(buildStructuredData(listing, tradeSlug))}
          </script>
        </Helmet>
      )}

      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur-sm">
        <nav className="container-app flex h-16 items-center justify-between" aria-label="Main navigation">
          <Link to="/" className="font-display text-xl font-bold text-brand-700">
            UK<span className="text-accent-500">Trade</span>Apps
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/electricians" className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 lg:block">Electricians</Link>
            <Link to="/builders" className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 lg:block">Builders</Link>
            <Link to="/plumbers" className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 lg:block">Plumbers</Link>
            <Link to="/quiz" className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 sm:block">Find My Stack</Link>
            <Link to="/submit" className="btn-primary text-sm">List Your App</Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        {isLoading && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex items-center gap-3 text-surface-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading listing...
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="container-app py-20">
            <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
              <p className="text-red-700">{error}</p>
              <Link to={`/${tradeSlug}`} className="btn-primary mt-6">
                <ArrowLeft className="h-4 w-4" />
                Back to {tradeSlug}
              </Link>
            </div>
          </div>
        )}

        {listing && !isLoading && (
          <>
            <section className="border-b border-surface-200 bg-white">
              <div className="container-app py-8 sm:py-12">
                <nav className="mb-6 flex items-center gap-2 text-sm text-surface-500" aria-label="Breadcrumb">
                  <Link to="/" className="transition-colors hover:text-brand-600">Home</Link>
                  <span aria-hidden="true">/</span>
                  <Link to={`/${tradeSlug}`} className="transition-colors hover:text-brand-600">
                    {tradeSlug.charAt(0).toUpperCase() + tradeSlug.slice(1)}
                  </Link>
                  <span aria-hidden="true">/</span>
                  <span className="text-surface-900 font-medium">{listing.name}</span>
                </nav>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="font-display text-3xl font-extrabold text-surface-900 sm:text-4xl">
                        {listing.name}
                      </h1>
                      {listing.isVerified && (
                        <span className="badge-brand">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </span>
                      )}
                      {listing.isOwnProduct && (
                        <span className="badge-accent">
                          <Star className="mr-1 h-3 w-3" />
                          Autaimate
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-lg text-surface-600 leading-relaxed">{listing.tagline}</p>
                    {listing.lastVerifiedAt && (
                      <p className="mt-2 text-2xs text-surface-400">
                        Last verified by UKTradeApps:{' '}
                        {new Date(listing.lastVerifiedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end">
                    {listing.hasFreeTier ? (
                      <p className="font-display text-3xl font-bold text-emerald-600">Free</p>
                    ) : listing.priceFromMonthly ? (
                      <div className="text-right">
                        <p className="font-display text-3xl font-bold text-surface-900">
                          {'\u00A3'}{listing.priceFromMonthly.toFixed(2)}
                          <span className="text-base font-normal text-surface-500">/month</span>
                        </p>
                        {listing.priceFromAnnual && (
                          <p className="text-sm text-surface-500">
                            {'\u00A3'}{listing.priceFromAnnual.toFixed(2)}/year
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-surface-500">Contact for pricing</p>
                    )}
                    {listing.hasFreeTrial && !listing.hasFreeTier && (
                      <span className="badge-success">Free trial available</span>
                    )}
                    <a
                      href={listing.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleVisitWebsite}
                      className="btn-primary mt-2 px-6 py-2.5"
                    >
                      Visit website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="section-spacing bg-surface-50">
              <div className="container-app">
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="card">
                      <h2 className="font-display text-xl font-bold text-surface-900">
                        About {listing.name}
                      </h2>
                      <div className="mt-4 text-surface-700 leading-relaxed whitespace-pre-line">
                        {listing.description}
                      </div>
                    </div>

                    {listing.complianceNotes && (
                      <div className="card">
                        <h2 className="font-display text-xl font-bold text-surface-900">
                          <Shield className="mr-2 inline-block h-5 w-5 text-brand-600" />
                          UK compliance details
                        </h2>
                        <div className="mt-4 text-surface-700 leading-relaxed whitespace-pre-line">
                          {listing.complianceNotes}
                        </div>
                      </div>
                    )}

                    {listing.platforms.length > 0 && (
                      <div className="card">
                        <h2 className="font-display text-xl font-bold text-surface-900">
                          <Monitor className="mr-2 inline-block h-5 w-5 text-brand-600" />
                          Platforms
                        </h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {listing.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-1.5 text-sm font-medium text-surface-700"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {listing.integrations.length > 0 && (
                      <div className="card">
                        <h2 className="font-display text-xl font-bold text-surface-900">
                          <Link className="mr-2 inline-block h-5 w-5 text-brand-600" />
                          Integrations
                        </h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {listing.integrations.map((integration) => (
                            <span
                              key={integration}
                              className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-1.5 text-sm font-medium text-surface-700"
                            >
                              {integration}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="card">
                      <h2 className="font-display text-lg font-bold text-surface-900">
                        UKTradeApps verification
                      </h2>
                      <div className="mt-2 divide-y divide-surface-100">
                        <CheckItem label="UK pricing in GBP" checked={listing.ukPricingGbp} />
                        <CheckItem label="UK compliance verified" checked={listing.ukComplianceVerified} />
                        <CheckItem label="UK customer support" checked={listing.ukSupportAvailable} detail={listing.ukSupportHours} />
                        <CheckItem label="Works offline" checked={listing.offlineCapable} />
                        <CheckItem label="VAT support" checked={listing.vatSupport} />
                      </div>
                    </div>

                    {listing.pricingNotes && (
                      <div className="card">
                        <h2 className="font-display text-lg font-bold text-surface-900">Pricing notes</h2>
                        <p className="mt-2 text-sm text-surface-600 leading-relaxed">{listing.pricingNotes}</p>
                      </div>
                    )}

                    <div className="card bg-brand-50 border-brand-200">
                      <h2 className="font-display text-lg font-bold text-brand-900">
                        Not sure if {listing.name} is right for you?
                      </h2>
                      <p className="mt-2 text-sm text-brand-700">
                        Take our free quiz and get a personalised software stack recommendation for your business.
                      </p>
                      <Link to="/quiz" className="btn-primary mt-4 w-full justify-center">
                        Find my stack
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white py-10">
              <div className="container-app text-center">
                <Link to={`/${tradeSlug}`} className="btn-secondary">
                  <ArrowLeft className="h-4 w-4" />
                  Back to all {tradeSlug} software
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-surface-200 bg-white py-12">
        <div className="container-app">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="font-display text-lg font-bold text-brand-700">
                UK<span className="text-accent-500">Trade</span>Apps
              </Link>
              <p className="mt-2 text-sm text-surface-500 leading-relaxed">
                The UK&apos;s first trade-specific software directory. Built by tradespeople with 40+ years experience.
              </p>
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-surface-900">Trades</h3>
              <nav className="mt-3 flex flex-col gap-2 text-sm text-surface-600" aria-label="Trade categories">
                <Link to="/electricians" className="hover:text-brand-600">Software for Electricians</Link>
                <Link to="/builders" className="hover:text-brand-600">Software for Builders</Link>
                <Link to="/plumbers" className="hover:text-brand-600">Software for Plumbers</Link>
              </nav>
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-surface-900">Tools</h3>
              <nav className="mt-3 flex flex-col gap-2 text-sm text-surface-600" aria-label="Tools">
                <Link to="/quiz" className="hover:text-brand-600">Find My Stack Quiz</Link>
                <Link to="/submit" className="hover:text-brand-600">List Your App</Link>
              </nav>
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-surface-900">Company</h3>
              <nav className="mt-3 flex flex-col gap-2 text-sm text-surface-600" aria-label="Company">
                <Link to="/about" className="hover:text-brand-600">About UKTradeApps</Link>
                <Link to="/privacy" className="hover:text-brand-600">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-brand-600">Terms of Use</Link>
              </nav>
            </div>
          </div>
          <div className="mt-10 border-t border-surface-200 pt-6 text-center text-xs text-surface-400">
            &copy; {new Date().getFullYear()} UKTradeApps. Part of the Autaimate portfolio. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
