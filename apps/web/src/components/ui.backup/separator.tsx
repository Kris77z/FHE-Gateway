"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator: any = function({ className, orientation = "horizontal", decorative = true, ref, ...props }: any) {
  return React.createElement(SeparatorPrimitive.Root as any, {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  });
}
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
