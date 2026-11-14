import { RewardSet } from "./rewardSet";
import { PatreonData } from "./patreon";

  type PlayerIdentifier =
  | { type: 'minecraft'; value: string }
  | { type: 'twitch'; value: string }
  | { type: 'alias'; value: string }

  interface PlayerData { 
  twitchUsername: string
  minecraftId: string
  minecraftUsername: string
  ObtainedSets: RewardSet[]
  UnObtainedSets: RewardSet[]
  PatreonData: PatreonData
}

export { PlayerIdentifier, PlayerData }