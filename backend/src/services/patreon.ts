import { PatreonData } from '../types/patreon'
import { cache } from './cache'

async function getUserPatreonDataByUUID(uuid: string): Promise<PatreonData> {
    const url = `https://api.vaulthunters.gg/users/reward?uuid=${encodeURIComponent(uuid)}`
    let response = await caches.default.match(url)
    const cacheMiss = !response
    response ??= await fetch(url)

    if (!response.ok) {
        throw new Error(
            `Failed to fetch Patreon data for UUID ${uuid}: ${response.status}`
        )
    }

    const data = await response.json() as PatreonData
    if (cacheMiss) {
        await cache(url, data, 86400)
    }
    return data
}

export { getUserPatreonDataByUUID }