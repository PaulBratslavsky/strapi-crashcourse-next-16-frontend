import qs from 'qs'
import type { TStrapiResponseCollection, IArticleDetail } from '@/types'
import { api } from '@/lib/api'
import { getStrapiURL } from '@/lib/utils'

const BASE_URL = getStrapiURL()
const PAGE_SIZE = 5

const getArticles = async (queryString?: string, page?: number, tag?: string) => {
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
        contentTags: {
          fields: ['title'],
        },
      },
      filters,
    },
    { encodeValuesOnly: true }
  )

  const response = await api.get<IArticleDetail[]>(`${BASE_URL}/api/articles?${query}`)

  return {
    data: response.data ?? [],
    meta: response.meta,
  } as TStrapiResponseCollection<IArticleDetail>
}

const getArticlesBySlug = async (slug: string) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
    },
    { encodeValuesOnly: true }
  )

  const response = await api.get<IArticleDetail[]>(`${BASE_URL}/api/articles?${query}`)

  return {
    data: response.data ?? [],
    meta: response.meta,
  } as TStrapiResponseCollection<IArticleDetail>
}

export const getArticlesData = async (params?: {
  data?: { query?: string; page?: number; tag?: string }
}): Promise<TStrapiResponseCollection<IArticleDetail>> => {
  const response = await getArticles(params?.data?.query, params?.data?.page, params?.data?.tag)
  return response
}

export const getArticlesDataBySlug = async (params: {
  data: string
}): Promise<TStrapiResponseCollection<IArticleDetail>> => {
  const response = await getArticlesBySlug(params.data)
  return response
}
