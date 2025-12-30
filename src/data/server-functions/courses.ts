import qs from 'qs'
import type { TCourse, TLesson, TStrapiResponseCollection } from '@/types'
import { api } from '@/lib/api'
import { getStrapiURL } from '@/lib/utils'

const BASE_URL = getStrapiURL()
const PAGE_SIZE = 5

const getCourses = async (queryString?: string, page?: number, tag?: string) => {
  const filterConditions: Array<Record<string, unknown>> = []

  if (queryString) {
    filterConditions.push({
      $or: [
        { title: { $containsi: queryString } },
        { content: { $containsi: queryString } },
      ],
    })
  }

  if (tag) {
    filterConditions.push({
      contentTags: {
        title: { $containsi: tag },
      },
    })
  }

  const filters =
    filterConditions.length === 0
      ? undefined
      : filterConditions.length === 1
        ? filterConditions[0]
        : { $and: filterConditions }

  const query = qs.stringify(
    {
      sort: ['createdAt:desc'],
      pagination: {
        page: page || 1,
        pageSize: PAGE_SIZE,
      },
      populate: {
        image: {
          fields: ['url', 'alternativeText'],
        },
      },
      filters,
    },
    { encodeValuesOnly: true }
  )

  const response = await api.get<TCourse[]>(
    `${BASE_URL}/api/strapi-plugin-lms/courses?${query}`
  )

  return {
    data: response.data ?? [],
    meta: response.meta,
  } as TStrapiResponseCollection<TCourse>
}

const getCoursesBySlug = async (slug: string) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        image: {
          fields: ['url', 'alternativeText'],
        },
        lessons: {
          fields: ['title', 'description', 'slug', 'videoId', 'videoUrl', 'videoTimecode'],
        },
      },
    },
    { encodeValuesOnly: true }
  )

  const response = await api.get<TCourse[]>(
    `${BASE_URL}/api/strapi-plugin-lms/courses?${query}`
  )

  return {
    data: response.data ?? [],
    meta: response.meta,
  } as TStrapiResponseCollection<TCourse>
}

export const getCoursesData = async (params?: {
  data?: { query?: string; page?: number; tag?: string }
}): Promise<TStrapiResponseCollection<TCourse>> => {
  const response = await getCourses(params?.data?.query, params?.data?.page, params?.data?.tag)
  return response
}

export const getCoursesDataBySlug = async (params: {
  data: string
}): Promise<TStrapiResponseCollection<TCourse>> => {
  const response = await getCoursesBySlug(params.data)
  return response
}

const getLessonBySlug = async (slug: string) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        course: {
          fields: ['title', 'slug'],
        },
      },
    },
    { encodeValuesOnly: true }
  )

  const response = await api.get<TLesson[]>(
    `${BASE_URL}/api/strapi-plugin-lms/lessons?${query}`
  )

  return {
    data: response.data ?? [],
    meta: response.meta,
  } as TStrapiResponseCollection<TLesson>
}

export const getLessonDataBySlug = async (params: {
  data: string
}): Promise<TStrapiResponseCollection<TLesson>> => {
  const response = await getLessonBySlug(params.data)
  return response
}
