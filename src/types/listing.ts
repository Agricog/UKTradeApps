export interface Listing {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  websiteUrl: string
  logoUrl: string | null
  screenshotUrls: string[]

  // Pricing
  priceFromMonthly: number | null
  priceFromAnnual: number | null
  hasFreeTier: boolean
  hasFreeTrial: boolean
  pricingNotes: string | null

  // UK-specific checks
  ukPricingGbp: boolean
  ukComplianceVerified: boolean
  ukSupportAvailable: boolean
  ukSupportHours: string | null
  offlineCapable: boolean
  vatSupport: boolean
  complianceNotes: string | null

  // Platform
  platforms: string[]
  integrations: string[]

  // Ownership & status
  isOwnProduct: boolean
  isFeatured: boolean
  isVerified: boolean
  status: ListingStatus
  lastVerifiedAt: string | null
  claimedByUserId: string | null

  createdAt: string
  updatedAt: string
}

export type ListingStatus = 'draft' | 'pending' | 'published' | 'archived'

export interface ListingWithTrades extends Listing {
  tradeIds: string[]
  categoryIds: string[]
}

export interface ListingCard {
  id: string
  name: string
  slug: string
  tagline: string
  logoUrl: string | null
  priceFromMonthly: number | null
  hasFreeTier: boolean
  hasFreeTrial: boolean
  ukPricingGbp: boolean
  ukComplianceVerified: boolean
  offlineCapable: boolean
  isOwnProduct: boolean
  isFeatured: boolean
  isVerified: boolean
  lastVerifiedAt: string | null
}
