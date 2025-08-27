export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getAdjacentWeeks } from '@/lib/weeks'
import { SpotlightFeed } from '@/components/spotlight-feed/spotlight-feed'
import { WeeklyNav } from '@/components/weekly-nav/weekly-nav'
import { SiteFooter } from '@/app/(site)/footer'
import { getAvailableWeeks, getCardsForWeek } from '@/lib/data/cards'

interface Params { params: { week: string } }

export default async function WeekPage({ params }: Params) {
  const { week } = params
  if (!/^\d{4}-\d{2}$/.test(week)) notFound()

  // Use actually available weeks from DB for navigation
  const weeks = await getAvailableWeeks(16)
  const dbCards = await getCardsForWeek(week)
  
  // If this week has no cards but other weeks exist, redirect to the first available week
  if (!dbCards.length && weeks.length > 0) {
    const { redirect } = await import('next/navigation')
    const targetWeek = weeks[0]
    console.log(`Week ${week} has no cards, redirecting to ${targetWeek}`)
    redirect(`/w/${targetWeek}`)
  }
  
  // If no weeks exist at all, this shouldn't happen but handle it gracefully
  if (!weeks.length) {
    const { redirect } = await import('next/navigation')
    redirect('/')
  }
  
  const cards = dbCards.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    sourceName: c.sourceName,
    sourceUrl: `/r/${c.id}`,
    category: c.category.name,
    type: c.type as 'solid' | 'gradient' | 'image',
    backgroundUrl: c.backgroundUrl || undefined,
    backgroundBlur: c.backgroundBlur || undefined
  }))
  
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <WeeklyNav weeks={weeks.map(key => ({ key, label: key }))} active={week} />
      <SpotlightFeed cards={cards} />
      <SiteFooter />
    </main>
  )
}


