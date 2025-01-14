import { SquareChevronDown, SquareChevronUp } from "lucide-react";
import { memo, useCallback, useState } from "react";

import { nonMinMaxWeatherKeys, weatherConditionsToIconMap } from "~/constants";
import { cn } from "~/lib/utils";
import {
  HourWeatherData,
  WeatherCompareTableProps,
  ExpandableWeatherRowProps,
  TableCellContentProps,
} from "~/types/location.types";
import { formatMmDdYyToDateString, hourDataKeysToFullWord } from "~/utils";

import { Collapsible, CollapsibleContent } from "./ui/collapsible";
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
      <TableRow className={cn(openCollapsable ? "tw-table-row" : "tw-hidden")}>
        <TableCell colSpan={2}>
          <Collapsible open={openCollapsable}>
            <CollapsibleContent>
              Yes. Free to use for personal and commercial projects. No
              attribution required.
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
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
