import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Zap,
  Wrench,
  Droplets,
  ArrowRight,
  ArrowLeft,
  Shield,
  CheckCircle2,
  Users,
  PoundSterling,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Star,
  Wifi,
  WifiOff,
  type LucideIcon,
} from 'lucide-react'
import { trackQuizStart, trackQuizComplete } from '../utils/analytics'
import { captureError } from '../utils/errorTracking'

const APP_URL = import.meta.env.VITE_APP_URL || 'https://uktradeapps.co.uk'
const API_BASE = import.meta.env.VITE_API_BASE_URL

/* =========================================================================
   Types
   ========================================================================= */

interface QuizRecommendation {
  listing: {
    id: string
    name: string
    slug: string
    tagline: string
    logo_url: string | null
    price_from_monthly: string | null
    has_free_tier: boolean
    has_free_trial: boolean
    uk_pricing_gbp: boolean
    uk_compliance_verified: boolean
    offline_capable: boolean
    is_own_product: boolean
    is_featured: boolean
    is_verified: boolean
    last_verified_at: string | null
  }
  matchScore: number
  matchReasons: string[]
}

/* =========================================================================
   Constants
   ========================================================================= */

interface TradeOption {
  slug: string
  name: string
  icon: LucideIcon
  description: string
}

const TRADE_OPTIONS: TradeOption[] = [
  {
    slug: 'electricians',
    name: 'Electrician',
    icon: Zap,
    description: 'EICRs, BS 7671, scheme providers',
  },
  {
    slug: 'builders',
    name: 'Builder',
    icon: Wrench,
    description: 'Project management, snagging, CDM',
  },
  {
    slug: 'plumbers',
    name: 'Plumber',
    icon: Droplets,
    description: 'Gas Safe, CP12s, heating',
  },
]

interface TeamSizeOption {
  value: string
  label: string
  description: string
}

const TEAM_SIZE_OPTIONS: TeamSizeOption[] = [
  { value: 'sole-trader', label: 'Just me', description: 'Sole trader' },
  { value: '2-5', label: '2\u20135', description: 'Small team' },
  { value: '6-10', label: '6\u201310', description: 'Growing team' },
  { value: '11-20', label: '11\u201320', description: 'Medium firm' },
  { value: '20-plus', label: '20+', description: 'Large operation' },
]

interface BudgetOption {
  value: string
  label: string
  description: string
}

const BUDGET_OPTIONS: BudgetOption[] = [
  { value: 'free-only', label: 'Free only', description: 'No budget for software' },
  { value: 'under-25', label: 'Under \u00a325/mo', description: 'Keeping it lean' },
  { value: 'under-50', label: 'Under \u00a350/mo', description: 'Moderate spend' },
  { value: 'under-100', label: 'Under \u00a3100/mo', description: 'Willing to invest' },
  { value: 'no-limit', label: 'No limit', description: 'Best tool wins' },
]

interface PainPointOption {
  value: string
  label: string
  description: string
  trades: string[]
}

const PAIN_POINT_OPTIONS: PainPointOption[] = [
  {
    value: 'certification',
    label: 'Certification',
    description: 'Producing certs and compliance docs',
    trades: ['electricians', 'plumbers'],
  },
  {
    value: 'quoting',
    label: 'Quoting',
    description: 'Creating professional quotes fast',
    trades: ['electricians', 'builders', 'plumbers'],
  },
  {
    value: 'job-management',
    label: 'Job management',
    description: 'Tracking jobs, scheduling, dispatch',
    trades: ['electricians', 'builders', 'plumbers'],
  },
  {
    value: 'invoicing',
    label: 'Invoicing',
    description: 'Getting paid faster',
    trades: ['electricians', 'builders', 'plumbers'],
  },
  {
    value: 'scheduling',
    label: 'Scheduling',
    description: 'Booking and calendar management',
    trades: ['electricians', 'builders', 'plumbers'],
  },
  {
    value: 'compliance',
    label: 'Compliance',
    description: 'Meeting regulations and standards',
    trades: ['electricians', 'builders', 'plumbers'],
  },
  {
    value: 'health-and-safety',
    label: 'Health & Safety',
    description: 'Risk assessments, RAMS, CDM',
    trades: ['electricians', 'builders', 'plumbers'],
  },
  {
    value: 'site-diary',
    label: 'Site diary',
    description: 'Daily logs, photos, progress reports',
    trades: ['builders'],
  },
  {
    value: 'customer-management',
    label: 'Customer management',
    description: 'CRM, leads, follow-ups',
    trades: ['electricians', 'builders', 'plumbers'],
  },
]

/* =========================================================================
   Structured Data
   ========================================================================= */

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${APP_URL}/quiz/#webpage`,
      url: `${APP_URL}/quiz`,
      name: 'Find My Software Stack | Free Quiz for UK Tradespeople | UKTradeApps',
      description:
        'Answer 4 quick questions and get a personalised software recommendation for your trade business. Free, no signup required.',
      isPartOf: { '@id': `${APP_URL}/#website` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Find My Stack',
          item: `${APP_URL}/quiz`,
        },
      ],
    },
  ],
}

/* =========================================================================
   Step Components
   ========================================================================= */

function StepTrade({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (slug: string) => void
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-surface-900 sm:text-3xl">
        What trade are you in?
      </h2>
      <p className="mt-2 text-surface-600">
        We&apos;ll tailor recommendations to your specific trade.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {TRADE_OPTIONS.map((trade) => {
          const Icon = trade.icon
          const isSelected = selected === trade.slug
          return (
            <button
              key={trade.slug}
              type="button"
              onClick={() => onSelect(trade.slug)}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 px-6 py-8 text-center transition-all ${
                isSelected
                  ? 'border-brand-600 bg-brand-50 shadow-md'
                  : 'border-surface-200 bg-white hover:border-brand-300 hover:shadow-sm'
              }`}
              aria-pressed={isSelected}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                  isSelected
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-100 text-surface-600'
                }`}
              >
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-surface-900">
                  {trade.name}
                </p>
                <p className="mt-1 text-sm text-surface-500">
                  {trade.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepTeamSize({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (size: string) => void
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-surface-900 sm:text-3xl">
        How big is your team?
      </h2>
      <p className="mt-2 text-surface-600">
        This helps us recommend tools that scale to your operation.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM_SIZE_OPTIONS.map((option) => {
          const isSelected = selected === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                isSelected
                  ? 'border-brand-600 bg-brand-50 shadow-md'
                  : 'border-surface-200 bg-white hover:border-brand-300 hover:shadow-sm'
              }`}
              aria-pressed={isSelected}
            >
              <Users
                className={`h-5 w-5 flex-shrink-0 ${
                  isSelected ? 'text-brand-600' : 'text-surface-400'
                }`}
              />
              <div>
                <p className="font-display text-lg font-bold text-surface-900">
                  {option.label}
                </p>
                <p className="text-sm text-surface-500">{option.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepBudget({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (budget: string) => void
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-surface-900 sm:text-3xl">
        What&apos;s your monthly software budget?
      </h2>
      <p className="mt-2 text-surface-600">
        Per tool, not total. We&apos;ll only show options that fit.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BUDGET_OPTIONS.map((option) => {
          const isSelected = selected === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                isSelected
                  ? 'border-brand-600 bg-brand-50 shadow-md'
                  : 'border-surface-200 bg-white hover:border-brand-300 hover:shadow-sm'
              }`}
              aria-pressed={isSelected}
            >
              <PoundSterling
                className={`h-5 w-5 flex-shrink-0 ${
                  isSelected ? 'text-brand-600' : 'text-surface-400'
                }`}
              />
              <div>
                <p className="font-display text-lg font-bold text-surface-900">
                  {option.label}
                </p>
                <p className="text-sm text-surface-500">{option.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepPainPoints({
  selected,
  onToggle,
  tradeSlug,
}: {
  selected: string[]
  onToggle: (point: string) => void
  tradeSlug: string
}) {
  const filteredOptions = PAIN_POINT_OPTIONS.filter((pp) =>
    pp.trades.includes(tradeSlug),
  )

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-surface-900 sm:text-3xl">
        What are your biggest pain points?
      </h2>
      <p className="mt-2 text-surface-600">
        Select all that apply. We&apos;ll match you with tools that solve these
        problems.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {filteredOptions.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                isSelected
                  ? 'border-brand-600 bg-brand-50 shadow-md'
                  : 'border-surface-200 bg-white hover:border-brand-300 hover:shadow-sm'
              }`}
              aria-pressed={isSelected}
            >
              <div
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                  isSelected
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-surface-300 bg-white'
                }`}
              >
                {isSelected && <CheckCircle2 className="h-4 w-4" />}
              </div>
              <div>
                <p className="font-display font-bold text-surface-900">
                  {option.label}
                </p>
                <p className="text-sm text-surface-500">{option.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {selected.length === 0 && (
        <p className="mt-4 flex items-center gap-2 text-sm text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          Select at least one pain point to continue.
        </p>
      )}
    </div>
  )
}

/* =========================================================================
   Result Card
   ========================================================================= */

function ResultCard({
  recommendation,
  tradeSlug,
  rank,
}: {
  recommendation: QuizRecommendation
  tradeSlug: string
  rank: number
}) {
  const listing = recommendation.listing

  return (
    <div className="card flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {rank}
            </span>
            <h3 className="font-display text-xl font-bold text-surface-900">
              {listing.name}
            </h3>
            {listing.is_verified && (
              <span className="badge-brand">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified
              </span>
            )}
            {listing.is_own_product && (
              <span className="badge-accent">
                <Star className="mr-1 h-3 w-3" />
                Autaimate
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-surface-600 leading-relaxed">
            {listing.tagline}
          </p>
        </div>
      </div>

      {/* Match reasons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {recommendation.matchReasons.map((reason) => (
          <span
            key={reason}
            className="rounded-md bg-emerald-50 px-2.5 py-1 text-2xs font-medium text-emerald-700"
          >
            {reason}
          </span>
        ))}
      </div>

      {/* Feature tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {listing.uk_pricing_gbp && (
          <span className="flex items-center gap-1 rounded-md bg-surface-100 px-2 py-1 text-2xs font-medium text-surface-700">
            <PoundSterling className="h-3 w-3" />
            UK pricing
          </span>
        )}
        {listing.uk_compliance_verified && (
          <span className="flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-2xs font-medium text-brand-700">
            <Shield className="h-3 w-3" />
            Compliance verified
          </span>
        )}
        {listing.offline_capable ? (
          <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-2xs font-medium text-emerald-700">
            <Wifi className="h-3 w-3" />
            Works offline
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-md bg-surface-100 px-2 py-1 text-2xs font-medium text-surface-500">
            <WifiOff className="h-3 w-3" />
            Online only
          </span>
        )}
      </div>

      {/* Pricing + CTA */}
      <div className="mt-4 border-t border-surface-100 pt-4">
        <div className="flex items-end justify-between">
          <div>
            {listing.has_free_tier ? (
              <p className="font-display text-lg font-bold text-emerald-600">
                Free
              </p>
            ) : listing.price_from_monthly ? (
              <p className="font-display text-lg font-bold text-surface-900">
                {'\u00a3'}
                {Number(listing.price_from_monthly).toFixed(2)}
                <span className="text-sm font-normal text-surface-500">
                  /month
                </span>
              </p>
            ) : (
              <p className="text-sm text-surface-500">Contact for pricing</p>
            )}
            {listing.has_free_trial && !listing.has_free_tier && (
              <p className="text-2xs text-surface-500">
                Free trial available
              </p>
            )}
          </div>

          <Link
            to={`/${tradeSlug}/${listing.slug}`}
            className="btn-primary text-sm"
          >
            View details
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   QuizPage Component
   ========================================================================= */

const TOTAL_STEPS = 4

export default function QuizPage() {

  const [step, setStep] = useState(1)
  const [tradeSlug, setTradeSlug] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [budget, setBudget] = useState('')
  const [painPoints, setPainPoints] = useState<string[]>([])
  const [email, setEmail] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<
    QuizRecommendation[] | null
  >(null)

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return tradeSlug !== ''
      case 2:
        return teamSize !== ''
      case 3:
        return budget !== ''
      case 4:
        return painPoints.length > 0
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step === 1) {
      trackQuizStart(tradeSlug)
    }
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleTogglePainPoint = (point: string) => {
    setPainPoints((prev) =>
      prev.includes(point)
        ? prev.filter((p) => p !== point)
        : [...prev, point],
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/v1/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tradeSlug,
          teamSize,
          budget,
          painPoints,
          email: email.trim() || null,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        throw new Error(
          errData?.error || `Server error: ${response.status}`,
        )
      }

      const data = await response.json()
      setRecommendations(data.recommendations)
      trackQuizComplete(tradeSlug, teamSize, data.recommendations.length)
    } catch (err) {
      captureError(err, 'QuizPage.handleSubmit', {
        tradeSlug,
        teamSize,
        budget,
        painPoints,
      })
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetake = () => {
    setStep(1)
    setTradeSlug('')
    setTeamSize('')
    setBudget('')
    setPainPoints([])
    setEmail('')
    setRecommendations(null)
    setError(null)
  }

  // ---- Results view ----
  if (recommendations) {
    return (
      <>
        <Helmet>
          <title>Your Recommended Stack | UKTradeApps</title>
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
            <Link to="/submit" className="btn-primary text-sm">
              List Your App
            </Link>
          </nav>
        </header>

        <main id="main-content" className="section-spacing bg-surface-50">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <h1 className="font-display text-3xl font-extrabold text-surface-900 sm:text-4xl">
                  Your recommended stack
                </h1>
                <p className="mt-3 text-lg text-surface-600">
                  Based on your answers, here are the best tools for your
                  business.
                </p>
              </div>

              {recommendations.length === 0 ? (
                <div className="mt-12 rounded-xl border border-surface-200 bg-white px-8 py-12 text-center">
                  <p className="text-lg text-surface-600">
                    No exact matches found for your criteria.
                  </p>
                  <p className="mt-2 text-surface-500">
                    Try broadening your budget or selecting different pain
                    points.
                  </p>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="btn-primary mt-6"
                  >
                    Retake quiz
                  </button>
                </div>
              ) : (
                <div className="mt-10 space-y-6">
                  {recommendations.map((rec, index) => (
                    <ResultCard
                      key={rec.listing.id}
                      recommendation={rec}
                      tradeSlug={tradeSlug}
                      rank={index + 1}
                    />
                  ))}
                </div>
              )}

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="btn-secondary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retake quiz
                </button>
                <Link to={`/${tradeSlug}`} className="btn-primary">
                  Browse all {tradeSlug} apps
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

  // ---- Quiz form view ----
  return (
    <>
      <Helmet>
        <title>
          Find My Software Stack | Free Quiz for UK Tradespeople |
          UKTradeApps
        </title>
        <meta
          name="description"
          content="Answer 4 quick questions and get a personalised software recommendation for your trade business. Free, no signup required."
        />
        <link rel="canonical" href={`${APP_URL}/quiz`} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        <meta
          property="og:title"
          content="Find My Software Stack | UKTradeApps"
        />
        <meta
          property="og:description"
          content="Answer 4 quick questions and get a personalised software recommendation for your trade business."
        />
        <meta
          property="og:image"
          content={`${APP_URL}/og-uktradeapps.jpg`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${APP_URL}/quiz`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Find My Software Stack | UKTradeApps"
        />
        <meta
          name="twitter:description"
          content="Answer 4 quick questions and get a personalised software recommendation."
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
            <Link to="/submit" className="btn-primary text-sm">
              List Your App
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
              Find your perfect{' '}
              <span className="text-accent-400">software stack</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-surface-300">
              Answer 4 quick questions. Get personalised recommendations
              matched to your trade, team size, budget, and biggest challenges.
            </p>
          </div>
        </section>

        {/* Progress bar */}
        <div className="border-b border-surface-200 bg-white">
          <div className="container-app py-4">
            <div className="flex items-center justify-between text-sm text-surface-500">
              <span>
                Step {step} of {TOTAL_STEPS}
              </span>
              <span>{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-100">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quiz steps */}
        <section className="section-spacing bg-surface-50">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              {step === 1 && (
                <StepTrade selected={tradeSlug} onSelect={setTradeSlug} />
              )}
              {step === 2 && (
                <StepTeamSize selected={teamSize} onSelect={setTeamSize} />
              )}
              {step === 3 && (
                <StepBudget selected={budget} onSelect={setBudget} />
              )}
              {step === 4 && (
                <StepPainPoints
                  selected={painPoints}
                  onToggle={handleTogglePainPoint}
                  tradeSlug={tradeSlug}
                />
              )}

              {/* Email capture (shown on step 4) */}
              {step === 4 && painPoints.length > 0 && (
                <div className="mt-8 rounded-xl border border-surface-200 bg-white px-6 py-5">
                  <label
                    htmlFor="quiz-email"
                    className="block font-display text-sm font-bold text-surface-900"
                  >
                    Get results by email{' '}
                    <span className="font-normal text-surface-400">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="quiz-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-2 w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    autoComplete="email"
                  />
                  <p className="mt-1.5 text-2xs text-surface-400">
                    We&apos;ll send your recommendations. No spam, ever.
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-10 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <Link to="/" className="btn-secondary">
                    <ArrowLeft className="h-4 w-4" />
                    Home
                  </Link>
                )}

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="btn-primary px-8 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="btn-primary px-8 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Finding your stack...
                      </>
                    ) : (
                      <>
                        Get my recommendations
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
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
