import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('should handle conditional classes', () => {
    expect(cn('base-class', true && 'conditional-class')).toBe(
      'base-class conditional-class',
    )
    expect(cn('base-class', false && 'conditional-class')).toBe('base-class')
  })
})
