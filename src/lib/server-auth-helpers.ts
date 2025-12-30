import { cookies } from 'next/headers'

/**
 * Server-side authentication helpers
 * These functions only work in server components and server actions
 */

/**
 * Get the current user's JWT token from cookies
 * Use this in server functions that need authentication
 */
export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('auth-token')?.value || null
}

/**
 * Get the current user data from cookies
 * Use this in server functions that need user information
 */
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user-id')?.value
  const email = cookieStore.get('user-email')?.value
  const username = cookieStore.get('user-username')?.value

  if (!userId) {
    return null
  }

  return {
    userId: parseInt(userId),
    email: email || '',
    username: username || '',
  }
}

/**
 * Check if user is authenticated
 * Use this in server functions or loaders that require authentication
 */
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized - Please login')
  }

  return user
}