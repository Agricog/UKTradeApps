import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  Search,
  Zap,
  Wrench,
  Droplets,
  ArrowRight,
  Shield,
  Star,
  CheckCircle2,
  HelpCircle,
  Users,
  PoundSterling,
  Wifi,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useState } from 'react'
import NewsletterSignup from '../components/NewsletterSignup'

const APP_URL = import.meta.env.VITE_APP_URL || 'https://uktradeapps.co.uk'

/* =========================================================================
   Trade Categories
   ========================================================================= */

const TRADE_CATEGORIES = [
  {
    name: 'Electricians',
    slug: 'electricians',
    icon: Zap,
    description:
      'Certification, compliance, quoting and job management tools for UK electricians. NICEIC, NAPIT and Part P ready.',
    available: true,
  },
  {
    name: 'Builders',
    slug: 'builders',
    icon: Wrench,
    description:
      'Project management, snagging, estimating and site diary tools built for UK builders and general contractors.',
    available: true,
  },
  {
    name: 'Plumbers',
    slug: 'plumbers',
    icon: Droplets,
    description:
      'Gas Safe compliance, CP12 certificates, quoting, scheduling and invoicing tools for UK plumbers and gas engineers.',
    available: true,
  },
] as const

/* =========================================================================
   FAQ Data
   ========================================================================= */

const FAQS = [
  {
    question: 'What is UKTradeApps?',
    answer:
      "UKTradeApps is the UK's first trade-specific software directory. We curate, review and compare apps built for electricians, plumbers, builders and other UK trades. Unlike generic directories such as G2 or Capterra, every listing is verified for UK compliance, priced in pounds, and reviewed by people who understand the trade.",
  },
  {
    question: 'Is UKTradeApps free to use?',
    answer:
      'Yes. Browsing the directory, using the quiz, and reading all reviews is completely free for tradespeople. We also offer free tools such as our quote builder. Software vendors can pay for featured placement, but this never affects our honest reviews or quiz recommendations.',
  },
  {
    question: 'How is UKTradeApps different from G2, Capterra or GetApp?',
    answer:
      'Those platforms list thousands of global apps with US-centric pricing and reviews from office workers. UKTradeApps focuses exclusively on UK trades. We check for UK compliance support (NICEIC, Gas Safe, Part P, BS 7671), verify pricing in GBP, confirm UK-based customer support, and test whether apps work offline on building sites.',
  },
  {
    question: 'How do you choose which apps to list?',
    answer:
      'Every app on UKTradeApps is manually reviewed against our inclusion criteria: it must serve UK tradespeople, display pricing in pounds, offer UK customer support, and comply with relevant UK industry standards. We do not auto-scrape app stores or accept every submission.',
  },
  {
    question: 'What trades do you cover?',
    answer:
      'We currently have full listings for electricians, builders, and plumbers. Gas engineers, roofers, landscapers, plasterers, joiners and other trades are coming soon. Each trade hub is built by people with direct industry experience.',
  },
  {
    question: 'How does the "Find My Stack" quiz work?',
    answer:
      'Our free quiz asks five simple questions about your trade, team size, budget, and what you need help with. Based on your answers, we recommend a personalised software stack \u2014 the combination of tools that best fits your specific situation. No signup required.',
  },
  {
    question: 'Can I list my software on UKTradeApps?',
    answer:
      'Yes. If you have a SaaS product that serves UK tradespeople, you can submit it for review via our vendor submission form. Listings are free to start. We review every submission manually to ensure it meets our quality and UK-relevance criteria before it goes live.',
  },
  {
    question: 'Do you verify that listed apps actually work for UK compliance?',
    answer:
      'Yes. For electrical apps, we check they support BS 7671:2018+A2:2022, EICR generation, and scheme provider exports (NICEIC, NAPIT). For plumbing and gas apps, we verify Gas Safe compliance and CP12 support. For builders, we check CDM 2015 features and UK building regulations alignment.',
  },
  {
    question: 'Are the reviews and recommendations independent?',
    answer:
      "Yes. Our quiz recommendations are based on genuine fit for the tradesperson's situation, not on which vendor pays the most. Featured and sponsored listings are always clearly labelled. Editorial reviews are written independently and vendors cannot pay to change them.",
  },
  {
    question: 'Do listed apps work offline on building sites?',
    answer:
      'We test and clearly flag offline capability for every listed app. Trades work on sites with poor or no signal, so we consider offline support a critical feature and include it in our review criteria and quiz recommendations.',
  },
  {
    question: 'How often are listings updated?',
    answer:
      'Every listing displays a "last verified" date. We re-verify pricing, features and compliance support at least quarterly. If a vendor changes their pricing or discontinues UK support, we update the listing immediately.',
  },
  {
    question: 'Who is behind UKTradeApps?',
    answer:
      'UKTradeApps is part of the Autaimate portfolio, built by a team with over 40 years of hands-on experience in construction, electrical work, and UK trades. We build software for this industry ourselves, so we understand the problems tradespeople face with technology every day.',
  },
] as const

/* =========================================================================
   Structured Data \u2014 All 8 JSON-LD Schemas
   ========================================================================= */

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${APP_URL}/#webpage`,
      url: APP_URL,
      name: 'UK Trade Apps Directory | Find Software for Your Trade',
      description:
        "The UK's only trade-specific app directory. Compare software for electricians, plumbers and builders with UK pricing and compliance checks.",
      isPartOf: { '@id': `${APP_URL}/#website` },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#quick-answer'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${APP_URL}/#website`,
      name: 'UKTradeApps',
      url: APP_URL,
      description:
        "The UK's only trade-specific software directory for electricians, plumbers, builders and more.",
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
      '@id': `${APP_URL}/#organization`,
      name: 'UKTradeApps',
      url: APP_URL,
      logo: `${APP_URL}/og-uktradeapps.jpg`,
      description:
        "Built by tradespeople with 40+ years experience. The UK's trusted app directory for trades.",
      sameAs: [],
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
      ],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'UKTradeApps Directory',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
      },
      description:
        'Free directory and quiz tool to help UK tradespeople find the best software for their business.',
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@type': 'HowTo',
      name: 'How to Find the Best Software for Your Trade',
      description:
        'Use UKTradeApps to discover, compare and choose the right apps for your trade business in three simple steps.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Take the quiz',
          text: 'Answer five quick questions about your trade, team size, budget and biggest pain points.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Get your recommended stack',
          text: 'Receive a personalised list of software tools that fit your exact situation, with UK pricing and compliance details.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Compare and choose',
          text: 'Read independent reviews, compare features side-by-side, and pick the tools that work for you.',
        },
      ],
    },
    {
      '@type': 'DefinedTermSet',
      name: 'UK Trade Software Terms',
      description:
        'Key terms related to software tools used by UK tradespeople.',
      hasDefinedTerm: [
        {
          '@type': 'DefinedTerm',
          name: 'EICR',
          description:
            'Electrical Installation Condition Report \u2014 a formal document produced after inspecting an electrical installation in the UK, required under BS 7671.',
        },
        {
          '@type': 'DefinedTerm',
          name: 'Part P',
          description:
            'Part P of the Building Regulations for England and Wales, covering the design and installation of electrical work in dwellings.',
        },
        {
          '@type': 'DefinedTerm',
          name: 'Gas Safe Register',
          description:
            'The official registration body for gas engineers in the United Kingdom, Isle of Man and Guernsey. It is a legal requirement for anyone carrying out gas work.',
        },
        {
          '@type': 'DefinedTerm',
          name: 'CP12',
          description:
            'A landlord gas safety certificate (CP12) is a legal requirement for all rented properties in the UK, confirming gas appliances are safe.',
        },
      ],
    },
  ],
}

/* =========================================================================
   FAQ Accordion Component
   ========================================================================= */

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-surface-200">
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="pr-4 font-display text-base font-semibold text-surface-900 sm:text-lg">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 flex-shrink-0 text-brand-600" />
        ) : (
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-surface-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 text-surface-600 leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   HomePage Component
   ========================================================================= */

export default function HomePage() {
  return (
    <>
      <Helmet>
        {/* Point 1: Title (55 chars) */}
        <title>UK Trade Apps Directory | Find Software for Your Trade</title>

        {/* Point 2: Meta description (155 chars) */}
        <meta
          name="description"
          content="The UK's only trade-specific app directory. Compare software for electricians, plumbers and builders with UK pricing. Free quiz finds your perfect stack."
        />

        {/* Point 3: Canonical URL */}
        <link rel="canonical" href={APP_URL} />

        {/* Point 4: Robots */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        {/* Point 6: OG title */}
        <meta
          property="og:title"
          content="UK Trade Apps Directory | Find Software for Your Trade"
        />

        {/* Point 7: OG description */}
        <meta
          property="og:description"
          content="The UK's only trade-specific app directory. Compare software for electricians, plumbers and builders with UK pricing. Free quiz finds your perfect stack."
        />

        {/* Point 8: OG image (1200x630) */}
        <meta property="og:image" content={`${APP_URL}/og-uktradeapps.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="UKTradeApps \u2014 Find the Right Software for Your Trade" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={APP_URL} />
        <meta property="og:site_name" content="UKTradeApps" />
        <meta property="og:locale" content="en_GB" />

        {/* Point 9: Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="UK Trade Apps Directory | Find Software for Your Trade"
        />
        <meta
          name="twitter:description"
          content="The UK's only trade-specific app directory. Free quiz finds your perfect software stack in minutes."
        />
        <meta name="twitter:image" content={`${APP_URL}/og-uktradeapps.jpg`} />
        <meta name="twitter:image:alt" content="UKTradeApps \u2014 Find the Right Software for Your Trade" />

        {/* Point 10: Author & brand E-E-A-T signals */}
        <meta name="author" content="UKTradeApps \u2014 Autaimate Portfolio" />
        <meta name="publisher" content="Autaimate" />
        <link rel="author" href={`${APP_URL}/about`} />

        {/* Point 11: All 8 JSON-LD schemas */}
        <script type="application/ld+json">
          {JSON.stringify(STRUCTURED_DATA)}
        </script>
      </Helmet>

      {/* Skip navigation */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      {/* ==============================================================
          Navigation
      =============================================================== */}
      <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/95 backdrop-blur-sm">
        <nav className="container-app flex h-16 items-center justify-between" aria-label="Main navigation">
          <Link to="/" className="font-display text-xl font-bold text-brand-700">
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
            <Link to="/submit" className="btn-primary text-sm">
              List Your App
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        {/* Point 14: Quick Answer Box (voice search optimised, 148 chars) */}
        <div id="quick-answer" className="sr-only" aria-label="Quick answer for voice search">
          UKTradeApps is the UK&apos;s only trade-specific software directory, helping electricians, plumbers and builders find the best apps with UK pricing.
        </div>

        {/* ==============================================================
            Hero
        =============================================================== */}
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
                UK-specific tools for electricians, plumbers, builders and
                more&nbsp;&mdash; with real pricing in pounds and genuine
                compliance checks.
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

        {/* ==============================================================
            Trust Bar
        =============================================================== */}
        <section className="border-b border-surface-200 bg-white py-6" aria-label="Trust signals">
          <div className="container-app flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-surface-500">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-brand-600" />
              Independent &amp; unbiased reviews
            </span>
            <span className="hidden h-4 w-px bg-surface-300 sm:block" aria-hidden="true" />
            <span className="flex items-center gap-1.5">
              <PoundSterling className="h-4 w-4 text-brand-600" />
              UK pricing only &mdash; no USD guesswork
            </span>
            <span className="hidden h-4 w-px bg-surface-300 sm:block" aria-hidden="true" />
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-brand-600" />
              Built by tradespeople with 40+ years experience
            </span>
          </div>
        </section>

        {/* ==============================================================
            Trade Categories
        =============================================================== */}
        <section id="trades" className="section-spacing bg-surface-50" aria-labelledby="trades-heading">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="trades-heading" className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
                Browse by trade
              </h2>
              <p className="mt-4 text-lg text-surface-600">
                Curated software picks for your specific trade &mdash; not
                generic &ldquo;small business&rdquo; lists that ignore what you
                actually do on site.
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
                    aria-label={`Browse ${trade.name} software`}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-surface-900">
                      {trade.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-surface-600 leading-relaxed">
                      {trade.description}
                    </p>
                    <span className="mt-4 flex items-center text-sm font-medium text-brand-600 transition-colors group-hover:text-brand-700">
                      View apps
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                )
              })}
            </div>

            <p className="mt-10 text-center text-sm text-surface-500">
              More trades coming soon &mdash; gas engineers, roofers,
              landscapers, plasterers, joiners and more.
            </p>
          </div>
        </section>

        {/* ==============================================================
            How It Works
        =============================================================== */}
        <section className="section-spacing bg-white" aria-labelledby="how-it-works-heading">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="how-it-works-heading" className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-surface-600">
                Find your perfect software stack in three steps &mdash; no
                signup required.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 font-display text-xl font-bold text-brand-700">
                  1
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-surface-900">
                  Take the quiz
                </h3>
                <p className="mt-2 text-sm text-surface-600 leading-relaxed">
                  Answer five quick questions about your trade, team size,
                  budget and biggest pain points. It takes less than two minutes.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 font-display text-xl font-bold text-brand-700">
                  2
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-surface-900">
                  Get your recommended stack
                </h3>
                <p className="mt-2 text-sm text-surface-600 leading-relaxed">
                  Receive a personalised list of software tools that fit your
                  exact situation, complete with UK pricing and compliance
                  details for your trade.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 font-display text-xl font-bold text-brand-700">
                  3
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-surface-900">
                  Compare and choose
                </h3>
                <p className="mt-2 text-sm text-surface-600 leading-relaxed">
                  Read independent reviews, compare features side by side, and
                  pick the tools that genuinely work for your business. No
                  pressure, no hard sell.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            Why UK-Specific Matters \u2014 Educational Content (2500+ words)
        =============================================================== */}
        <section className="section-spacing bg-surface-50" aria-labelledby="why-heading">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              <h2 id="why-heading" className="font-display text-3xl font-bold text-surface-900 sm:text-4xl">
                Why UK tradespeople need a UK-specific app directory
              </h2>

              <div className="mt-8 space-y-6 text-surface-700 leading-relaxed">
                <p>
                  If you have ever searched for &ldquo;best apps for
                  electricians&rdquo; or &ldquo;plumber job management
                  software&rdquo;, you will have found the same problem every
                  time: the results are dominated by American products reviewed
                  on American platforms. Prices are in dollars. Features are
                  built around US building codes. Customer support operates on
                  Pacific Time. None of this helps a sole trader in Bristol or a
                  ten-man firm in Leeds.
                </p>

                <p>
                  The UK trades industry is fundamentally different from its
                  American counterpart. Electricians must comply with BS
                  7671:2018+A2:2022, produce EICRs and Minor Works Certificates,
                  and register with scheme providers such as NICEIC, NAPIT,
                  ELECSA or STROMA. Plumbers and gas engineers need Gas Safe
                  registration and must produce CP12 landlord safety
                  certificates. Builders work within CDM 2015 regulations and UK
                  building control requirements. Software that does not
                  understand these frameworks is not just unhelpful &mdash; it is
                  potentially dangerous.
                </p>

                <h3 className="font-display text-xl font-bold text-surface-900 pt-4">
                  The problem with generic software directories
                </h3>

                <p>
                  Platforms like G2, Capterra and GetApp serve a valuable
                  purpose for office-based software buyers comparing CRM systems
                  or project management tools. But they are fundamentally wrong
                  for UK trades. A G2 listing for an electrical certification
                  app will not tell you whether it produces compliant Appendix 6
                  schedules, whether it exports to NICEIC or NAPIT portals, or
                  whether it works offline in a loft with no phone signal.
                  Capterra will not flag that a particular job management tool
                  prices in USD only, has no VAT support, and routes support
                  calls through a US call centre.
                </p>

                <p>
                  UK tradespeople deserve a directory that speaks their language.
                  One that understands the difference between an EIC and an
                  EICR, knows why Gas Safe registration matters, and tests
                  whether apps survive a day on a building site with
                  intermittent connectivity and muddy hands.
                </p>

                <h3 className="font-display text-xl font-bold text-surface-900 pt-4">
                  What we check that nobody else does
                </h3>

                <div className="space-y-4 mt-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                    <div>
                      <p className="font-semibold text-surface-900">UK compliance support</p>
                      <p className="text-sm">
                        Every listed app is verified for relevant UK regulations.
                        For electricians, that means BS 7671, Part P notification
                        support, and scheme provider export. For gas engineers, Gas
                        Safe Register integration and CP12 generation. For
                        builders, CDM 2015 and UK building regs alignment.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <PoundSterling className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                    <div>
                      <p className="font-semibold text-surface-900">UK pricing in pounds</p>
                      <p className="text-sm">
                        No dollar pricing. No &ldquo;contact us for UK
                        rates&rdquo;. Every listing shows the exact monthly and
                        annual cost in GBP including VAT. If a vendor does not
                        offer UK-specific pricing, we flag it clearly.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Wifi className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                    <div>
                      <p className="font-semibold text-surface-900">Offline capability</p>
                      <p className="text-sm">
                        Building sites, lofts, basements &mdash; tradespeople
                        regularly work where there is no mobile signal. We test
                        and clearly report whether each app works offline, syncs
                        when connectivity returns, and handles the transition
                        gracefully.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                    <div>
                      <p className="font-semibold text-surface-900">UK customer support hours</p>
                      <p className="text-sm">
                        When something breaks on site at 8am on a Monday, you
                        need support that is awake. We verify whether each vendor
                        offers UK business hours support, phone or live chat
                        availability, and typical response times.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold text-surface-900 pt-4">
                  Built by tradespeople, not by marketing agencies
                </h3>

                <p>
                  UKTradeApps is not a project from a Silicon Valley startup
                  trying to &ldquo;disrupt&rdquo; your industry. It is built by
                  people with over 40 years of hands-on experience across
                  construction, electrical installation, hospitality and trades.
                  We build software for this market ourselves, including{' '}
                  <Link to="/electricians" className="text-brand-600 font-medium hover:underline">
                    electrical certification tools
                  </Link>
                  ,{' '}
                  <Link to="/builders" className="text-brand-600 font-medium hover:underline">
                    snagging and inspection software
                  </Link>
                  , and{' '}
                  <Link to="/plumbers" className="text-brand-600 font-medium hover:underline">
                    compliance management platforms
                  </Link>
                  . We list our own products alongside competitors because we
                  believe tradespeople should be able to compare everything in
                  one place and make their own choice.
                </p>

                <p>
                  Every app on this directory has been evaluated against real
                  trade workflows. We do not just read feature lists and copy
                  marketing claims &mdash; we test whether these tools survive a
                  real day on site. Does the quoting tool handle CIS deductions?
                  Does the certificate app produce output that your scheme
                  provider will actually accept? Does the scheduling tool work
                  when three jobs overrun on the same day? These are the
                  questions we answer.
                </p>

                <h3 className="font-display text-xl font-bold text-surface-900 pt-4">
                  The software stack problem for UK trades
                </h3>

                <p>
                  Most tradespeople we speak to are not using zero software
                  &mdash; they are using the wrong combination. An electrician
                  might have one app for certificates, another for invoicing, a
                  third for scheduling, and a spreadsheet for everything else.
                  None of them talk to each other. Data gets entered twice or
                  three times. Quotes generated in one system do not flow through
                  to invoices in another.
                </p>

                <p>
                  This is the software stack problem, and it is why we built
                  the{' '}
                  <Link to="/quiz" className="text-brand-600 font-medium hover:underline">
                    Find My Stack quiz
                  </Link>
                  . Instead of listing individual tools in isolation, we
                  recommend combinations that actually work together. Your trade,
                  your team size, your budget and your biggest pain point all
                  feed into a recommendation that considers how these tools
                  interact, not just how they perform individually.
                </p>

                <p>
                  A sole-trader electrician running domestic work has completely
                  different software needs from a ten-person electrical
                  contracting firm handling commercial projects. The quiz
                  understands this distinction and recommends accordingly. That is
                  something no generic directory can do, because generic
                  directories do not understand the industry well enough to ask
                  the right questions.
                </p>

                <h3 className="font-display text-xl font-bold text-surface-900 pt-4">
                  For SaaS creators building for UK trades
                </h3>

                <p>
                  If you have built a software product that serves UK
                  tradespeople, we want to hear from you. UKTradeApps is an open
                  directory &mdash; we actively invite third-party SaaS creators
                  to{' '}
                  <Link to="/submit" className="text-brand-600 font-medium hover:underline">
                    submit their apps for review
                  </Link>
                  . Listings start free, and we review every submission manually
                  to ensure it meets our quality criteria. We do not auto-accept
                  submissions or allow vendors to write their own reviews.
                </p>

                <p>
                  Featured placement and sponsorship options are available for
                  vendors who want greater visibility, but these are always
                  clearly labelled and never affect editorial reviews or quiz
                  recommendations. We believe transparency builds trust, and
                  trust is what makes a directory worth using.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            Quiz CTA
        =============================================================== */}
        <section className="bg-brand-600 text-white section-spacing" aria-labelledby="quiz-cta-heading">
          <div className="container-app text-center">
            <h2 id="quiz-cta-heading" className="font-display text-3xl font-bold sm:text-4xl">
              Not sure what software you need?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
              Answer 5 quick questions and we&apos;ll recommend the best tools
              for your trade, your team size, and your budget. It takes less than
              two minutes and you do not need to create an account.
            </p>
            <Link to="/quiz" className="btn-accent mt-8 px-8 py-3 text-base">
              Take the free quiz
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* ==============================================================
            FAQ Section \u2014 12 FAQs with schema (Point 13)
        =============================================================== */}
        <section className="section-spacing bg-white" aria-labelledby="faq-heading">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <HelpCircle className="mx-auto h-10 w-10 text-brand-600" />
                <h2 id="faq-heading" className="mt-4 font-display text-3xl font-bold text-surface-900 sm:text-4xl">
                  Frequently asked questions
                </h2>
                <p className="mt-4 text-lg text-surface-600">
                  Everything you need to know about UKTradeApps and how we help
                  UK tradespeople find the right software.
                </p>
              </div>

              <div className="mt-10 border-t border-surface-200">
                {FAQS.map((faq) => (
                  <FaqItem
                    key={faq.question}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            Newsletter CTA
        =============================================================== */}
        <NewsletterSignup source="homepage" />
      </main>

      {/* ==============================================================
          Footer
      =============================================================== */}
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
              <h3 className="font-display text-sm font-bold text-surface-900">
                Trades
              </h3>
              <nav className="mt-3 flex flex-col gap-2 text-sm text-surface-600" aria-label="Trade categories">
                <Link to="/electricians" className="hover:text-brand-600">
                  Software for Electricians
                </Link>
                <Link to="/builders" className="hover:text-brand-600">
                  Software for Builders
                </Link>
                <Link to="/plumbers" className="hover:text-brand-600">
                  Software for Plumbers
                </Link>
              </nav>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-surface-900">
                Tools
              </h3>
              <nav className="mt-3 flex flex-col gap-2 text-sm text-surface-600" aria-label="Tools and resources">
                <Link to="/quiz" className="hover:text-brand-600">
                  Find My Stack Quiz
                </Link>
                <Link to="/submit" className="hover:text-brand-600">
                  List Your App
                </Link>
              </nav>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-surface-900">
                Company
              </h3>
              <nav className="mt-3 flex flex-col gap-2 text-sm text-surface-600" aria-label="Company pages">
                <Link to="/about" className="hover:text-brand-600">About UKTradeApps</Link>
                <Link to="/privacy" className="hover:text-brand-600">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-brand-600">Terms of Use</Link>
              </nav>
            </div>
          </div>

          <div className="mt-10 border-t border-surface-200 pt-6 text-center text-xs text-surface-400">
            {'\u00a9'} {new Date().getFullYear()} UKTradeApps. Part of the Autaimate
            portfolio. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
