import { type FormState, SigninFormSchema, SignupFormSchema } from '@/data/validation/auth'
import { isAuthError, loginUserService, registerUserService } from '@/lib/services/auth'
import { setAuthCookies, clearAuth } from '@/lib/session'

export const registerUserServerFunction = async (formData: FormData): Promise<FormState> => {
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
      success: false,
      message: 'Validation failed',
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors as Record<string, string[]>,
      data: fields,
    }
  }

  const { confirmPassword, ...userData } = validatedFields.data
  const responseData = await registerUserService(userData)

  if (!responseData) {
    return {
      success: false,
      message: 'Oops! Something went wrong. Please try again.',
      strapiErrors: null,
      zodErrors: null,
      data: fields,
    }
  }

  if (isAuthError(responseData)) {
    return {
      success: false,
      message: 'Failed to register.',
      strapiErrors: responseData.error ?? null,
      zodErrors: null,
      data: fields,
    }
  }

  await setAuthCookies(responseData.user, responseData.jwt)

  return {
    success: true,
    message: 'User registration successful',
    strapiErrors: null,
    zodErrors: null,
    data: fields,
  }
}

export const loginUserServerFunction = async (formData: FormData): Promise<FormState> => {
  const fields = {
    identifier: formData.get('identifier') as string,
    password: formData.get('password') as string,
  }

  const validatedFields = SigninFormSchema.safeParse(fields)

  if (!validatedFields.success) {
    const flattenedErrors = validatedFields.error.flatten()
    return {
      success: false,
      message: 'Validation failed',
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors as Record<string, string[]>,
      data: fields,
    }
  }

  const responseData = await loginUserService(validatedFields.data)

  if (!responseData) {
    return {
      success: false,
      message: 'Oops! Something went wrong. Please try again.',
      strapiErrors: null,
      zodErrors: null,
      data: fields,
    }
  }

  if (isAuthError(responseData)) {
    return {
      success: false,
      message: 'Failed to login.',
      strapiErrors: responseData.error ?? null,
      zodErrors: null,
      data: fields,
    }
  }

  await setAuthCookies(responseData.user, responseData.jwt)

  return {
    success: true,
    message: 'User login successful',
    strapiErrors: null,
    zodErrors: null,
    data: fields,
  }
}

export const logoutUserServerFunction = async () => {
  await clearAuth()

  return {
    success: true,
    message: 'User logged out successfully',
  }
}

export const getCurrentUserServerFunction = async () => {
  const { getCurrentUser } = await import('@/lib/server-auth-helpers')
  return getCurrentUser()
}

export const getAuthServerFunction = async () => {
  const { getAuth } = await import('@/lib/session')
  return getAuth()
}
