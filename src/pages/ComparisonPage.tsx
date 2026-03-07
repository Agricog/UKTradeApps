import { Helmet } from 'react-helmet-async'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'
import { SEO_PAGES, type SeoPageData } from '../data/seoPages'
import NewsletterSignup from '../components/NewsletterSignup'

const APP_URL = import.meta.env.VITE_APP_URL || 'https://uktradeapps.co.uk'

/* =========================================================================
   FAQ Accordion
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
        <div className="pb-5 text-surface-600 leading-relaxed">{answer}</div>
      )}
    </div>
  )
}

/* =========================================================================
   Structured Data Builder \u2014 All 8 JSON-LD Schemas
   ========================================================================= */

function buildStructuredData(page: SeoPageData) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. WebPage with Speakable
      {
        '@type': 'WebPage',
        '@id': `${APP_URL}/guides/${page.slug}/#webpage`,
        url: `${APP_URL}/guides/${page.slug}`,
        name: page.title,
        description: page.metaDescription,
        isPartOf: { '@id': `${APP_URL}/#website` },
        breadcrumb: { '@id': `${APP_URL}/guides/${page.slug}/#breadcrumb` },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['#quick-answer'],
        },
      },
      // 2. BreadcrumbList
      {
        '@type': 'BreadcrumbList',
        '@id': `${APP_URL}/guides/${page.slug}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.tradeCategory,
            item: `${APP_URL}/${page.tradeSlug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: page.breadcrumbLabel,
            item: `${APP_URL}/guides/${page.slug}`,
          },
        ],
      },
      // 3. FAQPage
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      // 4. Article
      {
        '@type': 'Article',
        headline: page.h1,
        description: page.metaDescription,
        author: {
          '@type': 'Organization',
          name: 'UKTradeApps',
          url: APP_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Autaimate',
          url: APP_URL,
          logo: { '@type': 'ImageObject', url: `${APP_URL}/og-uktradeapps.jpg` },
        },
        datePublished: '2026-03-05',
        dateModified: '2026-03-07',
        image: `${APP_URL}/og-uktradeapps.jpg`,
      },
      // 5. Organization
      {
        '@type': 'Organization',
        '@id': `${APP_URL}/#organization`,
        name: 'UKTradeApps',
        url: APP_URL,
        logo: `${APP_URL}/og-uktradeapps.jpg`,
        description: "Built by tradespeople with 40+ years experience. The UK's trusted app directory for trades.",
      },
      // 6. SoftwareApplication
      {
        '@type': 'SoftwareApplication',
        name: 'UKTradeApps Directory',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        description: 'Free directory and quiz tool to help UK tradespeople find the best software for their business.',
      },
      // 7. HowTo
      {
        '@type': 'HowTo',
        name: `How to Choose the Best ${page.breadcrumbLabel} for Your Business`,
        description: `Use UKTradeApps to compare ${page.breadcrumbLabel.toLowerCase()} options and find the right fit for your ${page.tradeCategory.toLowerCase()} business.`,
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Read our independent comparison',
            text: `Review our detailed guide comparing every ${page.breadcrumbLabel.toLowerCase()} option available to UK ${page.tradeCategory.toLowerCase()}.`,
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Take the quiz for personalised recommendations',
            text: 'Answer 4 quick questions about your trade, team size, budget and pain points to get a tailored recommendation.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Compare and choose',
            text: 'Use our directory to compare features, pricing, and compliance details side by side before making your decision.',
          },
        ],
      },
      // 8. DefinedTermSet
      {
        '@type': 'DefinedTermSet',
        name: `${page.tradeCategory} Software Terms`,
        description: `Key terms related to ${page.breadcrumbLabel.toLowerCase()} for UK ${page.tradeCategory.toLowerCase()}.`,
        hasDefinedTerm: (page.definedTerms || []).map((term) => ({
          '@type': 'DefinedTerm',
          name: term.name,
          description: term.description,
        })),
      },
    ],
  }
}

/* =========================================================================
   ComparisonPage Component
   ========================================================================= */

export default function ComparisonPage() {
  const { pageSlug } = useParams<{ pageSlug: string }>()

  const page = pageSlug ? SEO_PAGES[pageSlug] : undefined

  if (!page) {
    return <Navigate to="/" replace />
  }

  const structuredData = buildStructuredData(page)

  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={`${APP_URL}/guides/${page.slug}`} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:image" content={`${APP_URL}/og-uktradeapps.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${APP_URL}/guides/${page.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="en_GB" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={page.metaDescription} />
        <meta name="twitter:image" content={`${APP_URL}/og-uktradeapps.jpg`} />

        <meta name="author" content="UKTradeApps \u2014 Autaimate Portfolio" />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      {/* Navigation */}
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
            <Link to="/submit" className="btn-primary text-sm">
              List Your App
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        {/* Quick Answer Box */}
        <div
          id="quick-answer"
          className="sr-only"
          aria-label="Quick answer for voice search"
        >
          {page.quickAnswer}
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(63,104,235,0.3),transparent)]" />
          <div className="container-app relative py-16 sm:py-20">
            <nav
              className="mb-6 flex items-center gap-2 text-sm text-surface-400"
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link to={`/${page.tradeSlug}`} className="hover:text-white">
                {page.tradeCategory}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-surface-300">{page.breadcrumbLabel}</span>
            </nav>

            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-surface-300">
              {page.heroDescription}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/quiz" className="btn-accent px-6 py-2.5">
                Find my perfect stack
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={`/${page.tradeSlug}`}
                className="btn border-surface-600 bg-transparent px-6 py-2.5 text-white hover:bg-surface-800"
              >
                Browse all {page.tradeCategory.toLowerCase()} apps
              </Link>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section
          className="border-b border-surface-200 bg-white py-5"
          aria-label="Trust signals"
        >
          <div className="container-app flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-surface-600">
            {page.trustSignals.map((signal) => (
              <span key={signal} className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-brand-600" />
                {signal}
              </span>
            ))}
          </div>
        </section>

        {/* Affiliate disclosure */}
        <section className="bg-surface-50 border-b border-surface-200">
          <div className="container-app py-3">
            <p className="text-center text-2xs text-surface-400">
              Some links on this page are affiliate links. We may earn a commission if you sign up.
              This never affects our reviews or recommendations.{' '}
              <Link to="/about" className="underline hover:text-surface-600">
                Learn more
              </Link>
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="section-spacing bg-surface-50">
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              {page.contentSections.map((section, index) => (
                <div key={index} className="mt-10 first:mt-0">
                  {section.heading && (
                    <h2 className="font-display text-2xl font-bold text-surface-900 sm:text-3xl">
                      {section.heading}
                    </h2>
                  )}
                  {section.subheading && (
                    <h3 className="mt-8 font-display text-xl font-bold text-surface-900">
                      {section.subheading}
                    </h3>
                  )}
                  {section.paragraphs.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="mt-4 text-surface-700 leading-relaxed"
                    >
                      {para}
                    </p>
                  ))}
                  {section.checkpoints && (
                    <div className="mt-6 space-y-4">
                      {section.checkpoints.map((cp, cpIdx) => (
                        <div key={cpIdx} className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                          <div>
                            <p className="font-semibold text-surface-900">
                              {cp.title}
                            </p>
                            <p className="text-sm text-surface-600">
                              {cp.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* External authority links */}
              {page.externalLinks && page.externalLinks.length > 0 && (
                <div className="mt-12 rounded-xl border border-surface-200 bg-white px-6 py-5">
                  <h3 className="font-display text-lg font-bold text-surface-900">
                    Official resources & standards
                  </h3>
                  <p className="mt-1 text-sm text-surface-500">
                    Authoritative external sources referenced in this guide.
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {page.externalLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-900 hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal links */}
              <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 px-6 py-5">
                <h3 className="font-display text-lg font-bold text-brand-900">
                  Related guides
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                  {page.relatedPages.map((link) => {
                    const isGuide = link.slug.includes('-') && !['electricians', 'builders', 'plumbers', 'quiz', 'quote', 'submit'].includes(link.slug)
                    const href = isGuide ? `/guides/${link.slug}` : `/${link.slug}`
                    return (
                      <Link
                        key={link.slug}
                        to={href}
                        className="text-sm font-medium text-brand-700 hover:text-brand-900 hover:underline"
                      >
                        {link.label} &rarr;
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz CTA */}
        <section className="bg-brand-600 text-white section-spacing">
          <div className="container-app text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Not sure which tool is right for you?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
              Take our free quiz and get a personalised software recommendation
              matched to your trade, team size, and budget.
            </p>
            <Link to="/quiz" className="btn-accent mt-8 px-8 py-3 text-base">
              Take the free quiz
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section
          className="section-spacing bg-white"
          aria-labelledby="faq-heading"
        >
          <div className="container-app">
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <HelpCircle className="mx-auto h-10 w-10 text-brand-600" />
                <h2
                  id="faq-heading"
                  className="mt-4 font-display text-3xl font-bold text-surface-900 sm:text-4xl"
                >
                  Frequently asked questions
                </h2>
              </div>

              <div className="mt-10 border-t border-surface-200">
                {page.faqs.map((faq) => (
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

        {/* Newsletter */}
        <NewsletterSignup
          source={`seo-${page.slug}`}
          tradeSlug={page.tradeSlug}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-white py-12">
        <div className="container-app">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link
                to="/"
                className="font-display text-lg font-bold text-brand-700"
              >
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
              <nav
                className="mt-3 flex flex-col gap-2 text-sm text-surface-600"
                aria-label="Trade categories"
              >
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
              <nav
                className="mt-3 flex flex-col gap-2 text-sm text-surface-600"
                aria-label="Tools"
              >
                <Link to="/quiz" className="hover:text-brand-600">
                  Find My Stack Quiz
                </Link>
                <Link to="/quote" className="hover:text-brand-600">
                  Free Quote Generator
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
              <nav
                className="mt-3 flex flex-col gap-2 text-sm text-surface-600"
                aria-label="Company"
              >
                <Link to="/about" className="hover:text-brand-600">
                  About UKTradeApps
                </Link>
                <Link to="/privacy" className="hover:text-brand-600">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-brand-600">
                  Terms of Use
                </Link>
              </nav>
            </div>
          </div>
          <div className="mt-10 border-t border-surface-200 pt-6 text-center text-xs text-surface-400">
            {'\u00a9'} {new Date().getFullYear()} UKTradeApps. Part of the
            Autaimate portfolio. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
