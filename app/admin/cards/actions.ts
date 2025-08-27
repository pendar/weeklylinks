'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { saveUploadToPublic } from '@/lib/images'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(6, 'Description must be at least 6 characters long'),
  sourceName: z.string().min(1, 'Source name is required'),
  sourceUrl: z.string().url('Please enter a valid URL'),
  categoryId: z.string().min(1, 'Please select a category'),
  status: z.enum(['draft', 'published']).default('draft'),
  position: z.coerce.number().default(0),
  publishedAt: z.coerce.date().optional()
})

export async function createCard(prevState: any, formData: FormData) {
  try {
    const input = schema.parse({
      title: String(formData.get('title') || ''),
      description: String(formData.get('description') || ''),
      sourceName: String(formData.get('sourceName') || ''),
      sourceUrl: String(formData.get('sourceUrl') || ''),
      categoryId: String(formData.get('categoryId') || ''),
      status: (String(formData.get('status') || 'draft') as 'draft'|'published'),
      position: Number(formData.get('position') || 0),
      publishedAt: formData.get('publishedAt') ? new Date(String(formData.get('publishedAt'))) : new Date()
    })
    
    // Handle image upload and auto-determine type
    let backgroundUrl: string | undefined
    let backgroundBlur: string | undefined
    let type = 'solid' // default type
    
    const file = formData.get('image') as unknown as File | null
    if (file && file.size > 0) {
      const saved = await saveUploadToPublic(file)
      backgroundUrl = saved.url
      backgroundBlur = saved.blurDataUrl
      type = 'image' // auto-set to image when background is uploaded
    }
    
    await prisma.card.create({ data: { ...input, type, colorScheme: 'light', backgroundUrl, backgroundBlur } })
    revalidatePath('/admin/cards')
    return { success: true }
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { error: `Validation failed: ${errors}` }
    }
    return { error: 'Failed to create card. Please check your input and try again.' }
  }
}

export async function updateCard(formData: FormData) {
  try {
    const id = String(formData.get('id') || '')
    const input = schema.parse({
      title: String(formData.get('title') || ''),
      description: String(formData.get('description') || ''),
      sourceName: String(formData.get('sourceName') || ''),
      sourceUrl: String(formData.get('sourceUrl') || ''),
      categoryId: String(formData.get('categoryId') || ''),
      status: (String(formData.get('status') || 'draft') as 'draft'|'published'),
      position: Number(formData.get('position') || 0),
      publishedAt: formData.get('publishedAt') ? new Date(String(formData.get('publishedAt'))) : new Date()
    })

    // Get current card to check existing background
    const currentCard = await prisma.card.findUnique({ where: { id } })
    if (!currentCard) throw new Error('Card not found')

    // Handle image upload and auto-determine type
    let backgroundUrl = currentCard.backgroundUrl
    let backgroundBlur = currentCard.backgroundBlur
    let type = currentCard.type
    
    const file = formData.get('image') as unknown as File | null
    if (file && file.size > 0) {
      // New image uploaded
      const saved = await saveUploadToPublic(file)
      backgroundUrl = saved.url
      backgroundBlur = saved.blurDataUrl
      type = 'image'
    } else if (backgroundUrl) {
      // Keep existing image, ensure type is 'image'
      type = 'image'
    } else {
      // No image, set to solid
      type = 'solid'
      backgroundUrl = null
      backgroundBlur = null
    }

    await prisma.card.update({ 
      where: { id }, 
      data: { ...input, type, backgroundUrl, backgroundBlur } 
    })
    revalidatePath('/admin/cards')
    return { success: true }
  } catch (e) {
    return { error: 'Unable to update card' }
  }
}

export async function deleteCard(formData: FormData) {
  try {
    const id = String(formData.get('id') || '')
    await prisma.card.delete({ where: { id } })
    revalidatePath('/admin/cards')
  } catch (e) {
    console.error('Failed to delete card:', e)
    throw new Error('Unable to delete card')
  }
  // Redirect to cards list after successful deletion
  const { redirect } = await import('next/navigation')
  redirect('/admin/cards')
}

function getISOWeekRange(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - day + 3)
  const start = new Date(d)
  start.setUTCDate(start.getUTCDate() - 3) // back to Monday
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 7)
  return { start, end }
}

export async function moveCard(_: unknown, formData: FormData) {
  try {
    const id = String(formData.get('id') || '')
    const dir = String(formData.get('dir') || 'up') // 'up' or 'down'
    const card = await prisma.card.findUnique({ where: { id } })
    if (!card?.publishedAt) return { error: 'Card not found' }
    const { start, end } = getISOWeekRange(card.publishedAt)
    const siblings = await prisma.card.findMany({
      where: { status: 'published', publishedAt: { gte: start, lt: end } },
      orderBy: { position: 'asc' }
    })
    const index = siblings.findIndex(s => s.id === id)
    if (index < 0) return { error: 'Not in list' }
    const targetIndex = dir === 'up' ? Math.max(0, index - 1) : Math.min(siblings.length - 1, index + 1)
    if (targetIndex === index) return { success: true }
    const a = siblings[index]
    const b = siblings[targetIndex]
    await prisma.$transaction([
      prisma.card.update({ where: { id: a.id }, data: { position: b.position } }),
      prisma.card.update({ where: { id: b.id }, data: { position: a.position } })
    ])
    revalidatePath('/admin/cards')
    return { success: true }
  } catch (e) {
    return { error: 'Unable to reorder' }
  }
}


