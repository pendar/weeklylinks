export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { getAvailableWeeks, getLatestWeekKeyFromDb } from '@/lib/data/cards'
import { getLatestWeekKey } from '@/lib/weeks'

export default async function Page() {
  try {
    // Get available weeks (sorted by newest first)
    const weeks = await getAvailableWeeks(1)
    console.log('Homepage redirect - available weeks:', weeks)
    
    if (weeks.length > 0) {
      console.log('Redirecting to most recent week with cards:', `/w/${weeks[0]}`)
      redirect(`/w/${weeks[0]}`)
    }
    
    // Fallback: redirect to current week if no cards exist
    const currentWeek = await getLatestWeekKey()
    console.log('No cards found, redirecting to current week:', `/w/${currentWeek}`)
    redirect(`/w/${currentWeek}`)
  } catch (error) {
    console.error('Error in homepage redirect:', error)
    // If all else fails, redirect to current week
    const currentWeek = await getLatestWeekKey()
    redirect(`/w/${currentWeek}`)
  }
}


