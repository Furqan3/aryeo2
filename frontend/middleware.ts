import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionToken = request.cookies.get('authjs.session-token') ||
                       request.cookies.get('__Secure-authjs.session-token')

  const isAuthenticated = !!sessionToken

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users to login when accessing root
  if (pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Optional: if authenticated and hitting root, no need to do anything special
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|build).*)'],
}