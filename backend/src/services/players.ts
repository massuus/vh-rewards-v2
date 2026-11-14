import {GetAllRewards, GetPlayerRewards} from '../services/vaultRewards'
import { getMinecraftUUIDByUsername, getMinecraftUsernameByUUID } from '../services/minecraft'
import { PlayerIdentifier, PlayerData } from '../types/player';
import { VaultRewardsResponse } from '../types/vaultRewards';
import type { RewardSet } from '../types/rewardSet';
import { getUserPatreonDataByUUID } from './patreon';

async function getPlayerRewards(
  identifier: PlayerIdentifier,
  apiKey: string
) {
    let rewards: VaultRewardsResponse;

    let minecraftUsername: string = '';

    if (identifier.type === 'minecraft') {
      minecraftUsername = identifier.value
      const uuid = await getMinecraftUUIDByUsername(identifier.value)
      identifier.value = uuid
    }

    rewards = await GetPlayerRewards(identifier.type, identifier.value, apiKey)
    
    if (identifier.type === 'twitch' && rewards.minecraftId) {
      minecraftUsername = await getMinecraftUsernameByUUID(rewards.minecraftId)
    }

    const allRewards = await GetAllRewards()

    const unlockedIds = new Set(rewards.sets)
    let ObtainedSets: RewardSet[] = []
    let UnObtainedSets: RewardSet[] = []

    for (const set of allRewards.rewards) {
        if (unlockedIds.has(set.id)) {
            ObtainedSets.push(set)
        } else {
            UnObtainedSets.push(set)
        }
    }

    const patreonData = await getUserPatreonDataByUUID(rewards.minecraftId)

  let playerData : PlayerData;
  playerData = {
    twitchUsername: rewards.twitchUsername,
    minecraftId: identifier.type === 'minecraft' ? rewards.id: rewards.minecraftId,
    minecraftUsername: minecraftUsername,
    ObtainedSets: ObtainedSets,
    UnObtainedSets: UnObtainedSets,
    PatreonData: patreonData
  };
    
  return playerData

}
export { getPlayerRewards }