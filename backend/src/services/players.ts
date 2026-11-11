import {GetAllRewards, GetPlayerRewards} from '../services/vaultRewards'
import { resolveMinecraftUsername } from '../services/minecraft'
import { PlayerIdentifier, PlayerData } from '../types/player';
import { VaultRewardsResponse } from '../types/vaultRewards';
import type { RewardSet } from '../types/rewardSet';

async function getPlayerRewards(
  identifier: PlayerIdentifier,
  apiKey: string
) {
    let rewards: VaultRewardsResponse;

    switch (identifier.type) {
    case 'minecraft':
      const uuid = await resolveMinecraftUsername(identifier.value)
      identifier.value = uuid
    }

    rewards = await GetPlayerRewards(identifier.type, identifier.value, apiKey)

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

  let playerData : PlayerData;
  playerData = {
    twitchUsername: rewards.twitchUsername,
    minecraftId: rewards.minecraftId,
    ObtainedSets: ObtainedSets,
    UnObtainedSets: UnObtainedSets
  };
    
  return playerData

}
export { getPlayerRewards }