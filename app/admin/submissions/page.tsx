import { prisma } from '@/lib/prisma'

export default async function SubmissionsPage() {
  const items = await prisma.submission.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Submissions</h1>
      <ul className="grid gap-3">
        {items.map(s => (
          <li key={s.id} className="rounded-md border p-3">
            <div className="text-xs opacity-70">{new Date(s.createdAt).toLocaleString()}</div>
            <a href={s.url} className="underline" target="_blank">{s.url}</a>
            <div className="text-sm opacity-80">{s.description}</div>
            {s.email && <div className="text-xs opacity-70">{s.email}</div>}
          </li>
        ))}
      </ul>
    </main>
  )
}


