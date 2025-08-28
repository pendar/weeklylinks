import { NextResponse } from 'next/server'
import { getAvailableWeeks, getLatestWeekKeyFromDb } from '@/lib/data/cards'
import { getLatestWeekKey, toWeekKey } from '@/lib/weeks'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all published cards with their week keys
    const cards = await prisma.card.findMany({
      where: { status: 'published' },
      select: { 
        id: true,
        title: true, 
        publishedAt: true 
      },
      orderBy: { publishedAt: 'desc' }
    })
    
    const cardsWithWeeks = cards.map(card => ({
      ...card,
      weekKey: card.publishedAt ? toWeekKey(card.publishedAt) : null
    }))
    
    const dbLatest = await getLatestWeekKeyFromDb()
    const availableWeeks = await getAvailableWeeks(5)
    const currentWeek = await getLatestWeekKey()
    
    return NextResponse.json({
      currentWeek,
      dbLatest,
      availableWeeks,
      totalCards: cards.length,
      cardsWithWeeks: cardsWithWeeks.slice(0, 10), // Show first 10
      today: new Date().toISOString(),
      todayWeekKey: toWeekKey(new Date())
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
