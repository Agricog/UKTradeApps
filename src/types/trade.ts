export interface Trade {
  id: string
  name: string
  slug: string
  description: string
  iconName: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  tradeId: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface TradeWithCategories extends Trade {
  categories: Category[]
}
