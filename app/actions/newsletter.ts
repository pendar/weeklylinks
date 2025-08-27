'use server'
import { z } from 'zod'

export interface SubscribeState { success?: boolean; error?: string }

const schema = z.object({ email: z.string().email() })

export async function subscribeNewsletter(_: SubscribeState, formData: FormData): Promise<SubscribeState> {
  try {
    const email = String(formData.get('email') || '')
    schema.parse({ email })
    // TODO: Persist to DB or ESP later
    return { success: true }
  } catch {
    return { error: 'Please enter a valid email.' }
  }
}


