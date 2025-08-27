'use client'
import { useState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createCard } from '../actions'

interface Category {
  id: string
  name: string
}

interface Props {
  categories: Category[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="rounded-md bg-black px-3 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Creating...' : 'Create'}
    </button>
  )
}

export function CreateCardForm({ categories }: Props) {
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    const result = await createCard(null, formData)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success) {
      setMessage({ type: 'success', text: 'Card created successfully!' })
      formRef.current?.reset()
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mb-8 grid gap-3 rounded-xl border p-4" encType="multipart/form-data">
      {message?.type === 'error' && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-800 text-sm">
          {message.text}
        </div>
      )}
      
      {message?.type === 'success' && (
        <div className="rounded-md bg-green-50 border border-green-200 p-3 text-green-800 text-sm">
          {message.text}
        </div>
      )}

      <input 
        name="title" 
        placeholder="Title" 
        required 
        minLength={3}
        className="rounded-md border px-3 py-2" 
      />
      
      <textarea 
        name="description" 
        placeholder="Description" 
        required
        minLength={6}
        className="min-h-20 rounded-md border px-3 py-2" 
      />
      
      <div className="grid grid-cols-2 gap-3">
        <input 
          name="sourceName" 
          placeholder="Source Name" 
          required
          className="rounded-md border px-3 py-2" 
        />
        <input 
          name="sourceUrl" 
          placeholder="Source URL" 
          type="url"
          required
          className="rounded-md border px-3 py-2" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <select name="categoryId" required className="rounded-md border px-3 py-2">
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select name="status" className="rounded-md border px-3 py-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <input 
          name="backgroundUrl" 
          type="url" 
          placeholder="Background Image URL (optional)" 
          className="rounded-md border px-3 py-2"
          title="Enter a URL for background image (will automatically set card to image type)"
        />
        <input 
          name="publishedAt" 
          type="datetime-local" 
          className="rounded-md border px-3 py-2" 
        />
      </div>
      
      <SubmitButton />
    </form>
  )
}
