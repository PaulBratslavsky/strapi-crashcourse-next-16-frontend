import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCoursesData } from '@/lib/data-fetching'
import { PaginationComponent } from '@/components/custom/pagination-component'
import { Search } from '@/components/custom/search'
import { StrapiImage } from '@/components/custom/strapi-image'
import { Text } from '@/components/retroui/Text'
import type { Metadata } from 'next'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Courses',
  description: 'Browse our collection of courses and learning materials',
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

interface CoursesPageProps {
  searchParams: Promise<{
    query?: string
    page?: string
    tag?: string
  }>
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page, 10) : 1
  const query = params.query
  const tag = params.tag

  const coursesData = await getCoursesData({
    query,
    page,
    tag,
  })

  const courses = coursesData.data || []
  const totalPages = coursesData.meta?.pagination?.pageCount || 1

  const featuredCourse = courses.length > 0 ? courses[0] : null
  const mainCourses = courses.slice(1)

  return (
    <section className="py-24 bg-white">
      <div className="container max-w-5xl px-4 mx-auto">
        {/* Header with Search */}
        <div className="mb-12">
          <Text as="h2" className="mb-4">
            Latest Courses
          </Text>
          <div className="flex flex-col gap-6 my-10">
            <Search className="w-full" placeholder="Search courses..." />
          </div>
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <Text as="h3" className="mb-2">
              No Courses Found
            </Text>
            <Text className="text-muted-foreground">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </Text>
          </div>
        )}

        {/* Featured Course */}
        {featuredCourse?.slug && (
          <Link
            href={`/courses/${featuredCourse.slug}`}
            className="block"
          >
            <article className="bg-card grid grid-cols-1 md:grid-cols-2 md:gap-8 border-2 border-black group transition-all mb-8">
              <div className="relative overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-black h-64 md:h-auto">
                {featuredCourse.image && (
                  <StrapiImage
                    src={featuredCourse.image.url}
                    alt={
                      featuredCourse.image.alternativeText ||
                      featuredCourse.title ||
                      "Featured course"
                    }
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="p-8 md:pl-0">
                <div className="flex items-center gap-4 mb-4">
                  <Text className="text-sm font-medium">
                    {formatDate(featuredCourse.publishedAt)}
                  </Text>
                </div>
                <Text as="h3" className="mb-2 font-sans">
                  {featuredCourse.title}
                </Text>
                <Text className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {featuredCourse.description}
                </Text>

                <div className="flex items-center justify-between bg-[#C4A1FF] border-2 border-black px-2">
                  <Text className="text-sm font-medium text-black">
                    {formatDate(featuredCourse.publishedAt)}
                  </Text>
                  <span className="border-x-2 border-black px-3 py-1 bg-background flex items-center gap-2 font-medium text-sm text-black">
                    View Course
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

        {/* Main Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {mainCourses.map((course) => {
            if (!course.slug) return null;
            return (
              <Link
                key={course.documentId}
                href={`/courses/${course.slug}`}
                className="block"
              >
                <article className="bg-card border-2 border-black group transition-all">
                  <div className="relative h-64 overflow-hidden border-b-2 border-black">
                    {course.image && (
                      <StrapiImage
                        src={course.image.url}
                        alt={
                          course.image.alternativeText ||
                          course.title ||
                          "Course"
                        }
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Text className="text-sm font-medium">
                        {formatDate(course.publishedAt)}
                      </Text>
                    </div>
                    <Text as="h3" className="mb-3 font-sans">
                      {course.title}
                    </Text>
                    <Text className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {course.description}
                    </Text>
                    <div className="flex items-center justify-between bg-[#C4A1FF] border-2 border-black px-2">
                      <Text className="text-sm font-medium text-black">
                        {formatDate(course.publishedAt)}
                      </Text>
                      <span className="border-x-2 border-black px-3 py-1 bg-background flex items-center gap-2 font-medium text-sm text-black">
                        View Course
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
