import { SquareChevronDown } from "lucide-react";
import { memo } from "react";

import { nonMinMaxWeatherKeys, weatherConditionsToIconMap } from "~/constants";
import {
  HourWeatherData,
  WeatherCompareTableProps,
} from "~/types/location.types";
import { formatMmDdYyToDateString, hourDataKeysToFullWord } from "~/utils";

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
  }: {
    Icon: React.ComponentType | null;
    titleList: string[];
    weatherData: HourWeatherData[];
    dataKey: keyof HourWeatherData;
  }) => (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
      <p className="tw-flex tw-gap-4" role="button" aria-expanded="false">
        {Icon ? <Icon aria-hidden="true" /> : null}
        <strong>{titleList[0]}</strong>
        <SquareChevronDown aria-hidden="true" />
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

const WeatherTableRow = memo(
  ({
    weatherDataOne,
    weatherDataTwo,
  }: Pick<WeatherCompareTableProps, "weatherDataOne" | "weatherDataTwo">) => (
    <>
      {Object.entries(hourDataKeysToFullWord).map(([key, titleList]) => {
        const Icon =
          key in weatherConditionsToIconMap && (key as WeatherIconKeys)
            ? weatherConditionsToIconMap[key as WeatherIconKeys]
            : null;
        return (
          <TableRow
            key={key}
            className="tw-text-indigo-100 hover:tw-bg-indigo-900/50 tw-transition tw-duration-500 tw-ease-in-out"
          >
            {[weatherDataOne, weatherDataTwo].map((weatherData) => (
              <TableCell key={key}>
                <TableCellContent
                  Icon={Icon}
                  titleList={titleList}
                  weatherData={weatherData}
                  dataKey={key as keyof HourWeatherData}
                />
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </>
  ),
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
