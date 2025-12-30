'use client'

import { useState } from 'react'

export function TestErrorButton() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('Test error from navigation button!')
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <button
      onClick={() => setShouldError(true)}
      className="text-red-500 hover:underline underline-offset-4 decoration-red-500 decoration-2 text-sm"
    >
      [Test Error]
    </button>
  )
}
