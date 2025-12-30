import Link from 'next/link'
import { Text } from '@/components/retroui/Text'
import { Button } from '@/components/retroui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-block bg-[#C4A1FF] border-4 border-black px-6 py-3 rotate-2">
            <Text as="h1" className="text-6xl font-bold">404</Text>
          </div>
        </div>

        <Text as="h2" className="mb-4">Page Not Found</Text>

        <Text className="text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It might have been moved or doesn&apos;t exist.
        </Text>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/articles">Browse Articles</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
