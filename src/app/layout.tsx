import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Roboto } from 'next/font/google'
import './globals.css'
import { ClientLayout } from '@/components/layout/client-layout'
import { getGlobalData } from '@/lib/data-fetching'
import { getAuth } from '@/lib/session'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})

export async function generateMetadata(): Promise<Metadata> {
  try {
    const globalData = await getGlobalData()
    return {
      title: globalData.data.title || 'TanStack Start Starter',
      description: globalData.data.description || 'A modern web application built with Next.js and Strapi',
    }
  } catch {
    return {
      title: 'TanStack Start Starter',
      description: 'A modern web application built with Next.js and Strapi',
    }
  }
}

async function LayoutContent({ children }: { children: React.ReactNode }) {
  let header = undefined
  let currentUser = null

  try {
    const globalData = await getGlobalData()
    header = globalData.data.header
    currentUser = await getAuth()
  } catch (error) {
    console.error('Error loading global data:', error)
  }

  return (
    <ClientLayout header={header} currentUser={currentUser}>
      {children}
    </ClientLayout>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${roboto.variable} h-screen flex flex-col overflow-hidden font-sans`}>
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  )
}
