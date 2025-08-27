import { prisma } from '@/lib/prisma'
import { updateCard, deleteCard } from '../actions'
import { notFound } from 'next/navigation'

interface Params { params: { id: string } }

export default async function EditCardPage({ params }: Params) {
  const { id } = params
  const [card, categories] = await Promise.all([
    prisma.card.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!card) notFound()
  const toLocal = (d?: Date | null) => d ? new Date(d).toISOString().slice(0,16) : ''
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Edit Card</h1>
      <form action={updateCard} className="mb-4 grid gap-3 rounded-xl border p-4" encType="multipart/form-data">
        <input type="hidden" name="id" defaultValue={card.id} />
        <input name="title" defaultValue={card.title} placeholder="Title" required className="rounded-md border px-3 py-2" />
        <textarea name="description" defaultValue={card.description} placeholder="Description" className="min-h-20 rounded-md border px-3 py-2" />
        <div className="grid grid-cols-2 gap-3">
          <input name="sourceName" defaultValue={card.sourceName} placeholder="Source Name" className="rounded-md border px-3 py-2" />
          <input name="sourceUrl" defaultValue={card.sourceUrl} placeholder="Source URL" className="rounded-md border px-3 py-2" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <select name="categoryId" defaultValue={card.categoryId} className="rounded-md border px-3 py-2">
            {categories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          {/* Theme removed per request */}
          <div />
          <select name="status" defaultValue={card.status} className="rounded-md border px-3 py-2">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Background Image</label>
            <input 
              name="image" 
              type="file" 
              accept="image/*" 
              className="rounded-md border px-3 py-2 w-full"
              title="Upload a new background image (optional - will automatically set card to image type)"
            />
            {card.backgroundUrl && (
              <div className="mt-2 text-sm text-gray-600">
                Current: <span className="font-mono text-xs">...{card.backgroundUrl.slice(-20)}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Published At</label>
            <input name="publishedAt" type="datetime-local" defaultValue={toLocal(card.publishedAt)} className="rounded-md border px-3 py-2 w-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md bg-black px-3 py-2 text-white">Save</button>
        </div>
      </form>
      <form action={deleteCard} className="inline">
        <input type="hidden" name="id" value={card.id} />
        <button className="rounded-md border px-3 py-2">Delete</button>
      </form>
    </main>
  )
}


