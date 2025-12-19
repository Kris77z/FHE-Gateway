"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup: any = function({ className, variant, size, children, ref, ...props }: any) {
  return React.createElement(ToggleGroupPrimitive.Root as any, {
    ref,
    "data-slot": "toggle-group",
    "data-variant": variant,
    "data-size": size,
    className: cn(
      "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
      className
    ),
    ...props
  },
    React.createElement(ToggleGroupContext.Provider, { value: { variant, size } },
      children
    )
  );
}
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem: any = function({ className, children, variant, size, ref, ...props }: any) {
  const context = React.useContext(ToggleGroupContext);

  return React.createElement(ToggleGroupPrimitive.Item as any, {
    ref,
    "data-slot": "toggle-group-item",
    "data-variant": context.variant || variant,
    "data-size": context.size || size,
    className: cn(
      toggleVariants({
        variant: context.variant || variant,
        size: context.size || size,
      }),
      "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
      className
    ),
    ...props
  }, children);
}
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
