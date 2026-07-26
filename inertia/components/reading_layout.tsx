import type { ReactNode } from 'react'

/**
 * Reading column shared by the article and project pages. The prose stays
 * centred on the page, exactly where it sits without an aside, and the
 * aside is parked in the right margin. It only appears once the margin is
 * wide enough to hold it, which keeps tablets and phones untouched.
 */
export default function ReadingLayout({
  aside,
  className,
  children,
}: {
  aside?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div className="px-6 py-16 pb-24 md:pb-32">
      <div className="relative mx-auto max-w-[720px]">
        <div className={className}>{children}</div>
        {aside && (
          <div className="absolute inset-y-0 left-full hidden w-60 pl-10 xl:block 2xl:w-72 2xl:pl-12">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">{aside}</div>
          </div>
        )}
      </div>
    </div>
  )
}
