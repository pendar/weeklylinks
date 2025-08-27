import { prisma } from '@/lib/prisma'
import { deleteCard, createCard } from './actions'
import { CardForm } from './_components/card-form'

export default async function CardsPage() {
  const [categories, cards] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.card.findMany({ orderBy: [{ publishedAt: 'desc' }], take: 20 })
  ])
  return (
    <main className="mx-auto max-w-4xl p-8">
      <CardForm 
        categories={categories} 
        onSubmit={createCard}
        submitButtonText="Create"
        title="Create New Card"
      />

      <ul className="grid gap-3">
        {cards.map(c => (
          <li key={c.id} className="flex items-center justify-between rounded-md border p-3">
            <a href={`/admin/cards/${c.id}`} className="flex-1">
              <div className="text-sm opacity-70">{c.sourceName}</div>
              <div className="text-lg font-medium underline">{c.title}</div>
              <div className="text-xs opacity-70">{c.status} · {new Date(c.publishedAt ?? new Date()).toLocaleString()}</div>
            </a>
            <div className="flex items-center gap-2">
              <form action={deleteCard}><input type="hidden" name="id" value={c.id} /><button className="rounded-md border px-2 py-1">Delete</button></form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}


