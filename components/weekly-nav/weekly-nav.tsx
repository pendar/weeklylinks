import Link from 'next/link'

interface Props { weeks: { key: string; label: string }[]; active: string }

export function WeeklyNav({ weeks, active }: Props) {
  const idx = weeks.findIndex(w => w.key === active)
  const prev = idx >= 0 && idx + 1 < weeks.length ? weeks[idx + 1] : null
  const next = idx > 0 ? weeks[idx - 1] : null
  

  return (
    <div className="pointer-events-auto absolute inset-x-0 top-3 sm:top-4 z-50 flex items-center justify-between px-4 sm:px-6">
      <div className="text-xs sm:text-sm text-muted">{active}</div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link 
          aria-disabled={!prev} 
          className={`rounded-full border px-2 sm:px-3 py-1 text-xs sm:text-sm ${!prev ? 'opacity-40 pointer-events-none' : ''}`} 
          href={prev ? `/w/${prev.key}` : '#'}
        >
          <span className="hidden sm:inline">← Older</span>
          <span className="sm:hidden">←</span>
        </Link>
        <Link 
          aria-disabled={!next} 
          className={`rounded-full border px-2 sm:px-3 py-1 text-xs sm:text-sm ${!next ? 'opacity-40 pointer-events-none' : ''}`} 
          href={next ? `/w/${next.key}` : '#'}
        >
          <span className="hidden sm:inline">Newer →</span>
          <span className="sm:hidden">→</span>
        </Link>
      </div>
    </div>
  )
}


