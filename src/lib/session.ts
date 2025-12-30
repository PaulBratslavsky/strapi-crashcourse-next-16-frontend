import { cookies } from 'next/headers'
import type { TAuthUser } from '@/types'
import { api } from '@/lib/api'
import { getStrapiURL } from '@/lib/utils'

// Cache for validated user data to avoid hitting Strapi on every request
const authCache = new Map<string, { user: TAuthUser; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

const BASE_URL = getStrapiURL()

/**
 * Set authentication cookies
 */
export async function setAuthCookies(user: TAuthUser, jwt: string) {
  const cookieStore = await cookies()

  cookieStore.set('auth-token', jwt, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  cookieStore.set('user-id', user.id.toString(), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  cookieStore.set('user-email', user.email, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  cookieStore.set('user-username', user.username, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

/**
 * Get authenticated user by validating the session JWT with Strapi
 */
export async function getAuth(): Promise<TAuthUser | null> {
  let jwt: string | undefined

  try {
    const cookieStore = await cookies()
    jwt = cookieStore.get('auth-token')?.value
  } catch {
    // cookies() throws during prerendering - return null (not logged in)
    return null
  }

  // No JWT in session = not logged in
  if (!jwt) return null

  // Check cache first
  const cached = authCache.get(jwt)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user
  }

  // Validate with Strapi using api utility
  try {
    const response = await api.get<TAuthUser>(`${BASE_URL}/api/users/me`, {
      authToken: jwt,
    })

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch user')
    }

    const user = response.data

    // Success: cache and return user
    authCache.set(jwt, { user, timestamp: Date.now() })

    return user
  } catch (error) {
    // Invalid token or network error
    console.error('Auth validation error:', error)

    // If we have cached data, return it during network issues
    if (cached) {
      return cached.user
    }

    // Invalid token: clear session and cache
    authCache.delete(jwt)
    await clearAuth()
    return null
  }
}

/**
 * Clear authentication session and cache
 */
export async function clearAuth(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const jwt = cookieStore.get('auth-token')?.value

    if (jwt) {
      authCache.delete(jwt)
    }

    // Clear all auth cookies
    cookieStore.delete('auth-token')
    cookieStore.delete('user-id')
    cookieStore.delete('user-email')
    cookieStore.delete('user-username')
  } catch {
    // cookies() throws during prerendering - nothing to clear
  }
}
