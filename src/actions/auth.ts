'use server'

import { revalidatePath } from 'next/cache'
import { getAuth, clearAuth } from '@/lib/session'
import type { TAuthUser } from '@/types'

/**
 * Get current authenticated user session
 */
export async function getSession(): Promise<{ user: TAuthUser | null }> {
  try {
    const user = await getAuth()
    return { user }
  } catch (error) {
    console.error('Session validation error:', error)
    return { user: null }
  }
}

/**
 * Logout user and clear session
 */
export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    await clearAuth()
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'Failed to logout' }
  }
}
