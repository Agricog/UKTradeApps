import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Search, Zap, Wrench, Droplets, ArrowRight, Shield, Star } from 'lucide-react'

const APP_URL = import.meta.env.VITE_APP_URL || 'https://uktradeapps.co.uk'

const TRADE_CATEGORIES = [
  {
    name: 'Electricians',
    slug: 'electricians',
    icon: Zap,
    count: 0,
    description: 'Certification, compliance, quoting & job management tools for UK sparks.',
    available: true,
  },
  {
    name: 'Builders',
    slug: 'builders',
    icon: Wrench,
    count: 0,
    description: 'Project management, snagging, estimating & site diary tools for builders.',
    available: true,
  },
  {
    name: 'Plumbers',
    slug: 'plumbers',
    icon: Droplets,
    count: 0,
    description: 'Gas Safe compliance, quoting, scheduling & invoicing tools for plumbers.',
    available: true,
  },
] as const

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'UKTradeApps',
      url: APP_URL,
      description:
        'The UK\'s only trade-specific software directory. Find, compare, and choose the best apps for your trade.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${APP_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      name: 'UKTradeApps',
      url: APP_URL,
      description:
        'Built by tradespeople, for tradespeople. The UK\'s trusted app directory for electricians, plumbers, builders, and more.',
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>UKTradeApps — Find the Right Software for Your Trade | UK Directory</title>
        <meta
          name="description"
          content="The UK's only trade-specific app directory. Find, compare, and choose the best software tools for electricians, plumbers, builders, and more. Free quiz finds your perfect stack."
        />
        <link rel="canonical" href={APP_URL} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="UKTradeApps — Find the Right Software for Your Trade" />
        <meta property="og:description" content="The UK's only trade-specific app directory. Free quiz finds your perfect software stack in minutes." />
        <meta property="og:url" content={APP_URL} />
        <meta property="og:site_name" content="UKTradeApps" />
        <meta property="og:locale" content="en_GB" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UKTradeApps — UK Trade Software Directory" />
        <meta name="twitter:description" content="Find the best software tools for your trade. Built by tradespeople, for tradespeople." />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(STRUCTURED_DATA)}
        </script>
      </Helmet>

      {/* Skip navigation */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur-sm">
        <nav className="container-app flex h-16 items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold text-brand-700">
            UK<span className="text-accent-500">Trade</span>Apps
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/quiz"
              className="hidden text-sm font-medium text-surface-600 transition-colors hover:text-brand-600 sm:block"
            >
              Find My Stack
            </Link>
            <Link
              to="/submit"
              className="btn-primary text-sm"
            >
              List Your App
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        {/* ----------------------------------------------------------------
            Hero Section
        ----------------------------------------------------------------- */}
        <section className="relative overflow-hidden bg-brand-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(63,104,235,0.3),transparent)]" />
          <div className="container-app relative py-20 sm:py-28 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <span className="badge-accent mb-6 inline-flex text-sm">
                <Star className="mr-1.5 h-3.5 w-3.5" />
                UK&apos;s first trade-specific app directory
              </span>

              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Find the right software{' '}
                <span className="text-accent-400">for your trade</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-300 sm:text-xl">
                Stop wasting time on apps built for American offices. We curate
                UK-specific tools for electricians, plumbers, builders, and
                more&nbsp;&mdash; with real pricing in pounds.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link to="/quiz" className="btn-accent px-8 py-3 text-base">
                  <Search className="h-5 w-5" />
                  Find my perfect stack
                </Link>
                <a
                  href="#trades"
                  className="btn border-surface-600 bg-transparent px-8 py-3 text-base text-white hover:bg-surface-800"
                >
                  Browse by trade
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            Trust bar
        ----------------------------------------------------------------- */}
        <section className="border-b border-surface-200 bg-white py-6">
          <div className="container-app flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-surface-500">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-brand-600" />
              Independent &amp; unbiased reviews
            </span>
            <span className="hidden h-4 w-px bg-surface-300 sm:block" aria-hidden="true" />
            <span>UK pricing only — no USD guesswork</span>
            <span className="hidden h-4 w-px bg-surface-300 sm:block" aria-hidden="true" />
            <span>Built by tradespeople with 40+ years experience</span>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            Trade Categories
        ----------------------------------------------------------------- */}
        <section id="trades" className="section-spacing bg-surface-50">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
                Browse by trade
              </h2>
              <p className="mt-4 text-lg text-surface-600">
                Curated software picks for your specific trade &mdash; not
                generic &ldquo;small business&rdquo; lists.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TRADE_CATEGORIES.map((trade) => {
                const Icon = trade.icon
                return (
                  <Link
                    key={trade.slug}
                    to={trade.available ? `/${trade.slug}` : '#'}
                    className="card group flex flex-col"
                    aria-disabled={!trade.available}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-surface-900">
                      {trade.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-surface-600">
                      {trade.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-brand-600 transition-colors group-hover:text-brand-700">
                      View apps
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}
            </div>

            <p className="mt-10 text-center text-sm text-surface-500">
              More trades coming soon &mdash; gas engineers, roofers, landscapers, and more.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            CTA — Quiz
        ----------------------------------------------------------------- */}
        <section className="bg-brand-600 text-white section-spacing">
          <div className="container-app text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Not sure what software you need?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
              Answer 5 quick questions and we&apos;ll recommend the best tools
              for your trade, your team size, and your budget.
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
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <Link to="/" className="font-display text-lg font-bold text-brand-700">
                UK<span className="text-accent-500">Trade</span>Apps
              </Link>
              <p className="mt-1 text-sm text-surface-500">
                The UK&apos;s trade-specific software directory.
              </p>
            </div>

            <div className="flex gap-6 text-sm text-surface-600">
              <Link to="/about" className="hover:text-brand-600">About</Link>
              <Link to="/submit" className="hover:text-brand-600">List Your App</Link>
              <Link to="/privacy" className="hover:text-brand-600">Privacy</Link>
              <Link to="/terms" className="hover:text-brand-600">Terms</Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-surface-400">
            &copy; {new Date().getFullYear()} UKTradeApps. Part of the Autaimate portfolio.
          </p>
        </div>
      </footer>
    </>
  )
}
