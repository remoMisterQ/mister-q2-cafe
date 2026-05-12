import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn("h-11 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-espresso focus-ring", className)}
    {...props}
  />
));
Select.displayName = "Select";
