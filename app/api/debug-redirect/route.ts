import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { toWeekKey } from '@/lib/weeks'

export async function GET() {
  try {
    const latestCard = await prisma.card.findFirst({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      select: { 
        id: true,
        title: true,
        publishedAt: true 
      }
    })
    
    const latestWeek = latestCard?.publishedAt ? toWeekKey(latestCard.publishedAt) : null
    
    return NextResponse.json({
      latestCard,
      latestWeek,
      shouldRedirectTo: latestWeek ? `/w/${latestWeek}` : 'fallback',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
