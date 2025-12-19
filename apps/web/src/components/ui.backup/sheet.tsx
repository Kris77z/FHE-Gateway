"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet: any = function(props: any) {
  return React.createElement(SheetPrimitive.Root as any, { "data-slot": "sheet", ...props });
}

const SheetTrigger: any = function(props: any) {
  return React.createElement(SheetPrimitive.Trigger as any, { "data-slot": "sheet-trigger", ...props });
}

const SheetClose: any = function(props: any) {
  return React.createElement(SheetPrimitive.Close as any, { "data-slot": "sheet-close", ...props });
}

const SheetPortal: any = function(props: any) {
  return React.createElement(SheetPrimitive.Portal as any, { "data-slot": "sheet-portal", ...props });
}

const SheetOverlay: any = function({ className, ...props }: any) {
  return React.createElement(SheetPrimitive.Overlay as any, {
    "data-slot": "sheet-overlay",
    className: cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className
    ),
    ...props
  });
}

const SheetContent: any = function({ className, children, side = "right", ...props }: any) {
  const XIconComp = XIcon as any;
  return React.createElement(SheetPortal, {},
    React.createElement(SheetOverlay),
    React.createElement(SheetPrimitive.Content as any, {
      "data-slot": "sheet-content",
      className: cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
        side === "right" &&
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
        side === "left" &&
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        side === "top" &&
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
        side === "bottom" &&
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
        className
      ),
      ...props
    },
      children,
      React.createElement(SheetPrimitive.Close as any, {
        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
      },
        React.createElement(XIconComp, { className: "size-4" }),
        React.createElement("span", { className: "sr-only" }, "Close")
      )
    )
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

const SheetTitle: any = function({ className, children, ...props }: any) {
  return React.createElement(SheetPrimitive.Title as any, {
    "data-slot": "sheet-title",
    className: cn("text-foreground font-semibold", className),
    ...props
  }, children);
}

const SheetDescription: any = function({ className, children, ...props }: any) {
  return React.createElement(SheetPrimitive.Description as any, {
    "data-slot": "sheet-description",
    className: cn("text-muted-foreground text-sm", className),
    ...props
  }, children);
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
