import { VaultRewardsResponse, VaultAllRewardsResponse } from "../types/vaultRewards"
import type { RewardSet } from '../types/rewardSet'

async function GetPlayerRewards(
  type: string,
  value: string,
  apiKey: string
): Promise<VaultRewardsResponse> {
  const url = new URL('https://rewards.vaulthunters.gg/rewards')
  const cache = caches.default

  if (type === 'minecraft') {
    url.searchParams.set('minecraft', value)
  } else if (type === 'twitch') {
    url.searchParams.set('twitchUsername', value)
  } else {
    throw new Error(`Unsupported player identifier type: ${type}`)
  }

  // Check cache first
  let response = await cache.match(url.toString())

  if (!response) {
    console.log(`Cache MISS: ${value}`)

    const upstream = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    if (!upstream.ok) {
      throw new Error(`Failed to fetch rewards for ${type} ${value}: ${upstream.status}`)
    }

    response = new Response(upstream.body, upstream)
    response.headers.set('Cache-Control', 'public, max-age=3600') // 1 hour

    await cache.put(url.toString(), response.clone())
  } 

  return (await response.json()) as VaultRewardsResponse
}

async function GetAllRewards(): Promise<VaultAllRewardsResponse> {
  const url = 'https://rewards.vaulthunters.gg/rewards/sets/all'
  const cache = caches.default

  let response = await cache.match(url)

  if (!response) {
    const upstream = await fetch(url)

    if (!upstream.ok) {
      throw new Error(`Failed to fetch all rewards: ${upstream.status}`)
    }

    response = new Response(upstream.body, upstream)
    response.headers.set('Cache-Control', 'public, max-age=3600') // 1 hour

    await cache.put(url, response.clone())
  } 

  const rewards = (await response.json()) as RewardSet[]

  return { rewards }
}
export { GetPlayerRewards, GetAllRewards }