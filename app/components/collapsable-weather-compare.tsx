import { memo, useState } from "react";

import { weatherConditionsToIconMap } from "~/constants";
import { cn } from "~/lib/utils";
import {
  HourWeatherData,
  WeatherCompareTableProps,
  ExpandableWeatherRowProps,
} from "~/types/location.types";
import { hourDataKeysToFullWord } from "~/utils";

import { ExpandedHourlyComparison } from "./collapsable-weather-components/ExpandedHourlyComparison";
import { TableCellContent } from "./collapsable-weather-components/TableCellContent";
import { TableHeaderRow } from "./collapsable-weather-components/TableHeaderRow";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";

type WeatherIconKeys = keyof typeof weatherConditionsToIconMap;

function ExpandableWeatherRow({
  titleList,
  weatherDataTwo,
  weatherDataOne,
  dataKey,
}: ExpandableWeatherRowProps) {
  const [openCollapsable, setOpenCollapsable] = useState(false);

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
        onClick={() => setOpenCollapsable((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setOpenCollapsable((prev) => !prev);
          }
        }}
        role="button"
        aria-expanded={openCollapsable}
        tabIndex={0}
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
