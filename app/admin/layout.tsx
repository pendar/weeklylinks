import type { ReactNode } from 'react'
import { AdminNav } from './_components/nav'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminNav />
      {children}
    </div>
  )
}



