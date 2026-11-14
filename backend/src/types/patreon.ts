interface PatreonData {
    uuid: string,
    tier: tier[],
    currentTier: tier
}


interface tier{
    name: string,
    id: string
}

export { PatreonData }