'use client'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { subscribeNewsletter } from '@/app/actions/newsletter'

export function NewsletterForm() {
  const [message, setMessage] = useState<string>('')
  const action = async (formData: FormData) => {
    const res = await subscribeNewsletter({}, formData)
    if (res?.success) setMessage('Thanks!')
    else setMessage(res?.error || 'Please enter a valid email.')
  }
  return (
    <form action={action} className="flex items-center gap-2 rounded-full bg-black/5 px-4 py-2">
      <input
        name="email"
        type="email"
        required
        placeholder="Email newsletter"
        className="w-[220px] bg-transparent outline-none placeholder:text-black/40"
      />
      <Submit />
      {message && <span className="ml-2 text-xs opacity-80">{message}</span>}
    </form>
  )
}

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} className="rounded-full bg-black px-3 py-1 text-white">
      {pending ? '…' : '→'}
    </button>
  )
}


