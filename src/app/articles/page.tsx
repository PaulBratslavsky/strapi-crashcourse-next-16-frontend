import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getArticlesData, getTagsData } from '@/lib/data-fetching'
import { PaginationComponent } from '@/components/custom/pagination-component'
import { Search } from '@/components/custom/search'
import { StrapiImage } from '@/components/custom/strapi-image'
import { Text } from '@/components/retroui/Text'
import { Badge } from '@/components/retroui/Badge'
import { ClientTags } from '@/components/custom/client-tags'
import type { Metadata } from 'next'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Articles',
  description: 'Browse our collection of articles and blog posts',
}

const tagColors = [
  "bg-[#C4A1FF] text-black",
  "bg-[#E7F193] text-black",
  "bg-[#C4FF83] text-black",
  "bg-[#FFB3BA] text-black",
  "bg-[#A1D4FF] text-black",
  "bg-[#FFDAA1] text-black",
] as const;

function getTagColor(tagName: string): string {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return `${diffDays} Days Ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} Weeks Ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} Months Ago`;
  return `${Math.floor(diffDays / 365)} Years Ago`;
}

interface ArticlesPageProps {
  searchParams: Promise<{
    query?: string
    page?: string
    tag?: string
  }>
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page, 10) : 1
  const query = params.query
  const tag = params.tag

  const [articlesData, tagsData] = await Promise.all([
    getArticlesData({ query, page, tag }),
    getTagsData(),
  ])

  const articles = articlesData.data || []
  const totalPages = articlesData.meta?.pagination?.pageCount || 1
  const tags = tagsData.data || []

  const featuredPost = articles.length > 0 ? articles[0] : null
  const mainPosts = articles.slice(1)

  return (
    <section className="py-24 bg-white">
      <div className="container max-w-5xl px-4 mx-auto">
        {/* Header with Search */}
        <div className="mb-12">
          <Text as="h2" className="mb-4">
            Latest Articles
          </Text>
          <div className="flex flex-col gap-6 my-10">
            <Search className="w-full" placeholder="Search articles..." />
            <ClientTags tags={tags} className="justify-center" />
          </div>
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-12">
            <Text as="h3" className="mb-2">
              No Articles Found
            </Text>
            <Text className="text-muted-foreground">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </Text>
          </div>
        )}

        {/* Featured Post */}
        {featuredPost?.slug && (
          <Link
            href={`/articles/${featuredPost.slug}`}
            className="block"
          >
            <article className="bg-card grid grid-cols-1 md:grid-cols-2 md:gap-8 border-2 border-black group transition-all mb-8">
              <div className="relative overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-black h-64 md:h-auto">
                {featuredPost.featuredImage && (
                  <StrapiImage
                    src={featuredPost.featuredImage.url}
                    alt={
                      featuredPost.featuredImage.alternativeText ||
                      featuredPost.title ||
                      "Featured article"
                    }
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="p-8 md:pl-0">
                <div className="flex items-center gap-4 mb-4">
                  {featuredPost.contentTags?.[0] && (
                    <Badge size="sm" className={`${getTagColor(featuredPost.contentTags[0].title)} border-2 border-black`}>
                      {featuredPost.contentTags[0].title}
                    </Badge>
                  )}
                  <span className="text-[#C4A1FF] text-2xl">•</span>
                  <Text className="text-sm font-medium">
                    {formatDate(featuredPost.publishedAt)}
                  </Text>
                </div>
                <Text as="h3" className="mb-2 font-sans">
                  {featuredPost.title}
                </Text>
                <Text className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {featuredPost.description}
                </Text>

                <div className="flex items-center justify-between bg-[#C4A1FF] border-2 border-black px-2">
                  <Text className="text-sm font-medium text-black">
                    {formatDate(featuredPost.publishedAt)}
                  </Text>
                  <span className="border-x-2 border-black px-3 py-1 bg-background flex items-center gap-2 font-medium text-sm text-black">
                    Read Full
                    <ArrowRight
                      size={16}
                      className="group-hover:-rotate-45 transition-transform duration-300"
                    />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Main Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {mainPosts.map((post) => {
            if (!post.slug) return null;
            return (
              <Link
                key={post.documentId}
                href={`/articles/${post.slug}`}
                className="block"
              >
                <article className="bg-card border-2 border-black group transition-all">
                  <div className="relative h-64 overflow-hidden border-b-2 border-black">
                    {post.featuredImage && (
                      <StrapiImage
                        src={post.featuredImage.url}
                        alt={
                          post.featuredImage.alternativeText ||
                          post.title ||
                          "Article"
                        }
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      {post.contentTags?.[0] && (
                        <Badge size="sm" className={`${getTagColor(post.contentTags[0].title)} border-2 border-black`}>
                          {post.contentTags[0].title}
                        </Badge>
                      )}
                      <span className="text-[#C4A1FF] text-2xl">•</span>
                      <Text className="text-sm font-medium">
                        {formatDate(post.publishedAt)}
                      </Text>
                    </div>
                    <Text as="h3" className="mb-3 font-sans">
                      {post.title}
                    </Text>
                    <Text className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {post.description}
                    </Text>
                    <div className="flex items-center justify-between bg-[#C4A1FF] border-2 border-black px-2">
                      <Text className="text-sm font-medium text-black">
                        {formatDate(post.publishedAt)}
                      </Text>
                      <span className="border-x-2 border-black px-3 py-1 bg-background flex items-center gap-2 font-medium text-sm text-black">
                        Read Full
                        <ArrowRight
                          size={16}
                          className="group-hover:-rotate-45 transition-transform duration-300"
                        />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <PaginationComponent pageCount={totalPages} />
          </div>
        )}
      </div>
    </section>
  )
}
