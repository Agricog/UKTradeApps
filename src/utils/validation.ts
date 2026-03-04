export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  sanitized: string
}

export const validateInput = (
  input: string,
  type: 'email' | 'number' | 'text' | 'currency' | 'url',
  maxLength: number = 255,
): ValidationResult => {
  const errors: Record<string, string> = {}
  let sanitized = input.trim()

  // Length check
  if (sanitized.length > maxLength) {
    errors.length = `Maximum ${maxLength} characters allowed`
  }

  // Type-specific validation
  switch (type) {
    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(sanitized)) {
        errors.email = 'Invalid email format'
      }
      break
    }
    case 'number': {
      if (isNaN(Number(sanitized))) {
        errors.number = 'Must be a valid number'
      }
      break
    }
    case 'currency': {
      const currencyRegex = /^\d+(\.\d{1,2})?$/
      if (!currencyRegex.test(sanitized)) {
        errors.currency = 'Invalid currency format (e.g., 123.45)'
      }
      break
    }
    case 'url': {
      try {
        const url = new URL(sanitized)
        if (!['http:', 'https:'].includes(url.protocol)) {
          errors.url = 'URL must start with http:// or https://'
        }
      } catch {
        errors.url = 'Invalid URL format'
      }
      break
    }
    case 'text':
    default:
      break
  }

  // XSS Protection: escape dangerous characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  }
}

export const validateRequired = (
  value: string,
  fieldName: string,
): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`
  }
  return null
}
