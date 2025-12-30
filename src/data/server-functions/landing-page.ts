import type { TLandingPage } from '@/types'
import { api } from '@/lib/api'
import { getStrapiURL } from '@/lib/utils'

const BASE_URL = getStrapiURL()

export const getLandingPageData = async (): Promise<{ data: TLandingPage }> => {
  const response = await api.get<TLandingPage>(`${BASE_URL}/api/landing-page`)

  return { data: response.data as TLandingPage }
}
