"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root as any

const SelectGroup = SelectPrimitive.Group as any

const SelectValue = SelectPrimitive.Value as any

const SelectTrigger: any = function({ className, children, ref, ...props }: any) {
  const ChevronDownComp = ChevronDown as any;
  return React.createElement(SelectPrimitive.Trigger as any, {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    ),
    ...props
  },
    children,
    React.createElement(SelectPrimitive.Icon as any, { asChild: true },
      React.createElement(ChevronDownComp, { className: "h-4 w-4 opacity-50" })
    )
  );
}
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton: any = function({ className, ref, ...props }: any) {
  const ChevronUpComp = ChevronUp as any;
  return React.createElement(SelectPrimitive.ScrollUpButton as any, {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    ),
    ...props
  },
    React.createElement(ChevronUpComp, { className: "h-4 w-4" })
  );
}
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton: any = function({ className, ref, ...props }: any) {
  const ChevronDownComp2 = ChevronDown as any;
  return React.createElement(SelectPrimitive.ScrollDownButton as any, {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    ),
    ...props
  },
    React.createElement(ChevronDownComp2, { className: "h-4 w-4" })
  );
}
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent: any = function({ className, children, position = "popper", ref, ...props }: any) {
  return React.createElement(SelectPrimitive.Portal as any, {},
    React.createElement(SelectPrimitive.Content as any, {
      ref,
      className: cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      ),
      position,
      ...props
    },
      React.createElement(SelectScrollUpButton),
      React.createElement(SelectPrimitive.Viewport as any, {
        className: cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )
      },
        children
      ),
      React.createElement(SelectScrollDownButton)
    )
  );
}
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel: any = function({ className, ref, ...props }: any) {
  return React.createElement(SelectPrimitive.Label as any, {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  });
}
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem: any = function({ className, children, ref, ...props }: any) {
  const CheckComp = Check as any;
  return React.createElement(SelectPrimitive.Item as any, {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    ),
    ...props
  },
    React.createElement("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" },
      React.createElement(SelectPrimitive.ItemIndicator as any, {},
        React.createElement(CheckComp, { className: "h-4 w-4" })
      )
    ),
    React.createElement(SelectPrimitive.ItemText as any, {},
      children
    )
  );
}
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator: any = function({ className, ref, ...props }: any) {
  return React.createElement(SelectPrimitive.Separator as any, {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  });
}
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
