import { memo, useCallback, useMemo } from "react";

import { cn } from "~/lib/utils";
import {
  HourWeatherData,
  ExpandedHourlyComparisonProps,
} from "~/types/location.types";
import { celsiusToFahrenheit, militaryTimeToStandardTime } from "~/utils";

import { TableCell, TableRow } from "../ui/table";

export const ExpandedHourlyComparison = memo(function ({
  weatherDataOne,
  weatherDataTwo,
  dataKey,
  openCollapsable,
  titleList,
}: ExpandedHourlyComparisonProps) {
  const convertValue = useCallback((key: string, value: number | string) => {
    return new Set(["temp", "feelslike"]).has(key)
      ? celsiusToFahrenheit(parseFloat(value.toString()))
      : value;
  }, []);

  const getSecondVal = useCallback(
    (key: keyof HourWeatherData, timeOfDay: string) => {
      const value = weatherDataTwo.find((h) => h.datetime === timeOfDay)?.[
        key
      ] as string | null | undefined;
      return value !== undefined && value !== null
        ? convertValue(key, value)
        : undefined;
    },
    [convertValue, weatherDataTwo],
  );

  const renderTableRow = useMemo(() => {
    return weatherDataOne.map((hour: HourWeatherData, idx: number) => {
      const cellValueOne = convertValue(dataKey, hour[dataKey] as string);
      const cellValueTwo = getSecondVal(dataKey, hour.datetime);

      return (
        <TableRow
          key={idx}
          className={cn(
            "tw-border-b-0 even:tw-bg-indigo-900/50",
            openCollapsable ? "tw-table-row" : "tw-hidden",
            hour.datetime === "23:00:00" ? "!tw-border-b" : "",
          )}
        >
          <TableCell className="tw-py-0 tw-text-indigo-100">
            {militaryTimeToStandardTime(hour.datetime)}
          </TableCell>
          <TableCell className="tw-py-0">
            <p className="tw-py-3 tw-text-indigo-100">
              {cellValueOne} <span>{titleList[1]}</span>
            </p>
          </TableCell>
          <TableCell className="tw-py-0">
            <p className="tw-py-3 tw-text-indigo-100">
              {cellValueTwo} <span>{titleList[1]}</span>
            </p>
          </TableCell>
        </TableRow>
      );
    });
  }, [
    convertValue,
    dataKey,
    getSecondVal,
    openCollapsable,
    titleList,
    weatherDataOne,
  ]);
  return (
    <>
      <TableRow
        className={cn(
          "tw-border-b-0 even:tw-bg-indigo-900/50",
          openCollapsable ? "tw-table-row" : "tw-hidden",
        )}
      >
        <TableCell className="tw-py-0 tw-text-indigo-100 tw-font-semibold">
          Hour
        </TableCell>
        <TableCell className="tw-py-0">
          <p className="tw-py-3 tw-text-indigo-100 tw-font-semibold">Day One</p>
        </TableCell>
        <TableCell className="tw-py-0">
          <p className="tw-py-3 tw-text-indigo-100 tw-font-semibold">Day Two</p>
        </TableCell>
      </TableRow>
      {renderTableRow}
    </>
  );
});
ExpandedHourlyComparison.displayName = "ExpandedHourlyComparison";
