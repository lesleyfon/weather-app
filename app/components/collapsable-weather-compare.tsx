import { SquareChevronDown, SquareChevronUp } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";

import { nonMinMaxWeatherKeys, weatherConditionsToIconMap } from "~/constants";
import { cn } from "~/lib/utils";
import {
  HourWeatherData,
  WeatherCompareTableProps,
  ExpandableWeatherRowProps,
  TableCellContentProps,
  ExpandedHourlyComparisonProps,
} from "~/types/location.types";
import {
  celsiusToFahrenheit,
  formatMmDdYyToDateString,
  hourDataKeysToFullWord,
  militaryTimeToStandardTime,
} from "~/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type WeatherIconKeys = keyof typeof weatherConditionsToIconMap;

const WeatherMetricsOverview = memo(function ({
  data,
  dataKey,
  sign,
}: {
  data: HourWeatherData[];
  dataKey: keyof HourWeatherData;
  sign: string;
}) {
  if (!data?.length) {
    return <p>No data available</p>;
  }

  const titles = data.reduce(
    (acc: Record<string, { max?: number; min?: number } | string>, curr) => {
      Object.entries(curr).forEach(
        ([key, value]: [string, string | number]) => {
          const numRegex = /^-?\d+(\.\d+)?$/;
          if (
            !nonMinMaxWeatherKeys.has(key) &&
            numRegex.test(value as string)
          ) {
            const numValue = Number(value);
            if (key in acc && typeof acc === "object" && acc[key]) {
              const item = acc[key] as { max: number; min?: number };
              item.max = Math.max(item.max, numValue);
              item.min = Math.min(item.min ?? numValue, numValue);
            } else {
              acc[key] = { max: numValue, min: numValue };
            }
          } else {
            acc[key] = value as string;
          }
        },
      );
      return acc;
    },
    {},
  );

  if (nonMinMaxWeatherKeys.has(dataKey)) {
    return <p>{titles[dataKey] as string}</p>;
  }

  const { min, max } = titles[dataKey] as { max: number; min: number };

  return (
    <div>
      <p>
        <span>
          <strong>High: </strong> {max}
          {sign}
        </span>{" "}
        <span> &#x2215; </span>{" "}
        <span>
          <strong>Low: </strong>
          {min}
          {sign}
        </span>
      </p>
    </div>
  );
});
WeatherMetricsOverview.displayName = "Weather Statistics";

const TableCellContent = memo(
  ({
    Icon,
    titleList,
    weatherData,
    dataKey,
    openCollapsable,
  }: TableCellContentProps) => (
    <>
      <p className="tw-flex tw-gap-4" aria-expanded="false">
        {Icon ? <Icon aria-hidden="true" /> : null}
        <strong>{titleList[0]}</strong>
        {openCollapsable ? <SquareChevronUp /> : <SquareChevronDown />}
      </p>
      <WeatherMetricsOverview
        data={weatherData}
        dataKey={dataKey}
        sign={titleList[1]}
      />
    </>
  ),
);
TableCellContent.displayName = "TableCellContent";

function ExpandedHourlyComparison({
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
}
function ExpandableWeatherRow({
  titleList,
  weatherDataTwo,
  weatherDataOne,
  dataKey,
}: ExpandableWeatherRowProps) {
  const [openCollapsable, setOpenCollapsable] = useState(false);

  const handleToggleCollapsable = useCallback(() => {
    setOpenCollapsable(!openCollapsable);
  }, [openCollapsable]);

  const Icon =
    dataKey in weatherConditionsToIconMap && (dataKey as WeatherIconKeys)
      ? weatherConditionsToIconMap[dataKey as WeatherIconKeys]
      : null;
  return (
    <>
      <TableRow
        className={cn(
          "tw-text-indigo-100 hover:tw-bg-indigo-900/50 tw-transition tw-duration-500 tw-ease-in-out tw-cursor-pointer",
          openCollapsable ? "tw-border-b-0" : "",
        )}
        onClick={handleToggleCollapsable}
      >
        {[weatherDataOne, weatherDataTwo].map((weatherData) => (
          <TableCell key={dataKey}>
            <TableCellContent
              Icon={Icon}
              titleList={titleList}
              weatherData={weatherData}
              dataKey={dataKey}
              openCollapsable={openCollapsable}
            />
          </TableCell>
        ))}
      </TableRow>
      <ExpandedHourlyComparison
        {...{
          weatherDataTwo,
          weatherDataOne,
          dataKey,
          openCollapsable,
          titleList,
        }}
      />
    </>
  );
}

const WeatherTableRow = memo(
  ({
    weatherDataOne,
    weatherDataTwo,
  }: Pick<WeatherCompareTableProps, "weatherDataOne" | "weatherDataTwo">) => {
    return (
      <>
        {Object.entries(hourDataKeysToFullWord).map(([key, titleList]) => {
          return (
            <ExpandableWeatherRow
              key={key}
              {...{
                weatherDataOne,
                weatherDataTwo,
                dataKey: key as keyof HourWeatherData,
                titleList: titleList,
              }}
            />
          );
        })}
      </>
    );
  },
);
WeatherTableRow.displayName = "WeatherTableRow";

const TableHeaderRow = memo(
  ({
    firstDatetime,
    secondDatetime,
  }: Pick<WeatherCompareTableProps, "firstDatetime" | "secondDatetime">) => (
    <TableRow>
      <TableHead className="tw-text-indigo-100 tw-text-2xl tw-font-extrabold">
        <p className="tw-py-3">{formatMmDdYyToDateString(firstDatetime)}</p>
      </TableHead>
      <TableHead className="tw-text-indigo-100 tw-text-2xl tw-font-extrabold">
        <p className="tw-py-3">{formatMmDdYyToDateString(secondDatetime)}</p>
      </TableHead>
    </TableRow>
  ),
);

TableHeaderRow.displayName = "TableHeaderRow";

export default function CollapsibleCompareTable({
  weatherDataOne,
  weatherDataTwo,
  firstDatetime,
  secondDatetime,
}: WeatherCompareTableProps) {
  return (
    <Table className=" tw-my-8 ">
      <TableHeader>
        <TableHeaderRow
          firstDatetime={firstDatetime}
          secondDatetime={secondDatetime}
        />
      </TableHeader>
      <TableBody>
        <WeatherTableRow
          weatherDataOne={weatherDataOne}
          weatherDataTwo={weatherDataTwo}
        />
      </TableBody>
    </Table>
  );
}
