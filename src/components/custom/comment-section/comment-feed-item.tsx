'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import type { TComment } from '@/types'
import type { CurrentUser } from '@/lib/comment-auth'
import { Button } from '@/components/retroui/Button'
import { Avatar } from '@/components/retroui/Avatar'
import { Text } from '@/components/retroui/Text'
import { cn } from '@/lib/utils'
import { updateComment, deleteComment } from '@/actions/comments'

interface CommentFeedItemProps {
  readonly comment: TComment
  readonly currentUser?: CurrentUser | null
  readonly onUpdate?: () => void
}

// Color palette for avatars based on username
const avatarColors = [
  'bg-[#C4A1FF]', // Purple
  'bg-[#E7F193]', // Lime
  'bg-[#C4FF83]', // Green
  'bg-[#FFB3BA]', // Coral Pink
  'bg-[#A1D4FF]', // Sky Blue
  'bg-[#FFDAA1]', // Peach
] as const

function getAvatarColor(username: string): string {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % avatarColors.length
  return avatarColors[index]
}

export function CommentFeedItem({
  comment,
  currentUser,
  onUpdate,
}: CommentFeedItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOwner = currentUser?.id === comment.user?.id
  const username = comment.user?.username || 'Unknown User'
  const avatarColor = getAvatarColor(username)

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setError(null)

    try {
      const result = await updateComment({
        commentDocumentId: comment.documentId,
        content: editContent,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      setIsEditing(false)
      onUpdate?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteComment(comment.documentId)

      if (result.error) {
        throw new Error(result.error)
      }

      onUpdate?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-4 hover:bg-muted/30 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className={cn("w-10 h-10 flex-shrink-0 border-2 border-black", avatarColor)}>
          <Avatar.Fallback className={cn(avatarColor, "text-black font-bold")}>
            {username.charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Text className="font-bold text-sm">
              {username}
            </Text>
            <span className="text-xs text-muted-foreground">•</span>
            <Text className="text-xs text-muted-foreground">{timeAgo}</Text>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm mb-2">{error}</div>
          )}

          {/* Comment Content */}
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-3">
              <textarea
                name="content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-[#C4A1FF] resize-none"
                rows={3}
                disabled={isUpdating}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdating || !editContent.trim()}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(comment.content)
                    setError(null)
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Text className="text-sm text-foreground whitespace-pre-wrap break-words">
              {comment.content}
            </Text>
          )}

          {/* Actions */}
          {isOwner && !isEditing && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                disabled={isDeleting}
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-muted-foreground hover:text-red-600 flex items-center gap-1 transition-colors"
                disabled={isDeleting}
              >
                <Trash2 className="w-3 h-3" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
