import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-ring disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-espresso text-white hover:bg-black",
        secondary: "bg-white text-espresso border border-stone-200 hover:bg-cream",
        ghost: "text-espresso hover:bg-white/70",
        outline: "border border-mocha/25 bg-transparent text-espresso hover:bg-white"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, children, ...props }, ref) => {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(classes, (children.props as { className?: string }).className)
    });
  }

  return (
    <button className={classes} ref={ref} {...props}>
      {children}
    </button>
  );
});
Button.displayName = "Button";

export { buttonVariants };
