import { SquareChevronDown, SquareChevronUp } from "lucide-react";
import { memo } from "react";

import { TableCellContentProps } from "~/types/location.types";

import { WeatherMetricsOverview } from "./WeatherMetricsOverview";

export const TableCellContent = memo(
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
        {openCollapsable ? (
          <SquareChevronUp aria-hidden="true" />
        ) : (
          <SquareChevronDown aria-hidden="true" />
        )}
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
