'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { actions } from '@/data/actions'
import { type FormState } from '@/data/validation/auth'
import { Input } from '@/components/retroui/Input'
import { Label } from '@/components/retroui/Label'
import { Text } from '@/components/retroui/Text'
import { ZodErrors } from '@/components/custom/zod-errors'
import { StrapiErrors } from '@/components/custom/strapi-errors'
import { SubmitButton } from '@/components/custom/submit-button'

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
}

export function SigninForm() {
  const [formState, formAction] = useActionState(
    actions.auth.loginUserAction,
    INITIAL_STATE
  )
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identifier">Username or Email</Label>
          <Input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="you@example.com"
            defaultValue={formState?.data?.identifier || ''}
          />
          <ZodErrors error={formState?.zodErrors?.identifier} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </button>
          </div>
          <ZodErrors error={formState?.zodErrors?.password} />
        </div>

        <SubmitButton text="Sign In" loadingText="Signing in..." />
        <StrapiErrors error={formState?.strapiErrors} />
      </form>

      <div className="text-center text-sm">
        <Text>
          Don&apos;t have an account?{' '}
          <Link href="signup" className="font-bold underline underline-offset-4">
            Sign up
          </Link>
        </Text>
      </div>
    </div>
  )
}
