import type { RewardSet } from './rewardSet'

export interface VaultRewardsResponse {
  id: string
  twitchUsername: string
  minecraftId: string
  rewards: Record<string, string[]>
  sets: string[]
}
export interface VaultAllRewardsResponse {
  rewards: RewardSet[]
}
