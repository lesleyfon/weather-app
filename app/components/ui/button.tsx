import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors tw-focus-visible:outline-none tw-focus-visible:ring-1 tw-focus-visible:ring-gray-950 tw-disabled:pointer-events-none tw-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:tw-size-4 [&_svg]:tw-shrink-0 tw-dark:focus-visible:ring-gray-300",
  {
    variants: {
      variant: {
        default:
          "tw-bg-gray-900 tw-text-gray-50 tw-shadow tw-hover:bg-gray-900/90 tw-dark:bg-gray-50 tw-dark:text-gray-900 tw-dark:hover:bg-gray-50/90",
        destructive:
          "tw-bg-red-500 tw-text-gray-50 tw-shadow-sm tw-hover:bg-red-500/90 tw-dark:bg-red-900 tw-dark:text-gray-50 tw-dark:hover:bg-red-900/90",
        outline:
          "tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm tw-hover:bg-gray-100 tw-hover:text-gray-900 tw-dark:border-gray-800 tw-dark:bg-gray-950 tw-dark:hover:bg-gray-800 tw-dark:hover:text-gray-50",
        secondary:
          "tw-bg-gray-100 tw-text-gray-900 tw-shadow-sm tw-hover:bg-gray-100/80 tw-dark:bg-gray-800 tw-dark:text-gray-50 tw-dark:hover:bg-gray-800/80",
        ghost:
          "tw-hover:bg-gray-100 tw-hover:text-gray-900 tw-dark:tw-hover:bg-gray-800 tw-dark:tw-hover:text-gray-50",
        link: "tw-text-gray-900 tw-underline-offset-4 tw-hover:underline tw-dark:text-gray-50",
      },
      size: {
        default: "tw-h-9 tw-px-4 tw-py-2",
        sm: "tw-h-8 tw-rounded-md tw-px-3 tw-text-xs",
        lg: "tw-h-10 tw-rounded-md tw-px-8",
        icon: "tw-h-9 tw-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { className?: string; variant?: string; size?: number }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
