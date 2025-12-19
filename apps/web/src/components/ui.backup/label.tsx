"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
)

const Label: any = function({ className, ref, ...props }: any) {
  return React.createElement(LabelPrimitive.Root as any, {
    ref,
    className: cn(labelVariants(), className),
    ...props
  });
}
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
