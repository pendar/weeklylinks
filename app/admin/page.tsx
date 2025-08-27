import Link from 'next/link'

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Admin</h1>
      <div className="grid gap-4">
        <Link className="rounded-md border p-4 hover:bg-black/5" href="/admin/cards">Cards</Link>
        <Link className="rounded-md border p-4 hover:bg-black/5" href="/admin/queue">Queue</Link>
        <Link className="rounded-md border p-4 hover:bg-black/5" href="/admin/submissions">Submissions</Link>
      </div>
    </main>
  )
}



