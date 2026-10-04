import * as React from "react";
import { cn } from "@/lib/utils";
export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "field disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/20 aria-invalid:border-red-500",
        className,
      )}
      {...props}
    />
  );
}
