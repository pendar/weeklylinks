export interface WeekInfo { key: string; label: string }

function getISOWeek(d: Date): { year: number; week: number } {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNr = (date.getUTCDay() + 6) % 7
  date.setUTCDate(date.getUTCDate() - dayNr + 3)
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4))
  const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86400000 - 3) / 7)
  const year = date.getUTCFullYear()
  return { year, week }
}

export function toWeekKey(d: Date): string {
  const { year, week } = getISOWeek(d)
  return `${year}-${String(week).padStart(2, '0')}`
}

export async function getLatestWeekKey(): Promise<string> {
  // For now, without DB, latest is current ISO week minus 1 ("last week's links")
  const now = new Date()
  const lastWeek = new Date(now)
  lastWeek.setDate(now.getDate() - 7)
  return toWeekKey(lastWeek)
}

export function getAdjacentWeeks(key: string, count = 8): WeekInfo[] {
  const [yearStr, weekStr] = key.split('-')
  const baseYear = Number(yearStr)
  const baseWeek = Number(weekStr)
  const list: WeekInfo[] = []
  for (let i = 0; i < count; i++) {
    const w = baseWeek - i
    const date = new Date(Date.UTC(baseYear, 0, 4))
    date.setUTCDate(date.getUTCDate() + (w - 1) * 7)
    const k = toWeekKey(date)
    list.push({ key: k, label: k })
  }
  return list
}



