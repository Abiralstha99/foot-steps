import { Tooltip } from "radix-ui"
import { cn } from "@/lib/utils"

type SimpleTooltipProps = {
  content: string
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

function SimpleTooltip({
  content,
  children,
  side = "right",
  className,
}: SimpleTooltipProps) {
  return (
    <Tooltip.Root delayDuration={0}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={8}
          className={cn(
            "z-50 rounded bg-bg-raised px-2.5 py-1 text-xs font-medium text-text-primary shadow-md",
            "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
        >
          {content}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

export { SimpleTooltip, Tooltip }
