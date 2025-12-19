"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const CheckIcon = Check as any;

const Checkbox: any = function(props: any) {
  const { className, ...restProps } = props;
  return React.createElement(CheckboxPrimitive.Root as any, {
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
    ),
    ...restProps
  }, React.createElement(CheckboxPrimitive.Indicator as any, {
    className: cn("flex items-center justify-center text-current")
  }, React.createElement(CheckIcon, { className: "h-4 w-4" })));
}

export { Checkbox }
