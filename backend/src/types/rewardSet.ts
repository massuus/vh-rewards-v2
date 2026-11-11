export interface RewardSet {
  id: string
  sets: Record<string, string[]>
  displayName: string
  description: string | null
  unavailable: boolean
  featured: boolean
  cost: number
  category: string
  discount: number
}