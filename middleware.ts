import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Routes that require authentication
const protectedRoutes = [
  '/protected-example',
  // Add more protected routes as needed
]

// Routes that should redirect to home if user is already authenticated
const authRoutes = [
  '/auth/signin',
  '/auth/signup',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get auth token from cookies
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')?.value
  const isAuthenticated = !!authToken

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}