import { Hono } from 'hono'
import type { Bindings } from './types/env'
import players from './routes/players'
import rewards from './routes/rewards'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

app.route('/api/players', players)

app.route('/api/rewards', rewards)

export default app