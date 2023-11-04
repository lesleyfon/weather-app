import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import "react-json-pretty/themes/monikai.css";

import { getWeatherLocation } from "~/api/weather.api";
import LineGraph from "~/components/linegraph";
import data1 from "~/temp-data/data1.json";
import data2 from "~/temp-data/data2.json";
import { ENV_TYPES, HourWeatherData } from "~/types/location.types";
import { celsiusToFahrenheit, militaryTimeToStandardTime } from "~/utils";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url).searchParams;

  const firstDate = url.get("firstDate")?.toString() || null;
  const secondDate = url.get("secondDate")?.toString() || null;
  const longitude = url.get("longitude")?.toString() || null;
  const latitude = url.get("latitude")?.toString() || null;

  if (!longitude || !latitude) {
    return { firstDate: "", secondDate: "" };
  }

  const weatherParams = {
    longitude,
    latitude,
    WEATHER_VISUAL_CROSSING_API_KEY: process.env
      .WEATHER_VISUAL_CROSSING_API_KEY as ENV_TYPES["WEATHER_VISUAL_CROSSING_API_KEY"],
  };

  const dataOne =
    (await getWeatherLocation({
      ...weatherParams,
      date: firstDate!,
    })) ?? data1;
  const dataTwo =
    (await getWeatherLocation({
      ...weatherParams,
      date: secondDate!,
    })) ?? data2;

  return { dataOne, dataTwo };
};
const hourDataKeysToFullWord = {
  temp: ["Temperature", "°F"],
  feelslike: ["Feels Like", "°F"],
  conditions: ["Conditions", ""],
  precip: ["Precipitation", "in"],
  snow: ["Chance Of Snow", "%"],
  humidity: ["Humidity", "%"],
  windspeed: ["Wind Speed", "mph"],
  windgust: ["Wind Gust", "Miles"],
  cloudcover: ["Cloud Cover", "%"],
  visibility: ["Visibility", "Miles"],
};
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

        let tdValueTwo = weatherDataTwo.find(
          (hourTwo) => hourTwo[objKey as keyof typeof hourTwo],
        )?.[objKey as keyof typeof hour];

        if (objKey === "temp" || objKey === "feelslike") {
          const temperature = hour[objKey as keyof typeof hour] ?? 0;
          tdValueOne = celsiusToFahrenheit(parseFloat(temperature.toString()));

          tdValueTwo = tdValueTwo
            ? celsiusToFahrenheit(parseFloat(tdValueTwo.toString()))
            : 0;
        } else {
          tdValueOne = hour[objKey as keyof typeof hour];
        }

        return (
          <th>
            <p className=" tw-text-left tw-py-2 tw-h-10" />
            <ul>
              <li className="tw-bg-[#d1d6f4]">
                <p className="tw-py-3 tw-text-center tw-leading-[1.5]">
                  {tdValueOne}
                  {symbol}
                </p>
              </li>
              <li className=" tw-bg-white">
                <p className="tw-py-3 tw-text-center tw-leading-[1.5]">
                  {tdValueTwo}
                  {symbol}
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
              <>
                <tr className=" hover:tw-bg-[#e6e9f9] tw-border tw-border-t-0 tw-border-x-0 tw-border-[#b5bcec] tw-border-b">
                  <th>
                    <p className=" tw-text-left tw-py-2">{thTitle}</p>
                    <ul>
                      <li className=" tw-bg-[#d1d6f4]">
                        <p className="tw-py-3 tw-text-center tw-leading-[1.5]">
                          {firstDatetime}
                        </p>
                      </li>
                      <li>
                        <p className="tw-py-3 tw-text-center tw-leading-[1.5]">
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
              </>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function RemixLoader() {
  const { dataOne, dataTwo } = useLoaderData<typeof loader>();
  const shouldRender = dataOne && dataTwo;

  return (
    <main className="tw-full tw-flex tw-flex-col tw-justify-center">
      <div className="tw-flex tw-w-full tw-justify-center">
        {!shouldRender ? (
          <h1>No data / Incomplete information</h1>
        ) : (
          <>
            <section className=" tw-flex tw-flex-col tw-gap-5">
              <LineGraph data={dataOne} />
              <LineGraph data={dataTwo} />
            </section>
          </>
        )}
      </div>
      {shouldRender ? (
        <section className="tw-flex tw-justify-center">
          <WeatherCompareTable
            firstDatetime={dataOne.days[0].datetime}
            secondDatetime={dataTwo.days[0].datetime}
            weatherDataOne={dataOne.days[0].hours}
            weatherDataTwo={dataTwo.days[0].hours}
          />
        </section>
      ) : null}
    </main>
  );
}
