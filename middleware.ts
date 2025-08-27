import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  if (!isAdminPath) return NextResponse.next()

  // allow login page
  if (request.nextUrl.pathname.startsWith('/admin/login')) return NextResponse.next()

  const cookie = request.cookies.get('nf_admin')?.value
  if (cookie === '1') return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = '/admin/login'
  url.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*']
}



