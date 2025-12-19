"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const XIconComp = XIcon as any;

const Dialog: any = function(props: any) {
  return React.createElement(DialogPrimitive.Root as any, { "data-slot": "dialog", ...props });
}

const DialogTrigger: any = function(props: any) {
  return React.createElement(DialogPrimitive.Trigger as any, { "data-slot": "dialog-trigger", ...props });
}

const DialogPortal: any = function(props: any) {
  return React.createElement(DialogPrimitive.Portal as any, { "data-slot": "dialog-portal", ...props });
}

const DialogClose: any = function(props: any) {
  return React.createElement(DialogPrimitive.Close as any, { "data-slot": "dialog-close", ...props });
}

const DialogOverlay: any = function({ className, ...props }: any) {
  return React.createElement(DialogPrimitive.Overlay as any, {
    "data-slot": "dialog-overlay",
    className: cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className
    ),
    ...props
  });
}

const DialogContent: any = function({ className, children, showCloseButton = true, ...props }: any) {
  return React.createElement(DialogPortal, { "data-slot": "dialog-portal" },
    React.createElement(DialogOverlay),
    React.createElement(DialogPrimitive.Content as any, {
      "data-slot": "dialog-content",
      className: cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
        className
      ),
      ...props
    },
      children,
      showCloseButton && React.createElement(DialogPrimitive.Close as any, {
        "data-slot": "dialog-close",
        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      },
        React.createElement(XIconComp),
        React.createElement("span", { className: "sr-only" }, "Close")
      )
    )
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

const DialogTitle: any = function({ className, ...props }: any) {
  return React.createElement(DialogPrimitive.Title as any, {
    "data-slot": "dialog-title",
    className: cn("text-lg leading-none font-semibold", className),
    ...props
  });
}

const DialogDescription: any = function({ className, ...props }: any) {
  return React.createElement(DialogPrimitive.Description as any, {
    "data-slot": "dialog-description",
    className: cn("text-muted-foreground text-sm", className),
    ...props
  });
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
