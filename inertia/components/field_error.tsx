import { type ReactNode } from 'react'

/**
 * Validation errors as shared by the Inertia middleware: one entry
 * per field, holding either a single message or the list reported by
 * the validator.
 */
export type FieldErrors = Record<string, string | string[] | undefined>

/** Standalone error message, for failures not tied to a form field. */
export function ErrorText({ children }: { children: ReactNode }) {
  return <p className="text-destructive text-sm">{children}</p>
}

/**
 * Error message of a single field, rendered only when the field
 * failed. Fields reporting several messages show the first one.
 */
export default function FieldError({
  errors,
  field,
}: {
  errors: FieldErrors | undefined
  field: string
}) {
  const message = errors?.[field]
  if (!message) {
    return null
  }
  return <ErrorText>{Array.isArray(message) ? message[0] : message}</ErrorText>
}
