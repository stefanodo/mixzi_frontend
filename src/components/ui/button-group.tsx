import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical"
}

function ButtonGroup({
  className,
  orientation = "horizontal",
  "aria-label": ariaLabel,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel ?? "Grupo de botones"}
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "inline-flex items-center *:data-[slot=button]:relative *:data-[slot=button]:z-0 [&>[data-slot=button]:focus-visible]:z-10 [&>[data-slot=button]:not(:first-child)]:-ml-px",
        orientation === "vertical" &&
          "flex-col *:data-[slot=button]:w-full [&>[data-slot=button]:not(:first-child)]:-mt-px [&>[data-slot=button]:not(:first-child)]:ml-0",
        className,
      )}
      {...props}
    />
  )
}

export { ButtonGroup }