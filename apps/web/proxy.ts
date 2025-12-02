import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value

  // 1. Redirect logged-in users away from Login page
  if (request.nextUrl.pathname === '/login') {
    if (token && role) {
       if (role === 'SDM') return NextResponse.redirect(new URL('/dashboard/sdm', request.url))
       if (role === 'ADMIN') return NextResponse.redirect(new URL('/dashboard/admin', request.url))
       return NextResponse.redirect(new URL('/dashboard/pegawai', request.url))
    }
  }

  // 2. Protect dashboard routes (Server-side check)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
}
