import { twMerge } from "tailwind-merge";

import {
  WeatherCompareTableProps,
  TableRowPropType,
  TableDataListItemPropType,
} from "~/types/location.types";
import {
  celsiusToFahrenheit,
  militaryTimeToStandardTime,
  hourDataKeysToFullWord,
} from "~/utils";

import WeatherConditionSVG from "./WeatherConditionWrapper";

const ListItem = ({
  liClassNames = "",
  liParagraphClassNames = "tw-py-3 tw-leading-[1.5] tw-text-center tw-text-sm tw-not-italic tw-font-normal tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-1",
  objKey,
  hour,
  liSpanClass,
  tdValue,
  symbol,
}: TableDataListItemPropType) => (
  <li className={`${liClassNames}`}>
    <p className={liParagraphClassNames}>
      {objKey === "conditions" && hour?.conditions && (
        <WeatherConditionSVG condition={hour?.conditions.toLowerCase()} />
      )}
      <span className={liSpanClass}>
        {tdValue}
        {symbol}
      </span>
    </p>
  </li>
);

const TableRow = ({
  objKey,
  symbol,
  weatherDataOne,
  weatherDataTwo,
}: TableRowPropType) => {
  return weatherDataOne.map((hour) => {
    let tdValueOne;

    const hourTwo = weatherDataTwo.find(
      (h) =>
        (h[objKey as keyof typeof h] ||
          Number.isFinite(h[objKey as keyof typeof h])) &&
        h,
    );
    let tdValueTwo = hourTwo?.[objKey as keyof typeof hour];

    if (objKey === "temp" || objKey === "feelslike") {
      const temperature = hour[objKey as keyof typeof hour] ?? 0;
      tdValueOne = celsiusToFahrenheit(parseFloat(temperature.toString()));
      tdValueTwo = tdValueTwo
        ? celsiusToFahrenheit(parseFloat(tdValueTwo.toString()))
        : 0;
    } else {
      tdValueOne = hour[objKey as keyof typeof hour];
    }

    const conditionClasses = objKey === "conditions" ? "!tw-text-xs" : "";
    const liConditionClasses = objKey === "conditions" ? "!tw-h-[76px]" : "";
    return (
      <th key={objKey}>
        <p className=" tw-text-left tw-py-2 tw-h-10" />
        <ul>
          <ListItem
            liClassNames={`tw-bg-[#d1d6f4] ${liConditionClasses}`}
            liSpanClass={conditionClasses}
            hour={hour}
            tdValue={tdValueOne as string | number}
            symbol={symbol}
            objKey={objKey}
          />
          <ListItem
            liClassNames={`tw-bg-white ${liConditionClasses}`}
            liSpanClass={conditionClasses}
            hour={hour}
            tdValue={tdValueTwo as string | number}
            symbol={symbol}
            objKey={objKey}
          />
        </ul>
      </th>
    );
  });
};

const WeatherCompareTable = ({
  weatherDataOne,
  weatherDataTwo,
  firstDatetime,
  secondDatetime,
}: WeatherCompareTableProps) => {
  const conditionClass = {
    conditions:
      "!tw-h-[76px] tw-flex tw-justify-center tw-content-center tw-flex-wrap",
  };
  return (
    <div className="tw-w-[1060px] tw-overflow-x-auto tw-relative tw-scroll-smooth  tw-shadow-[0_2px_24px_0_rgba(63,63,63,0.1)] tw-min-h-[800px] tw-rounded-xl tw-my-8">
      <table className="tw-w-full ">
        <thead>
          <tr className=" tw-bg-[#8884d8]">
            <th className="tw-text-left tw-sticky tw-z-[1] tw-font-semibold tw-w-[120px] tw-text-base tw-pl-4 tw--left-px">
              <div className="tw-w-[120px] tw-z-[1] tw-font-semibold  tw-text-base tw-pl-4 tw--left-px" />
            </th>
            {weatherDataOne.map((hour) => (
              <td
                key={hour.datetime}
                style={{
                  tableLayout: "fixed",
                  width: "200px",
                }}
              >
                <p className=" tw-w-[120px] tw-py-5 tw-text-center tw-leading-[2] tw-h-16">
                  {militaryTimeToStandardTime(hour.datetime.slice(0, -3))}
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
                className=" hover:tw-bg-[#e6e9f9] tw-border tw-border-t-0 tw-border-x-0 tw-border-[#b5bcec] tw-border-b"
              >
                <th>
                  <p className=" tw-text-left tw-py-2 tw-pl-1">{thTitle}</p>
                  <ul>
                    <ListItem
                      tdValue={firstDatetime}
                      liClassNames={twMerge(
                        "tw-bg-[#d1d6f4]",
                        conditionClass?.[key as "conditions"],
                      )}
                      liParagraphClassNames="tw-py-3 tw-text-center tw-leading-[1.5] tw-text-sm"
                    />
                    <ListItem
                      tdValue={secondDatetime}
                      liClassNames={twMerge(
                        conditionClass?.[key as "conditions"],
                      )}
                      liParagraphClassNames="tw-py-3 tw-text-center tw-leading-[1.5] tw-text-sm"
                    />
                  </ul>
                </th>
                <TableRow
                  objKey={key}
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
