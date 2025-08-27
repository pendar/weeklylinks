import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  cookies().delete('nf_admin')
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL))
}



