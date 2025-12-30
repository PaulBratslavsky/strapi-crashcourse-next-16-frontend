'use server'

import { redirect } from 'next/navigation'
import { type FormState, SigninFormSchema, SignupFormSchema } from '@/data/validation/auth'
import { isAuthError, loginUserService, registerUserService } from '@/lib/services/auth'
import { setAuthCookies, clearAuth } from '@/lib/session'
import { revalidatePath } from 'next/cache'

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
}

export async function registerUserAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const fields = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const validatedFields = SignupFormSchema.safeParse(fields)

  if (!validatedFields.success) {
    const flattenedErrors = validatedFields.error.flatten()
    return {
      ...INITIAL_STATE,
      message: 'Validation failed',
      zodErrors: flattenedErrors.fieldErrors as Record<string, string[]>,
      data: fields,
    }
  }

  const { confirmPassword, ...userData } = validatedFields.data
  const responseData = await registerUserService(userData)

  if (!responseData) {
    return {
      ...INITIAL_STATE,
      message: 'Oops! Something went wrong. Please try again.',
      data: fields,
    }
  }

  if (isAuthError(responseData)) {
    return {
      ...INITIAL_STATE,
      message: 'Failed to register.',
      strapiErrors: responseData.error ?? null,
      data: fields,
    }
  }

  await setAuthCookies(responseData.user, responseData.jwt)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function loginUserAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const fields = {
    identifier: formData.get('identifier') as string,
    password: formData.get('password') as string,
  }

  const validatedFields = SigninFormSchema.safeParse(fields)

  if (!validatedFields.success) {
    const flattenedErrors = validatedFields.error.flatten()
    return {
      ...INITIAL_STATE,
      message: 'Validation failed',
      zodErrors: flattenedErrors.fieldErrors as Record<string, string[]>,
      data: fields,
    }
  }

  const responseData = await loginUserService(validatedFields.data)

  if (!responseData) {
    return {
      ...INITIAL_STATE,
      message: 'Oops! Something went wrong. Please try again.',
      data: fields,
    }
  }

  if (isAuthError(responseData)) {
    return {
      ...INITIAL_STATE,
      message: 'Failed to login.',
      strapiErrors: responseData.error ?? null,
      data: fields,
    }
  }

  await setAuthCookies(responseData.user, responseData.jwt)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logoutUserAction(): Promise<{ success: boolean }> {
  await clearAuth()
  revalidatePath('/', 'layout')
  redirect('/')
}
