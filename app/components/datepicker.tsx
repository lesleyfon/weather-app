"use client";

import { useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { type DayClickEventHandler } from "react-day-picker";

import {
  DATE_FORMAT,
  DateType,
  QUERY_PARAMS_ENUM,
} from "~/types/location.types";
import { shouldDisableDate } from "~/utils";

import { Calendar } from "./ui/calendar";

export default function DatePicker({ dateType }: { dateType: DateType }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [date, setDate] = useState<Date | undefined>(new Date());

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
    <Calendar
      mode="single"
      selected={date}
      className="tw-rounded-md  tw-border"
      onDayClick={handleDateSelect(dateType)}
      disabled={shouldDisableDate}
    />
  );
}
