import type { TGlobal, TStrapiResponseSingle } from '@/types'
import { api } from '@/lib/api'
import { getStrapiURL } from '@/lib/utils'

const BASE_URL = getStrapiURL()

export const getGlobalData = async (): Promise<TStrapiResponseSingle<TGlobal>> => {
  const response = await api.get<TGlobal>(`${BASE_URL}/api/global`)

  return {
    data: response.data as TGlobal,
    meta: response.meta,
  }
}
