import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  cookies().delete('nf_admin')
  const url = new URL('/admin/login', request.url)
  return NextResponse.redirect(url)
}



