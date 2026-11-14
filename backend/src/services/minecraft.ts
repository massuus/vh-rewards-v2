import { MinecraftProfile } from '../types/minecraft'
import { cache } from './cache'

async function getMinecraftUUIDByUsername(username: string): Promise<string> {
    if (username.length < 3 || username.length > 16) {
        throw new Error(`Invalid Minecraft username: ${username}`)
    }

    const url = `https://api.minecraftservices.com/minecraft/profile/lookup/name/${encodeURIComponent(username)}`
    let response = await caches.default.match(url)
    const cacheMiss = !response
    response ??= await fetch(url)
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Minecraft username ${username} not found`)
        }
        throw new Error(`Failed to resolve Minecraft username ${username}: ${response.statusText}`)
    }
    const data = await response.json() as MinecraftProfile
    if (cacheMiss) {
        await cache(url, data, 86400)
    }
    return formatUUIDAddDash(data.id)
}
async function getMinecraftUsernameByUUID(uuid: string): Promise<string> {
    if (!/^[0-9a-fA-F]{32}$/.test(uuid) && !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid)) {
        throw new Error(`Invalid Minecraft UUID: ${uuid}`)
    }
    const url = `https://api.minecraftservices.com/minecraft/profile/lookup/${encodeURIComponent(formatUUIDRemoveDash(uuid).toLowerCase())}`
    let response = await caches.default.match(url)
    const cacheMiss = !response
    response ??= await fetch(url)
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Minecraft UUID ${uuid} not found`)
        }   
        throw new Error(`Failed to resolve Minecraft UUID ${uuid}: ${response.statusText}`)
    }
    const data = await response.json() as MinecraftProfile
    if (cacheMiss) {
        await cache(url, data, 86400)
    }
    return data.name
}

function formatUUIDAddDash(uuid: string): string {
  return uuid.replace(
    /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
    '$1-$2-$3-$4-$5'
  )
}
function formatUUIDRemoveDash(uuid: string): string {
  return uuid.replace(/-/g, '')
}
export { getMinecraftUUIDByUsername, getMinecraftUsernameByUUID }
