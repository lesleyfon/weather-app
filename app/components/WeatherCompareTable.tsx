import { useCallback } from "react";
import { twMerge } from "tailwind-merge";

import {
  WeatherCompareTableProps,
  HourWeatherData,
} from "~/types/location.types";
import { militaryTimeToStandardTime, hourDataKeysToFullWord } from "~/utils";

import { ListItem } from "./ListItem";
import { TableRow } from "./TableRow";

const WeatherCompareTable = ({
  weatherDataOne,
  weatherDataTwo,
  firstDatetime,
  secondDatetime,
}: WeatherCompareTableProps) => {
  const TableRowTitleData = useCallback(
    (key: string) => {
      const conditionClass = {
        conditions:
          "!tw-h-[76px] tw-flex tw-justify-center tw-content-center tw-flex-wrap",
        "0": "tw-bg-[#d1d6f4]", // Background color for the first datetime
        "1": "tw-bg-white", // Background color for the second datetime
      };

      return [{ tdValue: firstDatetime }, { tdValue: secondDatetime }].map(
        (data, idx) => (
          <ListItem
            key={data.tdValue}
            tdValue={data.tdValue}
            liClassNames={twMerge(
              conditionClass?.[key as "conditions"],
              conditionClass?.[String(idx) as "0" | "1"],
            )}
          />
        ),
      );
    },
    [firstDatetime, secondDatetime],
  );

  return (
    <div className="tw-w-[1060px] tw-overflow-x-auto tw-relative tw-scroll-smooth  tw-shadow-[0_2px_24px_0_rgba(63,63,63,0.1)] tw-min-h-[800px] tw-rounded-xl tw-my-8">
      <table className="tw-w-full">
        <thead>
          <tr className="tw-bg-[#8884d8]">
            <th className="tw-text-left tw-sticky tw-z-[1] tw-font-semibold tw-w-[120px] tw-text-base tw-pl-4 tw--left-px">
              <div className="tw-w-[120px] tw-z-[1] tw-font-semibold  tw-text-base tw-pl-4 tw--left-px" />
            </th>
            {weatherDataOne.map(({ datetime }) => (
              <td
                key={datetime}
                style={{ tableLayout: "fixed", width: "200px" }}
              >
                <p className="tw-w-[120px] tw-py-5 tw-text-center tw-leading-[2] tw-h-16">
                  {militaryTimeToStandardTime(datetime.slice(0, -3))}
                </p>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(hourDataKeysToFullWord).map(
            ([key, [thTitle, symbol]]) => (
              <tr
                key={thTitle}
                className="hover:tw-bg-[#e6e9f9] tw-border tw-border-t-0 tw-border-x-0 tw-border-[#b5bcec] tw-border-b"
              >
                <th>
                  <p className="tw-text-left tw-py-2 tw-pl-1">{thTitle}</p>
                  <ul>{TableRowTitleData(key)}</ul>
                </th>
                <TableRow
                  objKey={key as keyof HourWeatherData}
                  symbol={symbol}
                  weatherDataOne={weatherDataOne}
                  weatherDataTwo={weatherDataTwo}
                />
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherCompareTable;
