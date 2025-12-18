import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check both secure and non-secure variants (Auth.js uses authjs prefix)
  const sessionToken = request.cookies.get('authjs.session-token') ||
                       request.cookies.get('__Secure-authjs.session-token')

  const isAuthenticated = !!sessionToken

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')

  // Redirect authenticated users away from auth pages to main page
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users to login (only from root if they're not authenticated)
  if (pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|build).*)'],
}