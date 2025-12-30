'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send } from 'lucide-react'
import type { CurrentUser } from '@/lib/comment-auth'
import { Button } from '@/components/retroui/Button'
import { Text } from '@/components/retroui/Text'
import { Avatar } from '@/components/retroui/Avatar'
import { handleAuthError, isAuthenticated } from '@/lib/comment-auth'
import { cn } from '@/lib/utils'
import { createComment } from '@/actions/comments'

interface CommentFormProps {
  readonly articleDocumentId: string
  readonly currentUser?: CurrentUser | null
  readonly onSuccess?: () => void
  readonly placeholder?: string
  readonly className?: string
}

export function CommentForm({
  articleDocumentId,
  currentUser,
  onSuccess,
  placeholder = "What are your thoughts?",
  className = ""
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('Comment cannot be empty')
      return
    }

    if (content.length > 1000) {
      setError('Comment must be 1000 characters or less')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const result = await createComment({
        content: content.trim(),
        articleId: articleDocumentId,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      setContent('')
      setError(null)
      onSuccess?.()
    } catch (err) {
      setError(handleAuthError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show authentication prompt for unauthenticated users
  if (!isAuthenticated(currentUser)) {
    return (
      <div className={`bg-white border-2 border-black p-4 text-center ${className}`}>
        <Text className="text-muted-foreground mb-4">
          Please sign in to join the conversation
        </Text>
        <div className="flex gap-3 justify-center">
          
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    )
  }

  const characterCount = content.length
  const isOverLimit = characterCount > 1000
  const isNearLimit = characterCount > 900

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-3">
        {/* User Avatar */}
        <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-black bg-[#C4A1FF]">
          <Avatar.Fallback className="bg-[#C4A1FF] text-black font-bold">
            {(currentUser?.username || 'U').charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar>

        {/* Input Area */}
        <div className="flex-1">
          <div className={cn(
            "border-2 border-black rounded shadow-md transition",
            "focus-within:shadow-sm",
            isOverLimit && "border-red-500"
          )}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full px-4 py-3 resize-none focus:outline-none placeholder:text-muted-foreground"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center px-4 py-2 border-t border-black/10 text-sm">
              <div>
                {error && (
                  <span className="text-red-600 font-medium">
                    {error}
                  </span>
                )}
              </div>
              <span className={cn(
                isOverLimit
                  ? 'text-red-600 font-medium'
                  : isNearLimit
                    ? 'text-yellow-600'
                    : 'text-muted-foreground'
              )}>
                {characterCount}/1000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Send Button */}
      <div className="flex justify-end mt-3">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !content.trim() || isOverLimit}
          className={cn(
            (isSubmitting || !content.trim() || isOverLimit) &&
              "opacity-50 cursor-not-allowed hover:translate-y-0 active:translate-y-0"
          )}
        >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <Send className="w-5 h-5 mr-2" />
        )}
        {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  )
}
