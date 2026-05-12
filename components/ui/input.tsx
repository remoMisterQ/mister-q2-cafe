import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn("h-11 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-espresso focus-ring", className)}
    {...props}
  />
));
Input.displayName = "Input";
