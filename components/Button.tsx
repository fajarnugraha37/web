import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-mono uppercase tracking-[0.2em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cyber-chamfer-sm transition-all duration-300 relative",
  {
    variants: {
      variant: {
        default:
          "border-2 border-accent text-accent hover:bg-accent hover:text-black glow-btn",
        secondary:
          "border-2 border-accent-secondary text-accent-secondary hover:bg-accent-secondary hover:text-black glow-btn-secondary",
        outline:
          "border border-border bg-transparent hover:border-accent hover:text-accent glow-btn",
        ghost: "hover:bg-accent/10 hover:text-accent",
        glitch:
          "bg-accent text-black hover:brightness-110",
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    if (variant === "glitch") {
      let textContent = "";
      if (typeof props.children === "string") {
        textContent = props.children;
      } else if (props["data-text" as keyof typeof props]) {
        textContent = props["data-text" as keyof typeof props] as string;
      }

      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }), "cyber-glitch-text")}
          data-text={textContent}
          ref={ref}
          {...props}
        />
      )
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
