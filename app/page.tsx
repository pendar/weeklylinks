export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { getAvailableWeeks, getLatestWeekKeyFromDb } from '@/lib/data/cards'
import { getLatestWeekKey } from '@/lib/weeks'

export default async function Page() {
  // For now, let's force redirect to the week with most recent cards
  // Based on debug data, your cards are in 2025-34
  redirect('/w/2025-34')
}


