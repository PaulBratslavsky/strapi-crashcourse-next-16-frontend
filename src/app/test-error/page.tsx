'use client'

import { useState } from 'react'
import { Text } from '@/components/retroui/Text'
import { Button } from '@/components/retroui/Button'

export default function TestErrorPage() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('This is a test error to verify the error boundary is working correctly!')
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-20">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-block bg-[#FFB3BA] border-4 border-black px-6 py-3 rotate-1">
            <Text as="h1" className="text-3xl font-bold">Error Test Page</Text>
          </div>
        </div>

        <Text className="text-muted-foreground mb-8">
          Click the button below to trigger a test error and see the custom error page.
        </Text>

        <Button
          onClick={() => setShouldError(true)}
          className="bg-red-500 hover:bg-red-600"
        >
          Trigger Error
        </Button>
      </div>
    </div>
  )
}
