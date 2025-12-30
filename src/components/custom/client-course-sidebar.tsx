'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import type { TLesson } from '@/types'
import { Text } from '@/components/retroui/Text'

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

interface ClientCourseSidebarProps {
  lessons: TLesson[]
  selectedLessonSlug?: string | null
}

export function ClientCourseSidebar({ lessons, selectedLessonSlug }: ClientCourseSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleLessonSelect = (lesson: TLesson) => {
    const params = new URLSearchParams(searchParams)
    params.set('lesson', lesson.slug)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="sticky top-4">
      <div className="bg-[#E7F193] border-4 border-black p-4 mb-4">
        <Text as="h4">Course Lessons</Text>
        <Text className="text-sm text-muted-foreground">
          {lessons.length} lessons
        </Text>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const isActive = lesson.slug === selectedLessonSlug
          return (
            <div
              key={lesson.documentId}
              className={`border-4 border-black transition-all duration-200 ease-in bg-white ${
                isActive ? 'shadow-lg' : 'shadow-md'
              }`}
            >
              <button
                className="flex justify-between items-center w-full p-4 text-left font-bold focus:outline-none"
                onClick={() => handleLessonSelect(lesson)}
                aria-expanded={isActive}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span
                    className={`flex items-center justify-center w-8 h-8 flex-shrink-0 border-2 border-black font-bold text-sm ${
                      isActive
                        ? 'bg-[#C4A1FF] text-black'
                        : 'bg-white text-black'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="truncate">{lesson.title}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {lesson.videoTimecode && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDuration(lesson.videoTimecode)}
                    </span>
                  )}
                  <ChevronDown
                    className={`transition-transform duration-200 flex-shrink-0 ${
                      isActive ? 'rotate-180' : ''
                    }`}
                    size={20}
                  />
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isActive ? 'max-h-96 pb-4' : 'max-h-0'
                }`}
              >
                {lesson.description && (
                  <div className="px-4 border-t-2 border-dashed border-black pt-3">
                    <Text className="text-sm text-muted-foreground">
                      {lesson.description}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}