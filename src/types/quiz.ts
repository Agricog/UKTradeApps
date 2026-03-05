export interface QuizAnswers {
  tradeSlug: string
  teamSize: TeamSize
  budget: Budget
  painPoints: PainPoint[]
}

export type TeamSize =
  | 'sole-trader'
  | '2-5'
  | '6-10'
  | '11-20'
  | '20-plus'

export type Budget =
  | 'free-only'
  | 'under-25'
  | 'under-50'
  | 'under-100'
  | 'no-limit'

export type PainPoint =
  | 'certification'
  | 'quoting'
  | 'job-management'
  | 'invoicing'
  | 'scheduling'
  | 'compliance'
  | 'health-and-safety'
  | 'site-diary'
  | 'customer-management'

export interface QuizResult {
  id: string
  tradeSlug: string
  teamSize: string
  budget: string
  painPoints: string[]
  recommendedListingIds: string[]
  userId: string | null
  email: string | null
  createdAt: string
}

export interface QuizRecommendation {
  listingId: string
  matchScore: number
  matchReasons: string[]
}
