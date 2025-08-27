export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { getAvailableWeeks, getLatestWeekKeyFromDb } from '@/lib/data/cards'
import { getLatestWeekKey } from '@/lib/weeks'

export default async function Page() {
  try {
    // First try to get the latest week from DB
    const dbLatest = await getLatestWeekKeyFromDb()
    if (dbLatest) {
      redirect(`/w/${dbLatest}`)
    }
    
    // Fallback: get available weeks and redirect to the first one
    const weeks = await getAvailableWeeks(1)
    if (weeks.length > 0) {
      redirect(`/w/${weeks[0]}`)
    }
    
    // Last resort: redirect to current week
    const currentWeek = await getLatestWeekKey()
    redirect(`/w/${currentWeek}`)
  } catch (error) {
    console.error('Error in homepage redirect:', error)
    // If all else fails, redirect to current week
    const currentWeek = await getLatestWeekKey()
    redirect(`/w/${currentWeek}`)
  }
}


