'use cache'

import { cacheLife, cacheTag } from 'next/cache'
import { strapiApi } from '@/data/server-functions'
import type {
  TLandingPage,
  TStrapiResponseCollection,
  IArticleDetail,
  TCourse,
  TLesson
} from '@/types'

// Cache functions for server components using Next.js 16 'use cache' directive
// These functions are cached across requests with configurable cache lifetimes

/**
 * Helper to wrap fetch errors with a user-friendly message
 */
function handleFetchError(error: unknown, context: string): never {
  if (error instanceof Error && error.cause && typeof error.cause === 'object' && 'code' in error.cause) {
    if ((error.cause as { code: string }).code === 'ECONNREFUSED') {
      throw new Error(
        `Failed to fetch ${context}: Strapi server is not running. ` +
        `Please start the Strapi server at http://localhost:1337 before building.`
      )
    }
  }
  throw error
}

/**
 * Get landing page data with caching
 * Landing page content changes infrequently - cache for 1 hour
 */
export async function getLandingPageData(): Promise<{ data: TLandingPage }> {
  'use cache'
  cacheLife('hours')
  cacheTag('landing-page')

  try {
    return await strapiApi.landingPage.getLandingPageData()
  } catch (error) {
    handleFetchError(error, 'landing page data')
  }
}

/**
 * Get articles data with caching
 * Articles are updated more frequently - cache for 30 minutes
 */
export async function getArticlesData(params?: {
  query?: string
  page?: number
  tag?: string
}): Promise<TStrapiResponseCollection<IArticleDetail>> {
  'use cache'
  cacheLife('minutes')
  cacheTag('articles', `articles-page-${params?.page || 1}`)

  try {
    return await strapiApi.articles.getArticlesData({ data: params })
  } catch (error) {
    handleFetchError(error, 'articles data')
  }
}

/**
 * Get single article by slug with caching
 */
export async function getArticleBySlug(slug: string): Promise<TStrapiResponseCollection<IArticleDetail>> {
  'use cache'
  cacheLife('hours')
  cacheTag('articles', `article-${slug}`)

  try {
    return await strapiApi.articles.getArticlesDataBySlug({ data: slug })
  } catch (error) {
    handleFetchError(error, `article "${slug}"`)
  }
}

/**
 * Get courses data with caching
 * Courses are relatively stable - cache for 1 hour
 */
export async function getCoursesData(params?: {
  query?: string
  page?: number
  tag?: string
}): Promise<TStrapiResponseCollection<TCourse>> {
  'use cache'
  cacheLife('hours')
  cacheTag('courses', `courses-page-${params?.page || 1}`)

  try {
    return await strapiApi.courses.getCoursesData({ data: params })
  } catch (error) {
    handleFetchError(error, 'courses data')
  }
}

/**
 * Get single course by slug with caching
 */
export async function getCourseBySlug(slug: string): Promise<TStrapiResponseCollection<TCourse>> {
  'use cache'
  cacheLife('hours')
  cacheTag('courses', `course-${slug}`)

  try {
    return await strapiApi.courses.getCoursesDataBySlug({ data: slug })
  } catch (error) {
    handleFetchError(error, `course "${slug}"`)
  }
}

/**
 * Get lesson by slug with caching
 */
export async function getLessonBySlug(slug: string): Promise<TStrapiResponseCollection<TLesson>> {
  'use cache'
  cacheLife('hours')
  cacheTag('lessons', `lesson-${slug}`)

  try {
    return await strapiApi.courses.getLessonDataBySlug({ data: slug })
  } catch (error) {
    handleFetchError(error, `lesson "${slug}"`)
  }
}

/**
 * Get global data with caching
 * Global data (navigation, footer) changes rarely - cache for 2 hours
 */
export async function getGlobalData() {
  'use cache'
  cacheLife('max')
  cacheTag('global')

  try {
    return await strapiApi.global.getGlobalData()
  } catch (error) {
    handleFetchError(error, 'global data')
  }
}

/**
 * Get page data by slug with caching
 */
export async function getPageData(slug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('pages', `page-${slug}`)

  try {
    return await strapiApi.page.getPageData({ data: slug })
  } catch (error) {
    handleFetchError(error, `page "${slug}"`)
  }
}

/**
 * Get tags data with caching
 */
export async function getTagsData() {
  'use cache'
  cacheLife('hours')
  cacheTag('tags')

  try {
    return await strapiApi.tags.getTagsData()
  } catch (error) {
    handleFetchError(error, 'tags data')
  }
}
