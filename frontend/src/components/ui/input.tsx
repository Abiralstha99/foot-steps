import * as React from "react"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ReactNode
}

function Input({ className, icon, ...props }: InputProps) {
  if (icon) {
    return (
      <div className="relative flex items-center">
        <span className="absolute left-3 flex items-center text-text-muted [&_svg]:size-4">
          {icon}
        </span>
        <input
          className={cn(
            "w-full rounded bg-bg-surface border border-border-token text-text-primary pl-9 pr-3 py-2 text-sm",
            "placeholder:text-text-muted",
            "focus:outline-none focus:ring-1 focus:ring-accent",
            "disabled:pointer-events-none disabled:opacity-50",
            className
          )}
          {...props}
        />
      </div>
    )
  }

  return (
    <input
      className={cn(
        "w-full rounded bg-bg-surface border border-border-token text-text-primary px-3 py-2 text-sm",
        "placeholder:text-text-muted",
        "focus:outline-none focus:ring-1 focus:ring-accent",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
