import { useState } from 'react'
import {
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { validateInput } from '../utils/validation'
import { trackNewsletterSignup } from '../utils/analytics'
import { captureError } from '../utils/errorTracking'

const API_BASE = import.meta.env.VITE_API_BASE_URL

/* =========================================================================
   Props
   ========================================================================= */

interface NewsletterSignupProps {
  /** Which trade page this is shown on (null for homepage) */
  tradeSlug?: string | null
  /** Tracking source for analytics */
  source?: string
  /** Optional heading override */
  heading?: string
  /** Optional description override */
  description?: string
}

/* =========================================================================
   Component
   ========================================================================= */

export default function NewsletterSignup({
  tradeSlug = null,
  source = 'website',
  heading = 'Stay ahead of the curve',
  description = 'A weekly roundup of the best new apps, tools and deals for UK trades. No spam, no fluff \u2014 just useful software news written by people who understand your trade.',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {
    setFieldError(null)
    setSubmitError(null)

    const trimmed = email.trim()

    if (!trimmed) {
      setFieldError('Email address is required')
      return
    }

    const result = validateInput(trimmed, 'email')
    if (!result.isValid) {
      setFieldError('Enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE}/api/v1/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed.toLowerCase(),
          tradeSlug,
          source,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        throw new Error(errData?.error || `Server error: ${response.status}`)
      }

      setIsSuccess(true)
      trackNewsletterSignup(source)
    } catch (err) {
      captureError(err, 'NewsletterSignup.handleSubmit', { source, tradeSlug })
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  // ---- Success state ----
  if (isSuccess) {
    return (
      <section
        className="section-spacing bg-surface-50"
        aria-labelledby="newsletter-heading"
      >
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h2
              id="newsletter-heading"
              className="mt-4 font-display text-2xl font-bold text-surface-900 sm:text-3xl"
            >
              You&apos;re subscribed
            </h2>
            <p className="mt-3 text-surface-600">
              Welcome aboard. You&apos;ll get our weekly roundup of the best
              tools and deals for UK trades. No spam, ever.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ---- Form state ----
  return (
    <section
      className="section-spacing bg-surface-50"
      aria-labelledby="newsletter-heading"
    >
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <BookOpen className="mx-auto h-10 w-10 text-brand-600" />
          <h2
            id="newsletter-heading"
            className="mt-4 font-display text-3xl font-bold text-surface-900 sm:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-4 text-lg text-surface-600">{description}</p>

          <div className="mx-auto mt-8 max-w-md">
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setFieldError(null)
                    setSubmitError(null)
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="your@email.com"
                  maxLength={254}
                  disabled={isSubmitting}
                  className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60 ${
                    fieldError
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-surface-300 focus:border-brand-500'
                  }`}
                  autoComplete="email"
                  aria-describedby={
                    fieldError
                      ? 'newsletter-error'
                      : submitError
                        ? 'newsletter-submit-error'
                        : 'newsletter-privacy'
                  }
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex-shrink-0 px-6 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>

            {fieldError && (
              <p
                id="newsletter-error"
                className="mt-2 text-left text-sm text-red-600"
                role="alert"
              >
                {fieldError}
              </p>
            )}

            {submitError && (
              <p
                id="newsletter-submit-error"
                className="mt-2 flex items-center gap-1.5 text-left text-sm text-red-600"
                role="alert"
              >
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {submitError}
              </p>
            )}

            <p
              id="newsletter-privacy"
              className="mt-3 text-2xs text-surface-400"
            >
              One email per week. Unsubscribe any time. We never share your
              address.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
