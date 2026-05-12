import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("min-h-24 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-espresso focus-ring", className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
