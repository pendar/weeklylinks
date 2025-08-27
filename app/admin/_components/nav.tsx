'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/cards', label: 'Cards' },
  { href: '/admin/submissions', label: 'Submissions' },
  { href: '/admin/queue', label: 'Queue' }
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <div className="font-semibold">Nomofomo Admin</div>
        <ul className="flex items-center gap-4 text-sm">
          {links.map(l => {
            const active = pathname === l.href || pathname?.startsWith(l.href + '/')
            return (
              <li key={l.href}>
                <Link href={l.href} className={`rounded-md px-2 py-1 ${active ? 'bg-black text-white' : 'hover:bg-black/5'}`}>{l.label}</Link>
              </li>
            )
          })}
          <li>
            <a href="/admin/logout" className="rounded-md px-2 py-1 hover:bg-black/5">Logout</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}


