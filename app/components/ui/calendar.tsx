import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker, DropdownProps } from "react-day-picker";

import { buttonVariants } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  mode,
  showOutsideDays = true,
  ...props
}: CalendarProps & {
  className?: string;
  classNames?: object;
  showOutsideDays?: boolean;
  mode: string;
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("tw-p-3", className)}
      classNames={{
        months:
          "tw-flex tw-flex-col sm:tw-flex-row tw-space-y-4 sm:tw-space-x-4 sm:tw-space-y-0",
        month: "tw-space-y-4",
        caption:
          "tw-flex tw-justify-center tw-pt-1 tw-relative tw-items-center",
        caption_label: "tw-text-sm tw-font-medium",
        nav: "tw-space-x-1 tw-flex tw-items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "tw-h-7 tw-w-7 tw-bg-transparent tw-p-0 tw-opacity-50 tw-hover:opacity-100",
        ),
        nav_button_previous: "tw-absolute tw-left-1",
        nav_button_next: "tw-absolute tw-right-1",
        table: "tw-w-full tw-border-collapse tw-space-y-1",
        head_row: "tw-flex",
        head_cell:
          "tw-text-gray-500 tw-rounded-md tw-w-8 tw-font-normal tw-text-[0.8rem] tw-dark:text-gray-400",
        row: "tw-flex tw-w-full tw-mt-2",
        cell: cn(
          "tw-relative tw-p-0 tw-text-center tw-text-sm tw-focus-within:relative tw-focus-within:z-20 [&:has([aria-selected])]:tw-bg-gray-100 [&:has([aria-selected].day-outside)]:tw-bg-gray-100/50 [&:has([aria-selected].day-range-end)]:tw-rounded-r-md tw-dark:[&:has([aria-selected])]:tw-bg-gray-800 tw-dark:[&:has([aria-selected].day-outside)]:tw-bg-gray-800/50",
          mode === "range"
            ? "[&:has(>.day-range-end)]:tw-rounded-r-md [&:has(>.day-range-start)]:tw-rounded-l-md tw-first:[&:has([aria-selected])]:tw-rounded-l-md tw-last:[&:has([aria-selected])]:tw-rounded-r-md"
            : "[&:has([aria-selected])]:tw-rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "tw-h-8 tw-w-8 tw-p-0 tw-font-normal tw-aria-selected:opacity-100",
        ),
        day_range_start: "tw-day-range-start",
        day_range_end: "tw-day-range-end",
        day_selected:
          "tw-bg-gray-900 tw-text-gray-50 tw-hover:bg-gray-900 tw-hover:text-gray-50 tw-focus:bg-gray-900 tw-focus:text-gray-50 tw-dark:bg-gray-50 tw-dark:text-gray-900 tw-dark:hover:bg-gray-50 tw-dark:hover:text-gray-900 tw-dark:focus:bg-gray-50 tw-dark:focus:text-gray-900",
        day_today:
          "tw-bg-gray-100 tw-text-gray-900 tw-dark:bg-gray-800 tw-dark:text-gray-50",
        day_outside:
          "tw-day-outside tw-text-gray-500 tw-aria-selected:bg-gray-100/50 tw-aria-selected:text-gray-500 tw-dark:text-gray-400 tw-dark:aria-selected:bg-gray-800/50 tw-dark:aria-selected:text-gray-400",
        day_disabled: "tw-text-gray-500 tw-opacity-50 tw-dark:text-gray-400",
        day_range_middle:
          "tw-aria-selected:bg-gray-100 tw-aria-selected:text-gray-900 tw-dark:tw-aria-selected:bg-gray-800 tw-dark:tw-aria-selected:text-gray-50",
        day_hidden: "tw-invisible",
        ...classNames,
      }}
      components={{
        Dropdown: ({ value, onChange, children, ...props }: DropdownProps) => {
          const options = React.Children.toArray(
            children,
          ) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[];
          const selected = options.find((child) => child.props.value === value);
          const handleChange = (value: string) => {
            const changeEvent = {
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(changeEvent);
          };
          return (
            <Select
              value={value?.toString()}
              onValueChange={(value) => {
                handleChange(value);
              }}
              {...props}
            >
              <SelectTrigger className="pr-1.5 focus:ring-0">
                <SelectValue>{selected?.props?.children}</SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
                <ScrollArea className="h-80">
                  {options.map((option, id: number) => (
                    <SelectItem
                      key={`${option.props.value}-${id}`}
                      value={option.props.value?.toString() ?? ""}
                    >
                      {option.props.children}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          );
        },
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="tw-h-4 tw-w-4" {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="tw-h-4 tw-w-4" {...props} />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
