export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <form action={async (formData) => {
        'use server'
        const pass = String(formData.get('password') || '')
        const res = pass && pass === process.env.ADMIN_PASSWORD
        const { cookies, headers } = await import('next/headers')
        if (res) cookies().set('nf_admin', '1', { httpOnly: false, path: '/' })
        else cookies().delete('nf_admin')
        const next = String(formData.get('next') || '/admin')
        const { redirect } = await import('next/navigation')
        redirect(res ? next : '/admin/login?error=1')
      }} className="grid w-[360px] gap-3 rounded-2xl border p-6 shadow-sm">
        <h1 className="mb-2 text-lg font-medium">Admin login</h1>
        <input name="password" type="password" placeholder="Password" className="rounded-md border px-3 py-2" required />
        <input name="next" type="hidden" defaultValue="/admin" />
        <button className="rounded-md bg-black px-3 py-2 text-white">Login</button>
        <p className="text-xs opacity-70">Set env ADMIN_PASSWORD to enable.</p>
      </form>
    </main>
  )
}



