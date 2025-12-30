'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Check, Eye, EyeOff, X } from 'lucide-react'
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

export function SignupForm() {
  const [formState, formAction] = useActionState(
    actions.auth.registerUserAction,
    INITIAL_STATE
  )
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  // Password validation checks
  const hasMinLength = password.length >= 6
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              defaultValue={formState?.data?.username || ''}
            />
            <ZodErrors error={formState?.zodErrors?.username} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              defaultValue={formState?.data?.email || ''}
            />
            <ZodErrors error={formState?.zodErrors?.email} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="mt-4 space-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              {hasMinLength ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )}
              <span>At least 6 characters</span>
            </div>
            <div className="flex items-center gap-1">
              {hasNumber ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )}
              <span>At least one number</span>
            </div>
            <div className="flex items-center gap-1">
              {hasSpecialChar ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )}
              <span>At least one special character</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
          />
          <ZodErrors error={formState?.zodErrors?.confirmPassword} />
        </div>

        <SubmitButton text="Create Account" loadingText="Creating account..." />
        <StrapiErrors error={formState?.strapiErrors} />
      </form>

      <div className="text-center text-sm">
        <Text>
          Already have an account?{' '}
          <Link href="signin" className="font-bold underline underline-offset-4">
            Sign in
          </Link>
        </Text>
      </div>
    </div>
  )
}
