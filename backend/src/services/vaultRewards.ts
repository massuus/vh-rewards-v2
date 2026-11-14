import { VaultRewardsResponse, VaultAllRewardsResponse } from "../types/vaultRewards"
import type { RewardSet } from '../types/rewardSet'
import { cache } from './cache'

async function GetPlayerRewards(
  type: string,
  value: string,
  apiKey: string
): Promise<VaultRewardsResponse> {
  const url = new URL('https://rewards.vaulthunters.gg/rewards')

  if (type === 'minecraft') {
    url.searchParams.set('minecraft', value)
  } else if (type === 'twitch') {
    url.searchParams.set('twitchUsername', value)
  } else {
    throw new Error(`Unsupported player identifier type: ${type}`)
  }

  let response = await caches.default.match(url.toString()) 

  const cacheMiss = !response
  if (!response) {
    const upstream = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    if (!upstream.ok) {
      throw new Error(`Failed to fetch rewards for ${type} ${value}: ${upstream.status}`)
    }

    response = upstream
  } 

  const data = await response.json() as VaultRewardsResponse
  if (cacheMiss) {
    await cache(url.toString(), data)
  }
  return data
}

async function GetAllRewards(): Promise<VaultAllRewardsResponse> {
  const url = 'https://rewards.vaulthunters.gg/rewards/sets/all'

  let response = await caches.default.match(url)

  const cacheMiss = !response
  if (!response) {
    const upstream = await fetch(url)

    if (!upstream.ok) {
      throw new Error(`Failed to fetch all rewards: ${upstream.status}`)
    }

    response = upstream
  } 

  const rewards = (await response.json()) as RewardSet[]

  if (cacheMiss) {
    await cache(url, rewards)
  }
  return { rewards }
}
export { GetPlayerRewards, GetAllRewards }