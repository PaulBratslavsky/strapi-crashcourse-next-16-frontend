'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#F9F5F2',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#FFB3BA',
              border: '4px solid black',
              padding: '1rem 1.5rem',
              marginBottom: '2rem',
              transform: 'rotate(-2deg)',
            }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                Critical Error
              </h1>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Something went very wrong
            </h2>

            <p style={{ color: '#666', marginBottom: '2rem' }}>
              The application encountered a critical error. Please try refreshing the page.
            </p>

            {error.digest && (
              <p style={{
                fontSize: '0.75rem',
                color: '#999',
                marginBottom: '1rem',
                fontFamily: 'monospace',
              }}>
                Error ID: {error.digest}
              </p>
            )}

            <button
              onClick={reset}
              style={{
                backgroundColor: 'black',
                color: 'white',
                border: '3px solid black',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginRight: '1rem',
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => window.location.href = '/'}
              style={{
                backgroundColor: 'white',
                color: 'black',
                border: '3px solid black',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
