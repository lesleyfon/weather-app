import { memo } from "react";

import { nonMinMaxWeatherKeys } from "~/constants";
import { HourWeatherData } from "~/types/location.types";

export const WeatherMetricsOverview = memo(function ({
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
