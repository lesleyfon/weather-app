import { useCallback } from "react";

import { HourWeatherData, TableRowPropType } from "~/types/location.types";
import { celsiusToFahrenheit } from "~/utils";

import { ListItem } from "./ListItem";

export const TableRow = ({
  objKey,
  symbol,
  weatherDataOne,
  weatherDataTwo,
}: TableRowPropType & { objKey: keyof HourWeatherData }) => {
  const hourTwo = weatherDataTwo.find(
    (h) => (h[objKey] || Number.isFinite(h[objKey])) && h,
  );

  const getValue = useCallback((key: string, value: number | string) => {
    if (new Set(["temp", "feelslike"]).has(key)) {
      return celsiusToFahrenheit(parseFloat(value.toString()));
    }
    return value;
  }, []);

  return weatherDataOne.map((hour) => {
    const celValOne = getValue(objKey, hour[objKey] as string);
    const cellValTwo = getValue(objKey, hourTwo?.[objKey] as string);

    const conditionClasses = objKey === "conditions" ? "!tw-text-xs" : "";
    const liConditionClasses = objKey === "conditions" ? "!tw-h-[76px]" : "";
    const classnames = {
      "0": `tw-bg-[#d1d6f4] ${liConditionClasses}`,
      "1": `tw-bg-white ${liConditionClasses}`,
    };
    return (
      <th key={objKey}>
        <p className=" tw-text-left tw-py-2 tw-h-10" />
        <ul>
          {[celValOne, cellValTwo].map((val, idx) => (
            <ListItem
              key={val}
              liClassNames={classnames?.[idx as 0 | 1]}
              liSpanClass={conditionClasses}
              hour={hour}
              tdValue={val}
              symbol={symbol}
              objKey={objKey}
            />
          ))}
        </ul>
      </th>
    );
  });
};
