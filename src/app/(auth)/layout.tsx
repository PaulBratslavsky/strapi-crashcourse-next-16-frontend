import Link from 'next/link'
import { Github } from 'lucide-react'
import { Button } from '@/components/retroui/Button'
import { Text } from '@/components/retroui/Text'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative px-4 py-20">
      <div className="mx-auto w-full max-w-lg overflow-hidden border-4 border-black bg-white">
        <div className="bg-accent p-6">
          <Text as="h3">Welcome</Text>
          <Text className="font-medium text-muted-foreground">
            Sign in to your account or create a new one.
          </Text>
        </div>
        <div className="p-6">
          {children}

          {/* Shared social login section */}
          <div className="mt-8 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-center"
                asChild
              >
                <Link href="/api/connect/github">
                  <Github className="mr-2 h-5 w-5" />
                  Continue with GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Shared footer */}
      <div className="text-center mt-6">
        <Text className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </div>
    </div>
  )
}
