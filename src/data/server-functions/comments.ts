import qs from 'qs'

import type {
  TComment,
  TCommentCreate,
  TCommentResponse,
  TCommentSingleResponse,
  TCommentUpdate,
} from '@/types'

import { getAuth } from '@/lib/session'
import { getAuthToken } from '@/lib/server-auth-helpers'
import { api } from '@/lib/api'
import { getStrapiURL } from '@/lib/utils'

const BASE_URL = getStrapiURL()

// Get comments for a specific article (public access)
const getCommentsForArticleInternal = async (
  articleDocumentId: string,
  page: number = 1,
  pageSize: number = 5,
  searchQuery?: string
): Promise<TCommentResponse> => {
  const query = qs.stringify(
    {
      filters: {
        articleId: {
          $eq: articleDocumentId,
        },
        ...(searchQuery &&
          searchQuery.trim() && {
            $or: [
              {
                user: {
                  username: {
                    $containsi: searchQuery.trim(),
                  },
                },
              },
              {
                content: {
                  $containsi: searchQuery.trim(),
                },
              },
            ],
          }),
      },
      populate: {
        user: {
          fields: ['username', 'email'],
        },
      },
      pagination: {
        page,
        pageSize,
      },
      sort: ['createdAt:desc'],
    },
    { encodeValuesOnly: true }
  )

  const response = await api.get<TComment[]>(
    `${BASE_URL}/api/comments/custom/get-comments?${query}`
  )

  return {
    data: response.data ?? [],
    meta: response.meta,
  } as TCommentResponse
}

// Create a new comment
const createCommentInternal = async (
  commentData: TCommentCreate,
  jwt: string
): Promise<TCommentSingleResponse> => {
  if (!commentData.content) {
    throw new Error('Comment content is required')
  }

  if (!commentData.articleId) {
    throw new Error('Article reference is required')
  }

  const response = await api.post<TComment>(
    `${BASE_URL}/api/comments/custom/create-comment`,
    {
      data: {
        content: commentData.content,
        articleId: commentData.articleId,
      },
    },
    { authToken: jwt }
  )

  return {
    data: response.data as TComment,
    meta: response.meta,
  }
}

// Update a comment
const updateCommentInternal = async (
  commentDocumentId: string,
  commentData: TCommentUpdate,
  jwt: string
): Promise<TCommentSingleResponse> => {
  const response = await api.put<TComment>(
    `${BASE_URL}/api/comments/${commentDocumentId}`,
    {
      data: {
        content: commentData.content,
      },
    },
    { authToken: jwt }
  )

  return {
    data: response.data as TComment,
    meta: response.meta,
  }
}

// Delete a comment
const deleteCommentInternal = async (
  commentDocumentId: string,
  jwt: string
): Promise<TCommentSingleResponse> => {
  await api.delete(`${BASE_URL}/api/comments/${commentDocumentId}`, {
    authToken: jwt,
  })

  return {
    data: {
      id: 0,
      documentId: commentDocumentId,
      content: '',
      articleId: '',
      createdAt: '',
      updatedAt: '',
    },
    meta: {},
  }
}

// Server function to get comments for an article
export const getCommentsForArticle = async (data: {
  articleDocumentId: string
  page?: number
  pageSize?: number
  searchQuery?: string
}): Promise<TCommentResponse> => {
  const response = await getCommentsForArticleInternal(
    data.articleDocumentId,
    data.page,
    data.pageSize,
    data.searchQuery
  )
  return response
}

// Server function to create a comment
export const createComment = async (
  commentData: TCommentCreate
): Promise<TCommentSingleResponse | { error: string }> => {
  const user = await getAuth()

  if (!user) {
    return { error: 'Authentication required' }
  }

  const jwt = await getAuthToken()

  if (!jwt) {
    return { error: 'Authentication token not found' }
  }

  try {
    const response = await createCommentInternal(commentData, jwt)
    return response
  } catch (error) {
    console.error('Error creating comment:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create comment',
    }
  }
}

// Server function to update a comment
export const updateComment = async (data: {
  commentDocumentId: string
  commentData: TCommentUpdate
}): Promise<TCommentSingleResponse | { error: string }> => {
  const user = await getAuth()

  if (!user) {
    return { error: 'Authentication required' }
  }

  const jwt = await getAuthToken()

  if (!jwt) {
    return { error: 'Authentication token not found' }
  }

  try {
    const response = await updateCommentInternal(
      data.commentDocumentId,
      data.commentData,
      jwt
    )
    return response
  } catch (error) {
    console.error('Error updating comment:', error)
    return { error: 'Failed to update comment' }
  }
}

// Server function to delete a comment
export const deleteComment = async (
  commentDocumentId: string
): Promise<TCommentSingleResponse | { error: string }> => {
  const user = await getAuth()

  if (!user) {
    return { error: 'Authentication required' }
  }

  const jwt = await getAuthToken()

  if (!jwt) {
    return { error: 'Authentication token not found' }
  }

  try {
    const response = await deleteCommentInternal(commentDocumentId, jwt)
    return response
  } catch (error) {
    console.error('Error deleting comment:', error)
    return { error: 'Failed to delete comment' }
  }
}
