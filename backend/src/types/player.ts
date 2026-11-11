import { RewardSet } from "./rewardSet";

  type PlayerIdentifier =
  | { type: 'minecraft'; value: string }
  | { type: 'twitch'; value: string }
  | { type: 'alias'; value: string }

  interface PlayerData { 
  twitchUsername: string
  minecraftId: string
  ObtainedSets: RewardSet[]
  UnObtainedSets: RewardSet[]
}

  export { PlayerIdentifier, PlayerData }