/**
 * API route for OAuth provider connection
 * Redirects to Strapi's OAuth endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { getStrapiURL } from '@/lib/utils'

interface RouteParams {
  params: Promise<{ provider: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { provider } = await params
  const strapiUrl = getStrapiURL()

  // Redirect to Strapi's OAuth connect endpoint
  return NextResponse.redirect(`${strapiUrl}/api/connect/${provider}`)
}
