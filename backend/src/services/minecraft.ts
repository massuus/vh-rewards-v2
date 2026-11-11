async function resolveMinecraftUsername(username: string): Promise<string> {
    const url = `https://api.minecraftservices.com/minecraft/profile/lookup/name/${encodeURIComponent(username)}`
    const response = await fetch(url.toString())
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Minecraft username ${username} not found`)
        }
        throw new Error(`Failed to resolve Minecraft username ${username}: ${response.statusText}`)
    }
    const data = await response.json()
    return formatUUID(data.id)
}
function formatUUID(uuid: string): string {
  return uuid.replace(
    /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
    '$1-$2-$3-$4-$5'
  )
}
export { resolveMinecraftUsername }