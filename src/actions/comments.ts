'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { strapiApi } from '@/data/server-functions'
import { getAuth } from '@/lib/session'
import type { TCommentResponse, TComment } from '@/types'
import {
  GetCommentsSchema,
  CreateCommentSchema,
  UpdateCommentSchema,
  DeleteCommentSchema,
} from '@/data/validation/comments'

export interface ActionResponse<T> {
  data: T | null
  error?: string
  zodErrors?: Record<string, string[]>
}

/**
 * Get comments for an article
 */
export async function getComments(
  input: z.input<typeof GetCommentsSchema>
): Promise<ActionResponse<TCommentResponse>> {
  const validatedFields = GetCommentsSchema.safeParse(input)

  if (!validatedFields.success) {
    const flattenedErrors = validatedFields.error.flatten()
    return {
      data: null,
      error: 'Validation failed',
      zodErrors: flattenedErrors.fieldErrors as Record<string, string[]>,
    }
  }

  const { articleDocumentId, page, pageSize, searchQuery } = validatedFields.data

  try {
    const comments = await strapiApi.comments.getCommentsForArticle({
      articleDocumentId,
      page,
      pageSize,
      searchQuery,
    })

    return { data: comments }
  } catch (error) {
    console.error('Error fetching comments:', error)
    return { data: null, error: 'Failed to fetch comments' }
  }
}

/**
 * Create a new comment
 */
export async function createComment(
  input: z.input<typeof CreateCommentSchema>
): Promise<ActionResponse<TComment>> {
  const validatedFields = CreateCommentSchema.safeParse(input)

  if (!validatedFields.success) {
    const flattenedErrors = validatedFields.error.flatten()
    return {
      data: null,
      error: 'Validation failed',
      zodErrors: flattenedErrors.fieldErrors as Record<string, string[]>,
    }
  }

  const user = await getAuth()
  if (!user) {
    return { data: null, error: 'Authentication required' }
  }

  const { content, articleId } = validatedFields.data

  try {
    const result = await strapiApi.comments.createComment({
      content: content.trim(),
      articleId,
    })

    if ('error' in result) {
      return { data: null, error: result.error }
    }

    revalidatePath('/articles')
    return { data: result.data }
  } catch (error) {
    console.error('Error creating comment:', error)
    return { data: null, error: 'Failed to create comment' }
  }
}

/**
 * Update an existing comment
 */
export async function updateComment(
  input: z.input<typeof UpdateCommentSchema>
): Promise<ActionResponse<TComment>> {
  const validatedFields = UpdateCommentSchema.safeParse(input)

  if (!validatedFields.success) {
    const flattenedErrors = validatedFields.error.flatten()
    return {
      data: null,
      error: 'Validation failed',
      zodErrors: flattenedErrors.fieldErrors as Record<string, string[]>,
    }
  }

  const user = await getAuth()
  if (!user) {
    return { data: null, error: 'Authentication required' }
  }

  const { commentDocumentId, content } = validatedFields.data

  try {
    const result = await strapiApi.comments.updateComment({
      commentDocumentId,
      commentData: { content: content.trim() },
    })

    if ('error' in result) {
      return { data: null, error: result.error }
    }

    revalidatePath('/articles')
    return { data: result.data }
  } catch (error) {
    console.error('Error updating comment:', error)
    return { data: null, error: 'Failed to update comment' }
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(
  commentDocumentId: string
): Promise<{ success: boolean; error?: string; zodErrors?: Record<string, string[]> }> {
  const validatedFields = DeleteCommentSchema.safeParse({ commentDocumentId })

  if (!validatedFields.success) {
    const flattenedErrors = validatedFields.error.flatten()
    return {
      success: false,
      error: 'Validation failed',
      zodErrors: flattenedErrors.fieldErrors as Record<string, string[]>,
    }
  }

  const user = await getAuth()
  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    const result = await strapiApi.comments.deleteComment(validatedFields.data.commentDocumentId)

    if ('error' in result) {
      return { success: false, error: result.error }
    }

    revalidatePath('/articles')
    return { success: true }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return { success: false, error: 'Failed to delete comment' }
  }
}
