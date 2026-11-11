import { Hono } from 'hono'
import type { Bindings } from '../types/env'
import { GetAllRewards } from '../services/vaultRewards'

const rewards = new Hono<{ Bindings: Bindings }>()

rewards.get('/', async (c) => {
    const allRewards = await GetAllRewards();
    return c.json({ rewards: allRewards })
})

export default rewards