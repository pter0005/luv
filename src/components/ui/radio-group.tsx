
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {children?: React.ReactNode}
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "group relative flex w-full cursor-pointer items-center justify-start rounded-md border border-zinc-700 bg-zinc-800 p-4 text-sm font-medium ring-offset-background transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-zinc-900 data-[state=checked]:text-primary",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900 group-data-[state=checked]:border-primary">
            <RadioGroupPrimitive.Indicator>
              <Circle className="h-2.5 w-2.5 fill-current text-current" />
            </RadioGroupPrimitive.Indicator>
        </div>
        <span>{children}</span>
      </div>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
