import * as React from "react";

import { cn } from "~/lib/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <div className="tw-relative tw-w-full tw-overflow-auto">
    <table
      ref={ref}
      className={cn("tw-w-full tw-caption-bottom tw-text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:tw-border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:tw-border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "tw-border-t tw-bg-gray-100/50 font-medium [&>tr]:last:tw-border-b-0 dark:tw-bg-gray-800/50",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "tw-border-b tw-transition-colors  dark:data-[state=selected]:tw-bg-gray-800",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "tw-h-10 tw-px-2 tw-text-left tw-align-middle tw-font-medium tw-text-gray-500 [&:has([role=checkbox])]:tw-pr-0 [&>[role=checkbox]]:tw-translate-y-[2px] dark:tw-text-gray-400",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "tw-p-2 tw-align-middle [&:has([role=checkbox])]:tw-pr-0 [&>[role=checkbox]]:tw-translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "tw-mt-4 tw-text-sm tw-text-gray-500 dark:tw-text-gray-400",
      className,
    )}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
