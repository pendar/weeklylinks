import type { ReactNode } from 'react'
import { AdminNav } from './_components/nav'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen admin-layout">
      <AdminNav />
      {children}
    </div>
  )
}



