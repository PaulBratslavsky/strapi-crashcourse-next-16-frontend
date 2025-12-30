import { z } from 'zod'

export const GetCommentsSchema = z.object({
  articleDocumentId: z.string().min(1, 'Article ID is required'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(5),
  searchQuery: z.string().optional(),
})

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be 1000 characters or less'),
  articleId: z.string().min(1, 'Article ID is required'),
})

export const UpdateCommentSchema = z.object({
  commentDocumentId: z.string().min(1, 'Comment ID is required'),
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be 1000 characters or less'),
})

export const DeleteCommentSchema = z.object({
  commentDocumentId: z.string().min(1, 'Comment ID is required'),
})

export type GetCommentsInput = z.infer<typeof GetCommentsSchema>
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>
export type DeleteCommentInput = z.infer<typeof DeleteCommentSchema>
