'use client'
import { useState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createCard } from '../actions'
import { UploadButton } from '@uploadthing/react'

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
  const [imageUrl, setImageUrl] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    
    // Add the uploaded image URL to the form data
    if (imageUrl) {
      formData.set('backgroundUrl', imageUrl)
    }
    
    const result = await createCard(null, formData)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success) {
      setMessage({ type: 'success', text: 'Card created successfully!' })
      formRef.current?.reset()
      setImageUrl('')
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
        <div>
          <label className="block text-sm font-medium mb-1">Background Image</label>
          {imageUrl ? (
            <div className="space-y-2">
              <img src={imageUrl} alt="Uploaded" className="w-full h-20 object-cover rounded-md border" />
              <button 
                type="button"
                onClick={() => setImageUrl('')}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove image
              </button>
            </div>
          ) : (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) {
                  setImageUrl(res[0].url)
                }
              }}
              onUploadError={(error: Error) => {
                setMessage({ type: 'error', text: `Upload failed: ${error.message}` })
              }}
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Published At</label>
          <input 
            name="publishedAt" 
            type="datetime-local" 
            className="rounded-md border px-3 py-2 w-full" 
          />
        </div>
      </div>
      
      <SubmitButton />
    </form>
  )
}
