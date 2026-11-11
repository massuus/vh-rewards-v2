import { Hono } from 'hono'
import type { Bindings } from '../types/env'
import type { PlayerIdentifier } from '../types/player'
import { getPlayerRewards } from '../services/players'

const players = new Hono<{ Bindings: Bindings }>()

players.get('/', async (c) => {
  const minecraft = c.req.query('minecraft')
  const twitch = c.req.query('twitch')
  const alias = c.req.query('alias')

  const identifiers = [minecraft, twitch, alias].filter(Boolean)

  if (identifiers.length !== 1) {
    return c.json(
      { error: 'Exactly one query parameter (minecraft, twitch, alias) is required.' },
      400
    )
  }

  let identifier: PlayerIdentifier

  if (minecraft) {
    identifier = { type: 'minecraft', value: minecraft }
  } else if (twitch) {
    identifier = { type: 'twitch', value: twitch }
  } else {
    identifier = { type: 'alias', value: alias! }
  }

  const apiKey = c.env.VAULT_REWARDS_API_KEY
  const player = await getPlayerRewards(identifier, apiKey)

  return c.json({ player })
})

export default players