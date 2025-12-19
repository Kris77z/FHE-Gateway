"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar: any = function(props: any) {
  const { className, children, ...restProps } = props;
  return React.createElement(AvatarPrimitive.Root as any, {
    "data-slot": "avatar",
    className: cn(
      "relative flex size-8 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...restProps
  }, children);
}

const AvatarImage: any = function({ className, ...props }: any) {
  return React.createElement(AvatarPrimitive.Image as any, {
    "data-slot": "avatar-image",
    className: cn("aspect-square size-full", className),
    ...props
  });
}

const AvatarFallback: any = function(props: any) {
  const { className, children, ...restProps } = props;
  return React.createElement(AvatarPrimitive.Fallback as any, {
    "data-slot": "avatar-fallback",
    className: cn(
      "bg-muted flex size-full items-center justify-center rounded-full",
      className
    ),
    ...restProps
  }, children);
}

export { Avatar, AvatarImage, AvatarFallback }
