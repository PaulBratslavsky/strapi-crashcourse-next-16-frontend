/**
 * Client-side authentication helpers
 * These functions call Server Actions for auth operations
 */

import { getSession, logout } from '@/actions/auth'

/**
 * Get authentication status using Server Action
 * Use this in client components that need to check auth status
 */
export async function getAuthStatus() {
  try {
    const result = await getSession()
    return result.user
  } catch (error) {
    console.error('Error checking auth status:', error)
    return null
  }
}

/**
 * Logout user using Server Action
 * Use this in client components for logout functionality
 * Returns true if logout was successful, false otherwise
 * The calling component should handle navigation using useRouter
 */
export async function logoutUser(): Promise<boolean> {
  try {
    const result = await logout()
    return result.success
  } catch (error) {
    console.error('Error logging out:', error)
    return false
  }
}
