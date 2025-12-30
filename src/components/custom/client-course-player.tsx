'use client'

import ReactPlayer from 'react-player'
import type { TLesson } from '@/types'
import { Text } from '@/components/retroui/Text'

interface ClientCoursePlayerProps {
  currentLesson?: TLesson | null
  selectedIndex: number
}

export function ClientCoursePlayer({ currentLesson, selectedIndex }: ClientCoursePlayerProps) {
  return (
    <>
      {/* Video Player */}
      <div className="aspect-video bg-black border-4 border-black overflow-hidden mb-6">
        {currentLesson?.videoUrl ? (
          <ReactPlayer
            src={currentLesson.videoUrl}
            width="100%"
            height="100%"
            controls
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/60">
            <span>No video available</span>
          </div>
        )}
      </div>

      {/* Current Lesson Info */}
      {currentLesson && (
        <div className="mb-6">
          <Text as="h3" className="mb-2">
            Lesson {selectedIndex + 1}: {currentLesson.title}
          </Text>
          {currentLesson.description && (
            <Text className="text-muted-foreground">
              {currentLesson.description}
            </Text>
          )}
        </div>
      )}
    </>
  )
}