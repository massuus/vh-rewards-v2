async function cache(url: string, data: unknown, maxAgeSeconds: number = 3600): Promise<void> {
  try {
    await caches.default.put(url, Response.json(data, {
      headers: { 'Cache-Control': `public, max-age=${maxAgeSeconds}` }
    }))
  } catch (error) {
    console.error(`Failed to cache data for ${url}`, error)
  }
}

export { cache }