import type { Trade, TradeWithCategories } from '../types/trade'
import type { ListingCard, Listing } from '../types/listing'

const API_BASE = import.meta.env.VITE_API_BASE_URL

if (!API_BASE) {
  throw new Error('Missing VITE_API_BASE_URL. Add it to your environment variables.')
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json() as Promise<T>
}

/* =========================================================================
   Snake_case → camelCase transforms
   Neon returns snake_case, TypeScript types use camelCase
   ========================================================================= */

function transformTrade(row: Record<string, unknown>): Trade {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    iconName: row.icon_name as string,
    isActive: row.is_active as boolean,
    sortOrder: row.sort_order as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function transformListingCard(row: Record<string, unknown>): ListingCard {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    tagline: row.tagline as string,
    logoUrl: (row.logo_url as string) || null,
    priceFromMonthly: row.price_from_monthly ? Number(row.price_from_monthly) : null,
    hasFreeTier: row.has_free_tier as boolean,
    hasFreeTrial: row.has_free_trial as boolean,
    ukPricingGbp: row.uk_pricing_gbp as boolean,
    ukComplianceVerified: row.uk_compliance_verified as boolean,
    offlineCapable: row.offline_capable as boolean,
    isOwnProduct: row.is_own_product as boolean,
    isFeatured: row.is_featured as boolean,
    isVerified: row.is_verified as boolean,
    lastVerifiedAt: (row.last_verified_at as string) || null,
  }
}

function transformCategory(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    tradeId: row.trade_id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) || null,
    sortOrder: row.sort_order as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

/* =========================================================================
   API Functions
   ========================================================================= */

export async function getTrades(): Promise<Trade[]> {
  const data = await fetchApi<{ trades: Record<string, unknown>[] }>('/api/v1/trades')
  return data.trades.map(transformTrade)
}

export async function getTradeBySlug(slug: string): Promise<TradeWithCategories> {
  const data = await fetchApi<{ trade: Record<string, unknown> & { categories: Record<string, unknown>[] } }>(
    `/api/v1/trades/${slug}`,
  )
  return {
    ...transformTrade(data.trade),
    categories: data.trade.categories.map(transformCategory),
  }
}

export async function getListingsByTrade(tradeSlug: string): Promise<ListingCard[]> {
  const data = await fetchApi<{ listings: Record<string, unknown>[] }>(
    `/api/v1/trades/${tradeSlug}/listings`,
  )
  return data.listings.map(transformListingCard)
}

export async function getListingsByCategory(
  tradeSlug: string,
  categorySlug: string,
): Promise<ListingCard[]> {
  const data = await fetchApi<{ listings: Record<string, unknown>[] }>(
    `/api/v1/trades/${tradeSlug}/categories/${categorySlug}/listings`,
  )
  return data.listings.map(transformListingCard)
}

export async function getListingBySlug(slug: string): Promise<Listing> {
  const data = await fetchApi<{ listing: Record<string, unknown> }>(`/api/v1/listings/${slug}`)
  const row = data.listing
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    tagline: row.tagline as string,
    description: row.description as string,
    websiteUrl: row.website_url as string,
    logoUrl: (row.logo_url as string) || null,
    screenshotUrls: (row.screenshot_urls as string[]) || [],
    priceFromMonthly: row.price_from_monthly ? Number(row.price_from_monthly) : null,
    priceFromAnnual: row.price_from_annual ? Number(row.price_from_annual) : null,
    hasFreeTier: row.has_free_tier as boolean,
    hasFreeTrial: row.has_free_trial as boolean,
    pricingNotes: (row.pricing_notes as string) || null,
    ukPricingGbp: row.uk_pricing_gbp as boolean,
    ukComplianceVerified: row.uk_compliance_verified as boolean,
    ukSupportAvailable: row.uk_support_available as boolean,
    ukSupportHours: (row.uk_support_hours as string) || null,
    offlineCapable: row.offline_capable as boolean,
    vatSupport: row.vat_support as boolean,
    complianceNotes: (row.compliance_notes as string) || null,
    platforms: (row.platforms as string[]) || [],
    integrations: (row.integrations as string[]) || [],
    isOwnProduct: row.is_own_product as boolean,
    isFeatured: row.is_featured as boolean,
    isVerified: row.is_verified as boolean,
    status: row.status as Listing['status'],
    lastVerifiedAt: (row.last_verified_at as string) || null,
    claimedByUserId: (row.claimed_by_user_id as string) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}
