import { Fragment } from "react";

import { HourWeatherData } from "~/types/location.types";
import {
  celsiusToFahrenheit,
  militaryTimeToStandardTime,
  hourDataKeysToFullWord,
} from "~/utils";

import WeatherConditionSVG from "./WeatherConditionWrapper";

const TableRow = ({
  objKey,
  symbol,
  weatherDataOne,
  weatherDataTwo,
}: {
  objKey: string;
  symbol: string;
  weatherDataTwo: HourWeatherData[];
  weatherDataOne: HourWeatherData[];
}) => {
  return (
    <>
      {weatherDataOne.map((hour) => {
        let tdValueOne;

        const hourTwo = weatherDataTwo.find((h) => {
          if (
            h[objKey as keyof typeof h] ||
            Number.isFinite(h[objKey as keyof typeof h])
          ) {
            return h;
          }
        });
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
        const liConditionClasses =
          objKey === "conditions" ? "!tw-h-[76px]" : "";
        return (
          <th>
            <p className=" tw-text-left tw-py-2 tw-h-10" />
            <ul>
              <li className={`tw-bg-[#d1d6f4] ${liConditionClasses}`}>
                <p className="tw-py-3 tw-leading-[1.5] tw-text-center tw-text-sm tw-not-italic tw-font-normal tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-1">
                  {objKey === "conditions" ? (
                    <WeatherConditionSVG
                      condition={hour?.conditions.toLowerCase()}
                    />
                  ) : null}
                  <span className={conditionClasses}>
                    {tdValueOne}
                    {symbol}
                  </span>
                </p>
              </li>
              <li className=" tw-bg-white">
                <p className="tw-py-3 tw-leading-[1.5] tw-text-center tw-text-sm tw-not-italic tw-font-normal tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-1 ">
                  {" "}
                  {objKey === "conditions" ? (
                    <>
                      {console.log(hourTwo?.conditions)}
                      <WeatherConditionSVG
                        condition={hourTwo?.conditions.toLowerCase() as string}
                      />
                    </>
                  ) : null}
                  <span className={conditionClasses}>
                    {tdValueTwo}
                    {symbol}
                  </span>
                </p>
              </li>
            </ul>
          </th>
        );
      })}
    </>
  );
};

const WeatherCompareTable = ({
  weatherDataOne,
  weatherDataTwo,
  firstDatetime,
  secondDatetime,
}: {
  firstDatetime: string;
  secondDatetime: string;
  weatherDataOne: HourWeatherData[];
  weatherDataTwo: HourWeatherData[];
}) => {
  return (
    <div className="tw-w-[1060px] tw-overflow-x-auto tw-relative tw-scroll-smooth  tw-shadow-[0_2px_24px_0_rgba(63,63,63,0.1)] tw-min-h-[800px] tw-rounded-xl tw-my-8">
      <table className="tw-w-full ">
        <thead>
          <tr className=" tw-bg-[#8884d8]">
            <>
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
            </>
          </tr>
        </thead>
        <tbody>
          {Object.entries(hourDataKeysToFullWord).map(
            ([key, [thTitle, symbol]]) => (
              <Fragment key={thTitle}>
                <tr className=" hover:tw-bg-[#e6e9f9] tw-border tw-border-t-0 tw-border-x-0 tw-border-[#b5bcec] tw-border-b">
                  <th>
                    <p className=" tw-text-left tw-py-2 tw-pl-1">{thTitle}</p>
                    <ul>
                      <li
                        className={`tw-bg-[#d1d6f4] ${
                          key === "conditions"
                            ? "!tw-h-[76px] tw-flex tw-justify-center tw-content-center tw-flex-wrap"
                            : ""
                        }`}
                      >
                        <p className="tw-py-3 tw-text-center tw-leading-[1.5] tw-text-sm">
                          {firstDatetime}
                        </p>
                      </li>
                      <li
                        className={`${
                          key === "conditions"
                            ? "!tw-h-[76px] tw-flex tw-justify-center tw-content-center tw-flex-wrap"
                            : ""
                        }`}
                      >
                        <p className="tw-py-3 tw-text-center tw-leading-[1.5] tw-text-sm">
                          {secondDatetime}
                        </p>
                      </li>
                    </ul>
                  </th>
                  <TableRow
                    objKey={key}
                    symbol={symbol}
                    weatherDataOne={weatherDataOne}
                    weatherDataTwo={weatherDataTwo}
                  />
                </tr>
              </Fragment>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherCompareTable;
