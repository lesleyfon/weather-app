import { SquareChevronDown } from "lucide-react";
import { memo, useMemo } from "react";

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

const WeatherStatistics = memo(function ({
  data,
  dataKey,
  sign,
}: {
  data: HourWeatherData[];
  dataKey: string;
  sign: string;
}) {
  const titles = data.reduce(
    (acc: Record<string, { max?: number; min?: number } | string>, curr) => {
      Object.entries(curr).forEach(([key, value]) => {
        if (!nonMinMaxWeatherKeys.has(key)) {
          if (key in acc && typeof acc === "object" && acc[key]) {
            const item = acc[key] as { max: number; min?: number };
            item.max = Math.max(item.max, Number(value));
            item.min = Math.min(item.max, Number(value));
          } else {
            acc[key] = { max: Number(value), min: Number(value) };
          }
        } else {
          acc[key] = value;
        }
      });
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

WeatherStatistics.displayName = "Weather Statistics";

export default function CollapsibleCompareTable({
  weatherDataOne,
  weatherDataTwo,
  firstDatetime,
  secondDatetime,
}: WeatherCompareTableProps) {
  const weatherTableRow = useMemo(() => {
    return Object.entries(hourDataKeysToFullWord).map(([key, titleList]) => {
      const Icon =
        key in weatherConditionsToIconMap && (key as WeatherIconKeys)
          ? weatherConditionsToIconMap[key as WeatherIconKeys]
          : null;
      return (
        <TableRow
          key={key}
          className="tw-text-indigo-100 hover:tw-bg-indigo-900/50 tw-transition tw-duration-500 tw-ease-in-out"
        >
          <TableCell>
            <p className="tw-flex tw-gap-4">
              {Icon ? <Icon /> : null}
              <strong>{titleList[0]}</strong>
              <SquareChevronDown />
            </p>
            <WeatherStatistics
              data={weatherDataOne}
              dataKey={key}
              sign={titleList[1]}
            />
          </TableCell>
          <TableCell>
            <p className="tw-flex tw-gap-4">
              {Icon ? <Icon /> : null}
              <strong>{titleList[0]}</strong>
              <SquareChevronDown />
            </p>
            <WeatherStatistics
              data={weatherDataTwo}
              dataKey={key}
              sign={titleList[1]}
            />
          </TableCell>
        </TableRow>
      );
    });
  }, [weatherDataOne, weatherDataTwo]);

  return (
    <Table className=" tw-my-8 ">
      <TableHeader>
        <TableRow className="">
          <TableHead className=" tw-text-indigo-100 tw-text-2xl tw-font-extrabold">
            <p className="tw-py-3">{formatMmDdYyToDateString(firstDatetime)}</p>
          </TableHead>
          <TableHead className="tw-text-indigo-100 tw-text-2xl tw-font-extrabold">
            <p className="tw-py-3">
              {formatMmDdYyToDateString(secondDatetime)}
            </p>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{weatherTableRow}</TableBody>
    </Table>
  );
}
