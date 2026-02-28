import type { ReactNode } from "react"

type EmptyStateProps = {
  illustration: ReactNode
  headline: string
  subline: string
  action?: ReactNode
}

export function EmptyState({ illustration, headline, subline, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="text-text-muted">{illustration}</div>
      <h2 className="font-display text-heading text-text-primary">{headline}</h2>
      <p className="text-body text-text-secondary max-w-xs">{subline}</p>
      {action}
    </div>
  )
}
