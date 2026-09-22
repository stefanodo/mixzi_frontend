import type { HTMLAttributes, LabelHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type FieldProps = HTMLAttributes<HTMLDivElement> & {
  "aria-label"?: string
  "aria-labelledby"?: string
}

function Field({ className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      lang="es"
      aria-label={ariaLabel ?? "Campo de entrada"}
      aria-labelledby={ariaLabelledBy}
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label data-slot="field-label" className={cn("text-sm font-medium", className)} {...props} />
}

function FieldDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p lang="es" data-slot="field-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
}

export { Field, FieldDescription, FieldLabel }