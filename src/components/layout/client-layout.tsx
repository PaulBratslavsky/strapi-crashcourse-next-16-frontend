'use client'

import { ThemeProvider } from '@/components/custom/theme-provider'
import { TopNavigation } from '@/components/custom/top-navigation'
import { ScrollToTop } from '@/components/custom/scroll-to-top'
import { BuiltWithBanner } from '@/components/custom/built-with-banner'
import type { THeader, TAuthUser } from '@/types'

interface ClientLayoutProps {
  children: React.ReactNode
  header?: THeader
  currentUser?: TAuthUser | null
}

export function ClientLayout({ children, header, currentUser }: ClientLayoutProps) {
  // Convert TAuthUser to the format expected by TopNavigation
  const sessionUser = currentUser ? {
    userId: currentUser.id,
    email: currentUser.email,
    username: currentUser.username,
  } : null

  return (
    <ThemeProvider defaultTheme="light">
      <TopNavigation header={header} currentUser={sessionUser} />
      <main id="main-content" className="flex-1 overflow-y-auto">
        {children}
      </main>
      <ScrollToTop />
      <BuiltWithBanner />
    </ThemeProvider>
  )
}