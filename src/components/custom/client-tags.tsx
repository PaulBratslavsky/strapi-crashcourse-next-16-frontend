'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/retroui/Badge'

const tagColors = [
  "bg-[#C4A1FF] text-black", // Purple
  "bg-[#E7F193] text-black", // Lime
  "bg-[#C4FF83] text-black", // Green
  "bg-[#FFB3BA] text-black", // Coral Pink
  "bg-[#A1D4FF] text-black", // Sky Blue
  "bg-[#FFDAA1] text-black", // Peach
] as const;

function getTagColor(tagName: string): string {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
}

interface Tag {
  documentId: string
  title: string
}

interface ClientTagsProps {
  tags: Tag[]
  className?: string
}

export function ClientTags({ tags, className }: ClientTagsProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const currentTag = searchParams.get('tag') || undefined

  const handleTagClick = (tagTitle: string | null) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    if (tagTitle) {
      params.set('tag', tagTitle)
    } else {
      params.delete('tag')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  if (tags.length === 0) {
    return null
  }

  const isAllActive = !currentTag

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Badge
        size="sm"
        className={cn(
          "cursor-pointer hover:opacity-80 transition-opacity border-2 border-black",
          isAllActive ? "bg-black text-white" : "bg-white text-black"
        )}
        onClick={() => handleTagClick(null)}
      >
        All
      </Badge>
      {tags.map((tag) => {
        const isActive = currentTag === tag.title
        return (
          <Badge
            key={tag.documentId}
            size="sm"
            className={cn(
              "cursor-pointer hover:opacity-80 transition-opacity border-2 border-black",
              isActive ? "ring-2 ring-black ring-offset-1" : "",
              getTagColor(tag.title)
            )}
            onClick={() => handleTagClick(tag.title)}
          >
            {tag.title}
          </Badge>
        )
      })}
    </div>
  )
}
