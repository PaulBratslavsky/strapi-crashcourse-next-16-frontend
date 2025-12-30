'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Text } from '@/components/retroui/Text'
import { Button } from '@/components/retroui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-block bg-[#FFB3BA] border-4 border-black px-6 py-3 -rotate-2">
            <Text as="h1" className="text-4xl font-bold">Oops!</Text>
          </div>
        </div>

        <Text as="h2" className="mb-4">Something went wrong</Text>

        <Text className="text-muted-foreground mb-8">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </Text>

        {error.digest && (
          <Text className="text-xs text-muted-foreground mb-4 font-mono">
            Error ID: {error.digest}
          </Text>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
