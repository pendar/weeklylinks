'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitLink } from '@/app/actions/submission'

export function SubmissionModal() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="hover:opacity-70">Submission</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[999999] bg-black/20" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[999999] w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
          <Dialog.Title className="mb-4 text-lg font-medium">Submit a link</Dialog.Title>
          <form action={submitLink} className="grid gap-3">
            <input name="url" required placeholder="URL" className="rounded-md border px-3 py-2" />
            <textarea name="description" required placeholder="Why is this interesting?" className="min-h-28 rounded-md border px-3 py-2" />
            <input name="email" type="email" placeholder="Email (optional)" className="rounded-md border px-3 py-2" />
            <div className="mt-2 flex justify-end gap-2">
              <Dialog.Close className="rounded-md border px-3 py-1">Cancel</Dialog.Close>
              <SubmitButton />
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending} className="rounded-md bg-black px-3 py-1 text-white">{pending ? '…' : 'Send'}</button>
}


