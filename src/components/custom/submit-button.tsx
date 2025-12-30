'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/retroui/Button'
import { cn } from '@/lib/utils'

interface SubmitButtonProps {
  text: string
  loadingText: string
  className?: string
}

export function SubmitButton({ text, loadingText, className }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className={cn('w-full', className)}
      disabled={pending}
    >
      {pending ? loadingText : text}
    </Button>
  )
}
