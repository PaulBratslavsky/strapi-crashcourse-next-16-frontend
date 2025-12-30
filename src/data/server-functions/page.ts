import qs from 'qs'
import type { TPage } from '@/types'
import { api } from '@/lib/api'
import { getStrapiURL } from '@/lib/utils'

const BASE_URL = getStrapiURL()

export const getPageData = async (params: { data: string }): Promise<{ data: TPage | undefined }> => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: params.data,
        },
      },
    },
    { encodeValuesOnly: true }
  )

  const response = await api.get<TPage[]>(`${BASE_URL}/api/pages?${query}`)
  const data = response.data as TPage[] | undefined

  return { data: data?.[0] }
}
