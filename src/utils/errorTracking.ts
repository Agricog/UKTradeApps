import * as Sentry from '@sentry/react'

export const captureError = (
  error: unknown,
  context: string,
  extras?: Record<string, unknown>,
): void => {
  Sentry.captureException(error, {
    tags: {
      type: 'app_error',
      context,
    },
    extra: extras,
    level: 'error',
  })
}

export const captureWarning = (
  message: string,
  context: string,
  extras?: Record<string, unknown>,
): void => {
  Sentry.captureMessage(message, {
    tags: {
      type: 'app_warning',
      context,
    },
    extra: extras,
    level: 'warning',
  })
}

export const setUserContext = (userId: string, email?: string): void => {
  Sentry.setUser({
    id: userId,
    ...(email ? { email } : {}),
  })
}

export const clearUserContext = (): void => {
  Sentry.setUser(null)
}
