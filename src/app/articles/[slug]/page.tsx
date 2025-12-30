import { getArticleBySlug } from '@/lib/data-fetching'
import { Article } from '@/components/custom/article'
import { CommentSection } from '@/components/custom/comment-section'
import { getAuth } from '@/lib/session'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const articleData = await getArticleBySlug(slug)
  
  if (!articleData.data || articleData.data.length === 0) {
    return {
      title: 'Article Not Found',
    }
  }

  const article = articleData.data[0]
  
  return {
    title: article.title,
    description: article.description || `Read ${article.title}`,
    openGraph: {
      title: article.title,
      description: article.description || `Read ${article.title}`,
      type: 'article',
      images: article.featuredImage?.url ? [article.featuredImage.url] : [],
    },
  }
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const [articleData, currentUser] = await Promise.all([
    getArticleBySlug(slug),
    getAuth(),
  ])

  if (!articleData.data || articleData.data.length === 0) {
    notFound()
  }

  const article = articleData.data[0]

  return (
    <>
      <Article {...article} />
      <div className="mt-12">
        <CommentSection
          articleDocumentId={article.documentId}
          currentUser={currentUser}
        />
      </div>
    </>
  )
}