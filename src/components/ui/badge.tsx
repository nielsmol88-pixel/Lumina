import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        lead:        "bg-slate-100 text-slate-700",
        consult:     "bg-amber-50 text-amber-800 border border-amber-200",
        surgery:     "bg-blue-50 text-blue-800 border border-blue-200",
        postop:      "bg-green-50 text-green-800 border border-green-200",
        discharged:  "bg-stone-100 text-stone-500",
      },
    },
    defaultVariants: { variant: "lead" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
