'use server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({ url: z.string().url(), description: z.string().min(5), email: z.string().email().optional() })

export async function submitLink(_: unknown, formData: FormData) {
  try {
    const input = schema.parse({
      url: String(formData.get('url') || ''),
      description: String(formData.get('description') || ''),
      email: String(formData.get('email') || '') || undefined
    })
    await prisma.submission.create({ data: input })
    return { success: true }
  } catch {
    return { error: 'Please provide a valid URL and description.' }
  }
}



