import { getCourseBySlug, getLessonBySlug } from '@/lib/data-fetching'
import { CourseDetail } from '@/components/custom/course-detail'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Generate metadata for SEO
export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const courseData = await getCourseBySlug(slug)
  
  if (!courseData.data || courseData.data.length === 0) {
    return {
      title: 'Course Not Found',
    }
  }

  const course = courseData.data[0]
  
  return {
    title: course.title,
    description: course.description || `Learn ${course.title}`,
    openGraph: {
      title: course.title,
      description: course.description || `Learn ${course.title}`,
      type: 'website',
      images: course.image?.url ? [course.image.url] : [],
    },
  }
}

interface CoursePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    lesson?: string
  }>
}

export default async function CoursePage({ params, searchParams }: CoursePageProps) {
  const [{ slug }, searchParamsResolved] = await Promise.all([params, searchParams])
  const courseData = await getCourseBySlug(slug)

  if (!courseData.data || courseData.data.length === 0) {
    notFound()
  }

  const course = courseData.data[0]

  // Get the selected lesson or default to first lesson
  const selectedLessonSlug = searchParamsResolved.lesson || course.lessons?.[0]?.slug
  let currentLesson = null
  
  if (selectedLessonSlug) {
    try {
      const lessonData = await getLessonBySlug(selectedLessonSlug)
      currentLesson = lessonData.data?.[0] || null
    } catch (error) {
      console.error('Error fetching lesson:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CourseDetail 
        course={course} 
        currentLesson={currentLesson}
        selectedLessonSlug={selectedLessonSlug}
      />
    </div>
  )
}