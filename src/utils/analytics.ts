type EventParams = Record<string, string | number | boolean>

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      action: string,
      params?: EventParams,
    ) => void
  }
}

const isAnalyticsAvailable = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    import.meta.env.PROD
  )
}

export const trackEvent = (
  eventName: string,
  params?: EventParams,
): void => {
  if (!isAnalyticsAvailable()) return

  window.gtag?.('event', eventName, {
    ...params,
    timestamp: new Date().toISOString(),
  })
}

export const trackQuizStart = (tradeSlug: string): void => {
  trackEvent('quiz_start', { trade: tradeSlug })
}

export const trackQuizComplete = (
  tradeSlug: string,
  teamSize: string,
  resultCount: number,
): void => {
  trackEvent('quiz_complete', {
    trade: tradeSlug,
    team_size: teamSize,
    result_count: resultCount,
  })
}

export const trackListingView = (
  listingSlug: string,
  tradeSlug: string,
): void => {
  trackEvent('listing_view', {
    listing: listingSlug,
    trade: tradeSlug,
  })
}

export const trackListingClick = (
  listingSlug: string,
  destination: 'website' | 'review' | 'compare',
): void => {
  trackEvent('listing_click', {
    listing: listingSlug,
    destination,
  })
}

export const trackSubmission = (status: 'started' | 'completed'): void => {
  trackEvent('vendor_submission', { status })
}

export const trackNewsletterSignup = (source: string): void => {
  trackEvent('newsletter_signup', { source })
}
