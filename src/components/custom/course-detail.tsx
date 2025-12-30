import { MarkdownContentLazy } from './markdown-content-lazy'
import { PageBreadcrumb } from './page-breadcrumb'
import { ClientCoursePlayer } from './client-course-player'
import { ClientCourseSidebar } from './client-course-sidebar'
import type { TCourse, TLesson } from '@/types'
import { Text } from '@/components/retroui/Text'
import { Badge } from '@/components/retroui/Badge'

const markdownStyles = {
  richText: 'prose prose-lg max-w-none prose-slate dark:prose-invert',
  h1: 'text-3xl font-bold mb-4 font-heading',
  h2: 'text-2xl font-bold mb-3 font-heading',
  h3: 'text-xl font-bold mb-3 font-heading',
  p: 'mb-4 leading-relaxed',
  a: 'text-main hover:text-main/80 underline underline-offset-4 font-semibold transition-colors',
  ul: 'list-disc pl-6 mb-4 space-y-2',
  ol: 'list-decimal pl-6 mb-4 space-y-2',
  li: 'leading-relaxed',
  blockquote: 'border-l-4 border-main pl-4 italic text-muted-foreground mb-4 py-2',
  codeBlock: 'block bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-4 font-mono',
  codeInline: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono',
  pre: 'bg-muted p-4 rounded-lg overflow-x-auto mb-4',
  table: 'w-full border-collapse border border-border mb-4',
  th: 'border border-border p-2 bg-muted font-bold text-left',
  td: 'border border-border p-2',
  img: 'max-w-full h-auto rounded-lg mb-4',
  hr: 'border-border my-8',
}

interface CourseDetailProps {
  course: TCourse
  currentLesson?: TLesson | null
  selectedLessonSlug?: string | null
}

export function CourseDetail({ course, currentLesson, selectedLessonSlug }: CourseDetailProps) {
  const { title, description, isPremium, lessons } = course
  const selectedIndex = lessons.findIndex((l) => l.slug === selectedLessonSlug)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F9F5F2] border-b-2 border-black">
        <div className="container mx-auto px-6 py-8">
          <PageBreadcrumb
            className="mb-8"
            segments={[
              { label: 'Courses', href: '/courses', search: { page: 1 } },
              { label: title },
            ]}
          />

          <div className="flex items-center gap-4 mb-4">
            <Text as="h2">{title}</Text>
            {isPremium && (
              <Badge size="sm" className="bg-[#C4A1FF] text-black border-2 border-black">
                Premium
              </Badge>
            )}
          </div>
          {description && (
            <Text className="text-lg text-muted-foreground max-w-2xl">
              {description}
            </Text>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video and Content Section */}
          <div className="lg:col-span-2">
            {/* Video Player - Client Component */}
            <ClientCoursePlayer 
              currentLesson={currentLesson}
              selectedIndex={selectedIndex}
            />

            {/* Lesson Content */}
            <div className="bg-white border-4 border-black p-6 lg:p-8 shadow-md">
              {currentLesson?.content ? (
                <>
                  <Text as="h4" className="mb-4">Lesson Content</Text>
                  <MarkdownContentLazy
                    content={currentLesson.content}
                    styles={markdownStyles}
                  />
                  {currentLesson.resources && (
                    <>
                      <Text as="h4" className="mt-8 pt-8 border-t-2 border-dashed border-black mb-4">
                        Resources
                      </Text>
                      <MarkdownContentLazy
                        content={currentLesson.resources}
                        styles={markdownStyles}
                      />
                    </>
                  )}
                </>
              ) : (
                <Text className="text-muted-foreground">
                  Select a lesson to view its content.
                </Text>
              )}
            </div>
          </div>

          {/* Lessons Sidebar - Client Component for interactivity */}
          <div className="lg:col-span-1">
            <ClientCourseSidebar 
              lessons={lessons}
              selectedLessonSlug={selectedLessonSlug}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
