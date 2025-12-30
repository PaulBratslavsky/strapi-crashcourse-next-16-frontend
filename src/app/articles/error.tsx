'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Text } from '@/components/retroui/Text'
import { Button } from '@/components/retroui/Button'

export default function ArticlesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Articles error:', error)
  }, [error])

  const isStrapiError = error.message?.includes('Strapi') ||
                        error.message?.includes('fetch') ||
                        error.message?.includes('ECONNREFUSED')

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-block bg-[#E7F193] border-4 border-black px-6 py-3 rotate-1">
            <Text as="h1" className="text-3xl font-bold">Articles Error</Text>
          </div>
        </div>

        <Text as="h2" className="mb-4">
          {isStrapiError ? 'Unable to load articles' : 'Something went wrong'}
        </Text>

        <Text className="text-muted-foreground mb-8">
          {isStrapiError
            ? 'The content server might be unavailable. Please try again in a moment.'
            : 'We encountered an error while loading the articles. Please try again.'
          }
        </Text>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
