import { Hono } from 'hono'
import type { Bindings } from '../types/env'
import type { PlayerIdentifier } from '../types/player'
import { getPlayerRewards } from '../services/players'
import { SuggestionRequest } from '../types/suggestion'

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

  try {
    const player = await getPlayerRewards(identifier, apiKey)
    return c.json({ player })
  } 
  catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    } else {
      return c.json({ error: 'An unknown error occurred.' }, 500)
    }
  }
})

players.query('/suggestions', async (c) => {
  let body: SuggestionRequest
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Request body must be valid JSON.' }, 400)
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return c.json({ error: 'Request body must be a JSON object.' }, 400)
  }

  const {
    query,
    limit = 5,
    fields = ['minecraft', 'twitch', 'alias'],
  } = body as SuggestionRequest
  if (!query) {
    return c.json({ error: 'Query parameter is required.' }, 400)
  }
  
  if (limit <= 0 || limit > 25) {
    return c.json({ error: 'Limit must be between 1 and 25.' }, 400)
  }

  if (!fields.every(f => ['minecraft', 'twitch', 'alias'].includes(f))) {
    return c.json({ error: 'Invalid fields parameter. Allowed values are minecraft, twitch, alias.' }, 400)
  }
  const normalizedQuery = query.trim().toLowerCase()
  if (normalizedQuery.length < 2) {
    return c.json({ players: [] })
  }
  return c.json({ query: normalizedQuery, limit, fields })
})


export default players