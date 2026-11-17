import { PatreonData } from "./patreon";

  export type PlayerIdentifier =
  | { type: 'minecraft'; value: string }
  | { type: 'twitch'; value: string }
  | { type: 'alias'; value: string }

  export interface PlayerData { 
  twitchUsername: string
  minecraftId: string
  minecraftUsername: string
  ObtainedSets: string[]
  PatreonData: PatreonData
}
