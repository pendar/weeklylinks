import { prisma } from '@/lib/prisma'
import { toWeekKey } from '@/lib/weeks'

export async function getAvailableWeeks(limit = 16): Promise<string[]> {
  const cards = await prisma.card.findMany({
    where: { status: 'published' },
    select: { publishedAt: true },
    orderBy: { publishedAt: 'desc' }
  })
  
  // Group by week key using JavaScript
  const weekMap = new Map<string, Date>()
  cards.forEach(card => {
    if (card.publishedAt) {
      const weekKey = toWeekKey(card.publishedAt)
      if (!weekMap.has(weekKey) || card.publishedAt > weekMap.get(weekKey)!) {
        weekMap.set(weekKey, card.publishedAt)
      }
    }
  })
  
  // Sort by latest date and return week keys
  const sortedWeeks = Array.from(weekMap.entries())
    .sort(([, a], [, b]) => b.getTime() - a.getTime())
    .map(([weekKey]) => weekKey)
    .slice(0, limit)
  
  if (!sortedWeeks.length) {
    return [toWeekKey(new Date(Date.now() - 7 * 86400000))]
  }
  
  return sortedWeeks
}

export async function getLatestWeekKeyFromDb(): Promise<string | null> {
  try {
    const latestCard = await prisma.card.findFirst({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      select: { publishedAt: true }
    })
    
    if (!latestCard?.publishedAt) return null
    
    const weekKey = toWeekKey(latestCard.publishedAt)
    console.log('Latest week key calculated:', weekKey, 'from date:', latestCard.publishedAt)
    
    return weekKey
  } catch (error) {
    console.error('Error in getLatestWeekKeyFromDb:', error)
    return null
  }
}

export async function getCardsForWeek(weekKey: string) {
  const cards = await prisma.card.findMany({
    where: { status: 'published' },
    include: { 
      category: true 
    },
    orderBy: { publishedAt: 'desc' }
  })
  
  // Filter cards that belong to the specified week
  const weekCards = cards.filter(card => {
    if (!card.publishedAt) return false
    const cardWeekKey = toWeekKey(card.publishedAt)
    return cardWeekKey === weekKey
  })
  
  console.log(`Found ${weekCards.length} cards for week ${weekKey}`)
  
  return weekCards
}


