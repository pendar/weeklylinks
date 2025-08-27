import { prisma } from '@/lib/prisma'
import { updateCard, deleteCard } from '../actions'
import { notFound } from 'next/navigation'
import { CardForm } from '../_components/card-form'

interface Params { params: { id: string } }

export default async function EditCardPage({ params }: Params) {
  const { id } = params
  const [card, categories] = await Promise.all([
    prisma.card.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!card) notFound()

  return (
    <main className="mx-auto max-w-4xl p-8">
      <CardForm 
        categories={categories}
        card={card}
        onSubmit={updateCard}
        submitButtonText="Save Changes"
        title="Edit Card"
      />
      
      <form action={deleteCard} className="inline">
        <input type="hidden" name="id" value={card.id} />
        <button className="rounded-md border px-3 py-2 text-red-600 hover:bg-red-50">Delete Card</button>
      </form>
    </main>
  )
}


