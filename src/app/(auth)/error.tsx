'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Text } from '@/components/retroui/Text'
import { Button } from '@/components/retroui/Button'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Auth error:', error)
  }, [error])

  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="inline-block bg-[#FFB3BA] border-4 border-black px-4 py-2 rotate-1">
          <Text as="h3" className="font-bold">Authentication Error</Text>
        </div>
      </div>

      <Text className="text-muted-foreground mb-6">
        We encountered an issue with authentication. Please try again.
      </Text>

      <div className="flex flex-col gap-3">
        <Button onClick={reset} className="w-full">
          Try Again
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
