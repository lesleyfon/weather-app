import * as React from "react";

import { cn } from "~/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "tw-rounded-xl tw-border tw-border-gray-200 tw-bg-white tw-text-gray-950 tw-shadow dark:tw-border-gray-800 dark:tw-bg-gray-950 dark:tw-text-gray-50",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("tw-flex tw-flex-col tw-space-y-1.5 tw-p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "tw-font-semibold tw-leading-none tw-tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "tw-text-sm tw-text-gray-500 dark:tw-text-gray-400",
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("tw-p-6 tw-pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("tw-flex tw-items-center tw-p-6 tw-pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
