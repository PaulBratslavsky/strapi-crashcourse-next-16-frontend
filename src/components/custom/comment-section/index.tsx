'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageCircle } from 'lucide-react'

import { CommentFeedItem } from './comment-feed-item'
import { CommentForm } from './comment-form'
import type { CurrentUser } from '@/lib/comment-auth'
import { CommentPagination } from '@/components/custom/comment-section/comment-pagination'
import { CommentSearch } from '@/components/custom/comment-section/comment-search'

import { Text } from '@/components/retroui/Text'
import { Button } from '@/components/retroui/Button'
import type { TCommentResponse } from '@/types'
import { getComments } from '@/actions/comments'

interface CommentSectionProps {
  readonly articleDocumentId: string
  readonly currentUser?: CurrentUser | null
  readonly className?: string
}

export function CommentSection({
  articleDocumentId,
  currentUser,
  className = '',
}: CommentSectionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [commentsResponse, setCommentsResponse] = useState<TCommentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const pageSize = 5

  const loadComments = useCallback(async (showLoadingState = false) => {
    if (!articleDocumentId) return

    if (showLoadingState) {
      setIsLoading(true)
    } else {
      setIsFetching(true)
    }
    setError(null)

    try {
      const result = await getComments({
        articleDocumentId,
        page: currentPage,
        pageSize,
        searchQuery: searchQuery || undefined,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      setCommentsResponse(result.data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'))
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }, [articleDocumentId, currentPage, searchQuery])

  useEffect(() => {
    loadComments(true)
  }, [loadComments])

  const refetch = useCallback(() => {
    loadComments(false)
  }, [loadComments])

  const handleSearch = (term: string) => {
    setSearchQuery(term)
    setCurrentPage(1)
  }

  const comments = commentsResponse?.data || []
  const pagination = commentsResponse?.meta?.pagination
  const totalComments = pagination?.total || 0
  const totalPages = pagination?.pageCount || 1

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className={`border-4 border-black bg-white ${className}`}>
            {/* Header Skeleton */}
            <div className="bg-[#C4A1FF] border-b-4 border-black p-4">
              <div className="h-6 w-32 bg-black/20 rounded" />
            </div>
            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className={`border-4 border-black bg-white ${className}`}>
            {/* Header */}
            <div className="bg-[#C4A1FF] border-b-4 border-black p-4">
              <Text as="h4" className="text-black">Discussion</Text>
            </div>
            {/* Error Content */}
            <div className="p-8 text-center">
              <Text className="text-red-600 mb-4">
                Failed to load comments: {error.message}
              </Text>
              <Button onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className={`border-4 border-black bg-white ${className}`}>
          {/* Header */}
          <div className="bg-[#C4A1FF] border-b-4 border-black p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-black" />
              <Text as="h4" className="text-black">
                Discussion ({totalComments})
              </Text>
            </div>
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-black/70">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="border-b-4 border-black p-4 bg-[#F9F5F2]">
            <CommentSearch onSearch={handleSearch} />
            {searchQuery.length > 0 && (
              <Text className="text-sm text-muted-foreground mt-2">
                Showing results for &quot;{searchQuery}&quot;
              </Text>
            )}
          </div>

          {/* Comments Feed - Chat Style */}
          <div className="min-h-[300px] max-h-[500px] overflow-y-auto bg-white">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center px-6">
                <div className="w-16 h-16 bg-[#E7F193] border-2 border-black rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-black" />
                </div>
                <Text className="text-muted-foreground">
                  {searchQuery ? (
                    <>No comments found matching &quot;{searchQuery}&quot;</>
                  ) : (
                    <>No comments yet. Be the first to comment!</>
                  )}
                </Text>
              </div>
            ) : (
              <div className="divide-y-2 divide-dashed divide-black/20">
                {comments.map((comment) => (
                  <CommentFeedItem
                    key={comment.documentId}
                    comment={comment}
                    currentUser={currentUser}
                    onUpdate={refetch}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t-4 border-black p-4 bg-[#F9F5F2]">
              <CommentPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* Comment Input - Bottom */}
          <div className="border-t-4 border-black p-4 bg-[#E7F193]">
            <CommentForm
              articleDocumentId={articleDocumentId}
              currentUser={currentUser}
              onSuccess={() => {
                refetch()
                setCurrentPage(1)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
