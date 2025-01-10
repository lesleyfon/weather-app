"use client";

import { useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { type DayClickEventHandler } from "react-day-picker";

import { cn } from "~/lib/utils";
import {
  DATE_FORMAT,
  DateType,
  QUERY_PARAMS_ENUM,
} from "~/types/location.types";
import { shouldDisableDate } from "~/utils";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function DatePicker({
  dateType,
  defaultDate,
}: {
  dateType: DateType;
  defaultDate: Date;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [date, setDate] = useState<Date | undefined>(defaultDate);

  const handleDateSelect = useCallback(
    (dateType: DateType): DayClickEventHandler => {
      return function (date) {
        // This simply forces an page update
        setDate(date);

        // This is the default date
        const defaultDate = format(new Date(), DATE_FORMAT);
        const currentDate = format(date, DATE_FORMAT);

        const getDateValueFromSearchParams = (paramType: DateType) =>
          searchParams.get(QUERY_PARAMS_ENUM[`${paramType}_DATE`]);

        // Get the date value for the given date type
        const getDateValue = (paramType: DateType) =>
          paramType === dateType
            ? currentDate
            : getDateValueFromSearchParams(paramType) || defaultDate;

        // if the current date is same as what is already in the search params, we don't want to update the search params
        if (getDateValueFromSearchParams(dateType) === currentDate) {
          return;
        }

        setSearchParams({
          [QUERY_PARAMS_ENUM.FIRST_DATE]: getDateValue(DateType.FIRST),
          [QUERY_PARAMS_ENUM.SECOND_DATE]: getDateValue(DateType.SECOND),
        });
      };
    },
    [searchParams, setSearchParams],
  );
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "tw-pl-3 tw-text-left tw-font-normal tw-h-[52px] tw-w-full",
              !date && "tw-text-muted-foreground",
            )}
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="tw-ml-auto tw-h-4 tw-w-4 tw-opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="tw-w-auto tw-p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            className="tw-rounded-md  tw-border"
            onDayClick={handleDateSelect(dateType)}
            disabled={shouldDisableDate}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
