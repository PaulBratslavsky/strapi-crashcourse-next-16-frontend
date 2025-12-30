/**
 * Dynamic page route - migrated from TanStack Start
 */
import { getPageData } from '@/lib/data-fetching'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface DynamicPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const pageData = await getPageData(slug)
    return {
      title: pageData.data?.title || slug,
      description: pageData.data?.description || `Page: ${slug}`,
    }
  } catch {
    return {
      title: slug,
    }
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params

  try {
    const pageData = await getPageData(slug)

    if (!pageData.data) {
      notFound()
    }

    return <BlockRenderer blocks={pageData.data.blocks || []} />
  } catch {
    notFound()
  }
}