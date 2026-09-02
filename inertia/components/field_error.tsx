import { type ReactNode } from 'react'

/**
 * Validation errors as shared by the Inertia middleware: one entry
 * per field, holding either a single message or the list reported by
 * the validator.
 */
export type FieldErrors = Record<string, string | string[] | undefined>

/** Standalone error message, for failures not tied to a form field. */
export function ErrorText({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="text-destructive text-sm">
      {children}
    </p>
  )
}

function errorId(field: string) {
  return `${field.replaceAll('.', '-')}-error`
}

/**
 * Attributes tying a control to its FieldError: invalid state, and the
 * message as its description, so assistive technology reads both.
 */
export function fieldAria(errors: FieldErrors | undefined, field: string) {
  return errors?.[field] ? { 'aria-invalid': true, 'aria-describedby': errorId(field) } : {}
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
  return <ErrorText id={errorId(field)}>{Array.isArray(message) ? message[0] : message}</ErrorText>
}
