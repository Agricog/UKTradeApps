import { Helmet } from 'react-helmet-async'
import { Link, useParams, Navigate } from 'react-router-dom'
import {
  Zap,
  Wrench,
  Droplets,
  ArrowRight,
  ArrowLeft,
  Shield,
  PoundSterling,
  CheckCircle2,
  Search,
  type LucideIcon,
} from 'lucide-react'

const APP_URL = import.meta.env.VITE_APP_URL || 'https://uktradeapps.co.uk'

/* =========================================================================
   Trade Definitions
   ========================================================================= */

interface TradeConfig {
  name: string
  slug: string
  icon: LucideIcon
  tagline: string
  metaTitle: string
  metaDescription: string
  heroDescription: string
  categories: {
    name: string
    slug: string
    description: string
  }[]
  complianceHighlights: string[]
}

const TRADE_CONFIGS: Record<string, TradeConfig> = {
  electricians: {
    name: 'Electricians',
    slug: 'electricians',
    icon: Zap,
    tagline: 'Software tools built for UK electricians',
    metaTitle: 'Best Software for UK Electricians 2026 | UKTradeApps',
    metaDescription:
      'Compare the best apps for UK electricians. EICR software, BS 7671 compliance, NICEIC exports, quoting and job management tools. UK pricing, independently reviewed.',
    heroDescription:
      'Find and compare the best software tools for UK electricians. Every app verified for BS 7671 compliance, NICEIC and NAPIT scheme provider exports, and real UK pricing in pounds.',
    categories: [
      {
        name: 'Certification & Compliance',
        slug: 'certification-and-compliance',
        description:
          'Apps for producing EICRs, Minor Works Certificates, EICs and exporting to NICEIC, NAPIT and other scheme providers.',
      },
      {
        name: 'Quoting & Estimating',
        slug: 'quoting-and-estimating',
        description:
          'Tools for creating professional quotes with UK materials pricing, CIS deduction support and branded PDF output.',
      },
      {
        name: 'Job Management',
        slug: 'job-management',
        description:
          'Scheduling, dispatch, job tracking and team management tools built for electrical contractors.',
      },
      {
        name: 'Invoicing & Payments',
        slug: 'invoicing-and-payments',
        description:
          'Invoice generation, payment collection and integration with Xero, QuickBooks and FreeAgent.',
      },
      {
        name: 'Health & Safety',
        slug: 'health-and-safety',
        description:
          'Risk assessments, method statements, RAMS and CDM compliance tools for electrical work.',
      },
    ],
    complianceHighlights: [
      'BS 7671:2018+A2:2022 compliance verified',
      'NICEIC and NAPIT export support checked',
      'Part P notification features tested',
      'Appendix 6 schedule output validated',
    ],
  },
  builders: {
    name: 'Builders',
    slug: 'builders',
    icon: Wrench,
    tagline: 'Software tools built for UK builders',
    metaTitle: 'Best Software for UK Builders 2026 | UKTradeApps',
    metaDescription:
      'Compare the best apps for UK builders. Project management, snagging, estimating, site diary and health and safety tools. UK pricing, independently reviewed.',
    heroDescription:
      'Find and compare the best software tools for UK builders and general contractors. Every app verified for UK building regulations, CDM 2015 compliance, and real pricing in pounds.',
    categories: [
      {
        name: 'Project Management',
        slug: 'project-management',
        description:
          'End-to-end project tracking, Gantt charts, team coordination and client communication tools.',
      },
      {
        name: 'Snagging & Inspections',
        slug: 'snagging-and-inspections',
        description:
          'Defect logging, snagging lists, site inspection tools and AI-powered report generation.',
      },
      {
        name: 'Estimating & Takeoffs',
        slug: 'estimating-and-takeoffs',
        description:
          'Quantity takeoffs, cost estimation, materials pricing and tender preparation tools.',
      },
      {
        name: 'Site Diary',
        slug: 'site-diary',
        description:
          'Daily site logs, photo records, weather tracking, progress reports and time recording.',
      },
      {
        name: 'Health & Safety',
        slug: 'health-and-safety',
        description:
          'Risk assessments, method statements, RAMS and CDM 2015 compliance documentation.',
      },
    ],
    complianceHighlights: [
      'CDM 2015 compliance features verified',
      'UK building regulations alignment checked',
      'CIS deduction support tested',
      'CITB reporting compatibility confirmed',
    ],
  },
  plumbers: {
    name: 'Plumbers',
    slug: 'plumbers',
    icon: Droplets,
    tagline: 'Software tools built for UK plumbers',
    metaTitle: 'Best Software for UK Plumbers 2026 | UKTradeApps',
    metaDescription:
      'Compare the best apps for UK plumbers and gas engineers. Gas Safe compliance, CP12 certificates, quoting and job management. UK pricing, independently reviewed.',
    heroDescription:
      'Find and compare the best software tools for UK plumbers and gas engineers. Every app verified for Gas Safe compliance, CP12 certificate generation, and real UK pricing in pounds.',
    categories: [
      {
        name: 'Gas Safe Compliance',
        slug: 'gas-safe-compliance',
        description:
          'CP12 landlord safety certificates, Gas Safe registration management, and compliance tracking.',
      },
      {
        name: 'Quoting & Estimating',
        slug: 'quoting-and-estimating',
        description:
          'Quote builders with UK plumbing and heating materials pricing and branded PDF output.',
      },
      {
        name: 'Job Management',
        slug: 'job-management',
        description:
          'Scheduling, dispatch, job tracking and customer management for plumbing and heating firms.',
      },
      {
        name: 'Invoicing & Payments',
        slug: 'invoicing-and-payments',
        description:
          'Invoice generation, payment collection and integration with Xero, QuickBooks and FreeAgent.',
      },
    ],
    complianceHighlights: [
      'Gas Safe Register integration verified',
      'CP12 certificate generation tested',
      'Unvented hot water compliance checked',
      'Gas appliance record keeping validated',
    ],
  },
}

/* =========================================================================
   Structured Data Builder
   ========================================================================= */

function buildStructuredData(trade: TradeConfig) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${APP_URL}/${trade.slug}/#webpage`,
        url: `${APP_URL}/${trade.slug}`,
        name: trade.metaTitle,
        description: trade.metaDescription,
        isPartOf: { '@id': `${APP_URL}/#website` },
        breadcrumb: { '@id': `${APP_URL}/${trade.slug}/#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${APP_URL}/${trade.slug}/#breadcrumb`,
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
            name: trade.name,
            item: `${APP_URL}/${trade.slug}`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: `${trade.name} Software Directory`,
        description: trade.heroDescription,
        url: `${APP_URL}/${trade.slug}`,
        isPartOf: {
          '@type': 'WebSite',
          name: 'UKTradeApps',
          url: APP_URL,
        },
      },
    ],
  }
}

/* =========================================================================
   TradeCategoryPage Component
   ========================================================================= */

export default function TradeCategoryPage() {
  const { tradeSlug } = useParams<{ tradeSlug: string }>()

  const trade = tradeSlug ? TRADE_CONFIGS[tradeSlug] : undefined

  if (!trade) {
    return <Navigate to="/" replace />
  }

  const Icon = trade.icon
  const structuredData = buildStructuredData(trade)

  return (
    <>
      <Helmet>
        <title>{trade.metaTitle}</title>
        <meta name="description" content={trade.metaDescription} />
        <link rel="canonical" href={`${APP_URL}/${trade.slug}`} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        <meta property="og:title" content={trade.metaTitle} />
        <meta property="og:description" content={trade.metaDescription} />
        <meta property="og:image" content={`${APP_URL}/og-uktradeapps.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${APP_URL}/${trade.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={trade.metaTitle} />
        <meta name="twitter:description" content={trade.metaDescription} />
        <meta name="twitter:image" content={`${APP_URL}/og-uktradeapps.jpg`} />

        <meta name="author" content="UKTradeApps — Autaimate Portfolio" />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur-sm">
        <nav className="container-app flex h-16 items-center justify-between" aria-label="Main navigation">
          <Link to="/" className="font-display text-xl font-bold text-brand-700">
            UK<span className="text-accent-500">Trade</span>Apps
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/electricians"
              className={`hidden text-sm font-medium transition-colors lg:block ${
                trade.slug === 'electricians'
                  ? 'text-brand-600'
                  : 'text-surface-600 hover:text-brand-600'
              }`}
            >
              Electricians
            </Link>
            <Link
              to="/builders"
              className={`hidden text-sm font-medium transition-colors lg:block ${
                trade.slug === 'builders'
                  ? 'text-brand-600'
                  : 'text-surface-600 hover:text-brand-600'
              }`}
            >
              Builders
            </Link>
            <Link
              to="/plumbers"
              className={`hidden text-sm font-medium transition-colors lg:block ${
                trade.slug === 'plumbers'
                  ? 'text-brand-600'
                  : 'text-surface-600 hover:text-brand-600'
              }`}
            >
              Plumbers
            </Link>
            <Link
              to="/quiz"
              className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 sm:block"
            >
              Find My Stack
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
          <div className="container-app relative py-16 sm:py-20 lg:py-24">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All trades
            </Link>

            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-brand-800 text-accent-400">
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Software for{' '}
                  <span className="text-accent-400">{trade.name}</span>
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-surface-300">
                  {trade.heroDescription}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/quiz" className="btn-accent px-6 py-2.5">
                <Search className="h-4 w-4" />
                Find my {trade.name.toLowerCase()} stack
              </Link>
            </div>
          </div>
        </section>

        {/* Compliance highlights */}
        <section className="border-b border-surface-200 bg-white py-6" aria-label="Compliance checks">
          <div className="container-app flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-surface-600">
            {trade.complianceHighlights.map((highlight) => (
              <span key={highlight} className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-brand-600" />
                {highlight}
              </span>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="section-spacing bg-surface-50" aria-labelledby="categories-heading">
          <div className="container-app">
            <h2
              id="categories-heading"
              className="font-display text-2xl font-bold text-surface-900 sm:text-3xl"
            >
              Browse {trade.name.toLowerCase()} software by category
            </h2>
            <p className="mt-3 text-surface-600">
              Every app independently reviewed with UK compliance checks and
              real pricing in pounds.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trade.categories.map((category) => (
                <div key={category.slug} className="card flex flex-col">
                  <h3 className="font-display text-lg font-bold text-surface-900">
                    {category.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-surface-600 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="mt-4 rounded-lg border border-surface-200 bg-surface-50 px-4 py-3 text-center text-sm text-surface-500">
                    Listings coming soon
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we verify */}
        <section className="section-spacing bg-white" aria-labelledby="verify-heading">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              <h2
                id="verify-heading"
                className="font-display text-2xl font-bold text-surface-900 sm:text-3xl"
              >
                What we verify for every {trade.name.toLowerCase().slice(0, -1)} app
              </h2>

              <div className="mt-8 space-y-5">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                  <div>
                    <p className="font-semibold text-surface-900">UK compliance support</p>
                    <p className="text-sm text-surface-600">
                      Verified against the specific regulations and standards
                      that {trade.name.toLowerCase()} work with every day.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <PoundSterling className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                  <div>
                    <p className="font-semibold text-surface-900">UK pricing in pounds</p>
                    <p className="text-sm text-surface-600">
                      Exact monthly and annual costs in GBP including VAT. No
                      dollar pricing or hidden conversion fees.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                  <div>
                    <p className="font-semibold text-surface-900">Offline capability</p>
                    <p className="text-sm text-surface-600">
                      Tested on-site with intermittent signal. We flag whether
                      each app works offline and syncs when you are back online.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-600 text-white section-spacing">
          <div className="container-app text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Not sure which tools you need?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
              Take our free quiz and get a personalised software stack
              recommendation for your {trade.name.toLowerCase().slice(0, -1)} business
              in under two minutes.
            </p>
            <Link to="/quiz" className="btn-accent mt-8 px-8 py-3 text-base">
              Take the free quiz
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-white py-12">
        <div className="container-app">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="font-display text-lg font-bold text-brand-700">
                UK<span className="text-accent-500">Trade</span>Apps
              </Link>
              <p className="mt-2 text-sm text-surface-500 leading-relaxed">
                The UK&apos;s first trade-specific software directory. Built by
                tradespeople with 40+ years experience.
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
