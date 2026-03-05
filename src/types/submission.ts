export interface Submission {
  id: string
  appName: string
  websiteUrl: string
  contactName: string
  contactEmail: string
  tradeSlugs: string[]
  description: string
  pricingInfo: string | null
  status: SubmissionStatus
  reviewerNotes: string | null
  submittedByUserId: string | null
  createdAt: string
  updatedAt: string
}

export type SubmissionStatus = 'pending' | 'reviewing' | 'approved' | 'rejected'

export interface SubmissionFormData {
  appName: string
  websiteUrl: string
  contactName: string
  contactEmail: string
  tradeSlugs: string[]
  description: string
  pricingInfo: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  tradeSlug: string | null
  source: string
  isConfirmed: boolean
  confirmedAt: string | null
  unsubscribedAt: string | null
  createdAt: string
}

export interface NewsletterSignupData {
  email: string
  tradeSlug?: string
  source: string
}
