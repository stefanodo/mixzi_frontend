import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type SeparatorProps = HTMLAttributes<HTMLElement> & {
  orientation?: "horizontal" | "vertical"
}

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  if (orientation === "horizontal") {
    return (
      <hr
        {...props}
        data-slot="separator"
        className={cn("shrink-0 border-0 bg-border h-px w-full", className)}
      />
    )
  }

  return (
    <div
      {...props}
      role="separator"
      aria-orientation={orientation}
      data-slot="separator"
      data-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        "h-full w-px",
        className,
      )}
    />
  )
}

export { Separator }
