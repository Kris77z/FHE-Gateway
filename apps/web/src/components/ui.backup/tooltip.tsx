"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider: any = function({ delayDuration = 0, children, ...props }: any) {
  return React.createElement(TooltipPrimitive.Provider as any, {
    "data-slot": "tooltip-provider",
    delayDuration,
    ...props
  }, children);
}

const Tooltip: any = function({ children, ...props }: any) {
  return React.createElement(TooltipProvider, {},
    React.createElement(TooltipPrimitive.Root as any, { "data-slot": "tooltip", ...props }, children)
  );
}

const TooltipTrigger: any = function({ children, ...props }: any) {
  return React.createElement(TooltipPrimitive.Trigger as any, { "data-slot": "tooltip-trigger", ...props }, children);
}

const TooltipContent: any = function({ className, sideOffset = 0, children, ...props }: any) {
  return React.createElement(TooltipPrimitive.Portal as any, {},
    React.createElement(TooltipPrimitive.Content as any, {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props
    },
      children,
      React.createElement(TooltipPrimitive.Arrow as any, {
        className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
      })
    )
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
