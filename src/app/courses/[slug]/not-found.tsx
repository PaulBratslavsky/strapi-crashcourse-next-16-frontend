import Link from 'next/link'
import { Text } from '@/components/retroui/Text'
import { Button } from '@/components/retroui/Button'

export default function CourseNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-block bg-[#A1D4FF] border-4 border-black px-6 py-3 -rotate-2">
            <Text as="h1" className="text-4xl font-bold">404</Text>
          </div>
        </div>

        <Text as="h2" className="mb-4">Course Not Found</Text>

        <Text className="text-muted-foreground mb-8">
          The course you&apos;re looking for doesn&apos;t exist or has been removed.
        </Text>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
