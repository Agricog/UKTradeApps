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

export async function getTrades(): Promise<Trade[]> {
  const data = await fetchApi<{ trades: Trade[] }>('/api/v1/trades')
  return data.trades
}

export async function getTradeBySlug(slug: string): Promise<TradeWithCategories> {
  const data = await fetchApi<{ trade: TradeWithCategories }>(`/api/v1/trades/${slug}`)
  return data.trade
}

export async function getListingsByTrade(tradeSlug: string): Promise<ListingCard[]> {
  const data = await fetchApi<{ listings: ListingCard[] }>(
    `/api/v1/trades/${tradeSlug}/listings`,
  )
  return data.listings
}

export async function getListingsByCategory(
  tradeSlug: string,
  categorySlug: string,
): Promise<ListingCard[]> {
  const data = await fetchApi<{ listings: ListingCard[] }>(
    `/api/v1/trades/${tradeSlug}/categories/${categorySlug}/listings`,
  )
  return data.listings
}

export async function getListingBySlug(slug: string): Promise<Listing> {
  const data = await fetchApi<{ listing: Listing }>(`/api/v1/listings/${slug}`)
  return data.listing
}
