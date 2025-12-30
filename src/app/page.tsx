import { getLandingPageData } from '@/lib/data-fetching'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import type { Metadata } from 'next'

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const landingPageData = await getLandingPageData()
  
  return {
    title: landingPageData.data.title || 'Home',
    description: landingPageData.data.description || 'Welcome to our website',
  }
}

export default async function Home() {
  const landingPageData = await getLandingPageData()
  
  return <BlockRenderer blocks={landingPageData.data.blocks} />
}
