import qs from 'qs'
import type { TStrapiResponseCollection, TTag } from '@/types'
import { api } from '@/lib/api'
import { getStrapiURL } from '@/lib/utils'

const BASE_URL = getStrapiURL()

export const getTagsData = async (): Promise<TStrapiResponseCollection<TTag>> => {
  const query = qs.stringify(
    {
      sort: ['createdAt:desc'],
    },
    { encodeValuesOnly: true }
  )

  const response = await api.get<TTag[]>(`${BASE_URL}/api/tags?${query}`)

  return {
    data: response.data ?? [],
    meta: response.meta,
  } as TStrapiResponseCollection<TTag>
}
