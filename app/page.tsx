export const dynamic = 'force-dynamic'
export const revalidate = 0
import { redirect } from 'next/navigation'
import { getLatestWeekKey, toWeekKey } from '@/lib/weeks'
import { prisma } from '@/lib/prisma'

export default async function Page() {
  try {
    // Get the most recent published card to determine the latest week
    const latestCard = await prisma.card.findFirst({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      select: { publishedAt: true }
    })
    
    if (latestCard?.publishedAt) {
      const latestWeek = toWeekKey(latestCard.publishedAt)
      console.log('Redirecting to latest week:', latestWeek)
      redirect(`/w/${latestWeek}`)
    }
    
    // Fallback: redirect to current week if no cards exist
    const currentWeek = await getLatestWeekKey()
    redirect(`/w/${currentWeek}`)
  } catch (error) {
    console.error('Error in homepage redirect:', error)
    // If all else fails, redirect to current week
    const currentWeek = await getLatestWeekKey()
    redirect(`/w/${currentWeek}`)
  }
}


