import type { JSONDataTypes } from '@adonisjs/core/types/transformers'
import type { Data } from '@generated/data'
import type { PropsWithChildren } from 'react'

/**
 * Props of a page: what its controller sends, on top of what the
 * Inertia middleware shares with every page.
 */
export type InertiaProps<T extends JSONDataTypes = {}> = PropsWithChildren<Data.SharedProps & T>

declare module '@inertiajs/core' {
  interface InertiaConfig {
    sharedPageProps: Data.SharedProps
    flashDataType: Data.FlashMessages
  }
}

export type Messages = Data.SharedProps['messages']
