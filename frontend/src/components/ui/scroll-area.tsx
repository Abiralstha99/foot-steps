import * as React from "react"

import { cn } from "@/lib/utils"

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>

function ScrollArea({ className, ...props }: ScrollAreaProps) {
  return <div className={cn("overflow-auto", className)} {...props} />
}

export { ScrollArea }

