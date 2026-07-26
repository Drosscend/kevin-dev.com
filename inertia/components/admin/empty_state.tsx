/** Placeholder shown when an admin list has no entries yet. */
export default function EmptyState({ children }: { children: string }) {
  return <p className="text-muted-foreground text-sm">{children}</p>
}
