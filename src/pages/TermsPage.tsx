import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const APP_URL = import.meta.env.VITE_APP_URL || 'https://uktradeapps.co.uk'

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Use | UKTradeApps</title>
        <meta name="description" content="Terms of use for UKTradeApps. Conditions for using our directory, tools, and services." />
        <link rel="canonical" href={`${APP_URL}/terms`} />
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
            <h1 className="font-display text-3xl font-extrabold text-surface-900 sm:text-4xl">Terms of Use</h1>
            <p className="mt-2 text-sm text-surface-500">Last updated: 5 March 2026</p>

            <div className="mt-8 space-y-8 text-surface-700 leading-relaxed">
              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">1. About these terms</h2>
                <p className="mt-3">
                  These terms govern your use of uktradeapps.co.uk ({'"'}the Site{'"'}), operated by Autaimate
                  ({'"'}we{'"'}, {'"'}us{'"'}, {'"'}our{'"'}). By using the Site, you agree to these terms. If you
                  do not agree, please do not use the Site.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">2. What we provide</h2>
                <p className="mt-3">
                  UKTradeApps is a software directory and comparison service for UK tradespeople. We provide:
                  a searchable directory of software tools for electricians, builders, and plumbers; independent
                  reviews and comparison guides; a free quiz that recommends software based on your needs; a free
                  quote generator for electricians; and a newsletter with trade software news and deals.
                </p>
                <p className="mt-3">
                  We are a directory and information service, not a software vendor. We do not sell, licence, or
                  support the software products listed on our site. Your relationship with any software vendor
                  you discover through UKTradeApps is between you and that vendor.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">3. Accuracy of information</h2>
                <p className="mt-3">
                  We make every effort to ensure the information on our site is accurate, including software
                  pricing, features, and compliance details. However, software vendors may change their pricing,
                  features, or availability at any time without notifying us.
                </p>
                <p className="mt-3">
                  We verify listings at least quarterly and display a {'"'}last verified{'"'} date on each listing.
                  Always confirm pricing and features directly with the software vendor before making a purchase
                  decision. We accept no liability for losses arising from inaccurate information on our site.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">4. Quote generator disclaimer</h2>
                <p className="mt-3">
                  Our free quote generator provides estimated pricing based on UK regional averages for common
                  domestic electrical jobs. These estimates are for guidance only and should not be relied upon
                  as exact pricing. Actual costs depend on site-specific conditions, material choices, access
                  requirements, and other factors that a generic calculator cannot account for.
                </p>
                <p className="mt-3">
                  You are responsible for verifying all figures before sending a quote to a client. UKTradeApps
                  accepts no liability for financial losses arising from quotes generated using our tool.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">5. Quiz recommendations</h2>
                <p className="mt-3">
                  Our quiz provides software recommendations based on the answers you provide. These
                  recommendations are generated algorithmically and represent our opinion of the best fit
                  based on your stated requirements. They do not constitute professional advice.
                </p>
                <p className="mt-3">
                  Quiz recommendations are influenced by objective criteria including category match, budget
                  fit, UK compliance verification, and offline capability. They are never influenced by
                  affiliate commissions or vendor payments.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">6. Affiliate links and advertising</h2>
                <p className="mt-3">
                  Some pages on our site contain affiliate links. If you click an affiliate link and subsequently
                  purchase or subscribe to a product, we may receive a commission at no additional cost to you.
                  Affiliate relationships are always disclosed on pages where they appear.
                </p>
                <p className="mt-3">
                  Affiliate commissions never influence our editorial content, reviews, quiz recommendations,
                  or directory rankings. Featured listings are clearly labelled and separated from editorial
                  content.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">7. Vendor submissions</h2>
                <p className="mt-3">
                  Software vendors may submit their products for inclusion in our directory via our submission
                  form. Submission does not guarantee listing. We review every submission manually against our
                  quality and UK-relevance criteria.
                </p>
                <p className="mt-3">
                  By submitting a product, you confirm that you have the authority to represent the product
                  and that the information provided is accurate. We reserve the right to reject, modify, or
                  remove any listing at our discretion.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">8. Intellectual property</h2>
                <p className="mt-3">
                  All content on UKTradeApps, including text, graphics, logos, and software, is owned by
                  Autaimate or used under licence. You may not reproduce, distribute, or create derivative
                  works from our content without written permission.
                </p>
                <p className="mt-3">
                  Software vendor logos, names, and trademarks displayed in our directory remain the property
                  of their respective owners and are used for identification purposes only.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">9. User accounts</h2>
                <p className="mt-3">
                  Some features of the Site may require you to create an account via our authentication
                  provider, Clerk. You are responsible for maintaining the confidentiality of your account
                  credentials and for all activity under your account.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">10. Limitation of liability</h2>
                <p className="mt-3">
                  UKTradeApps is provided {'"'}as is{'"'} without warranty of any kind. To the maximum extent
                  permitted by law, Autaimate shall not be liable for any indirect, incidental, special, or
                  consequential damages arising from your use of the Site, our tools, or any software product
                  discovered through our directory.
                </p>
                <p className="mt-3">
                  Nothing in these terms excludes or limits our liability for death or personal injury caused
                  by negligence, fraud, or any other liability that cannot be excluded under English law.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">11. Governing law</h2>
                <p className="mt-3">
                  These terms are governed by the laws of England and Wales. Any disputes arising from these
                  terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts
                  of England and Wales.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">12. Changes to these terms</h2>
                <p className="mt-3">
                  We may update these terms from time to time. Changes will be posted on this page with an
                  updated date. Continued use of the Site after changes are posted constitutes acceptance of
                  the revised terms.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">13. Contact</h2>
                <p className="mt-3">
                  For questions about these terms, contact us at legal@autaimate.com.
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
