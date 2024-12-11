import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import "react-json-pretty/themes/monikai.css";

import { getWeatherLocation } from "~/api/weather.api";
import { StackChart } from "~/components/stackChart";
import WeatherCompareTable from "~/components/WeatherCompareTable";
import data1 from "~/temp-data/data1.json";
import data2 from "~/temp-data/data2.json";
import { ENV_TYPES, QUERY_PARAMS_ENUM } from "~/types/location.types";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url).searchParams;

  const firstDate = url.get(QUERY_PARAMS_ENUM.FIRST_DATE)?.toString() || null;
  const secondDate = url.get(QUERY_PARAMS_ENUM.SECOND_DATE)?.toString() || null;
  const longitude = url.get(QUERY_PARAMS_ENUM.LONGITUDE)?.toString() || null;
  const latitude = url.get(QUERY_PARAMS_ENUM.LATITUDE)?.toString() || null;

  if (!longitude || !latitude) {
    return { firstDate: "", secondDate: "" };
  }

  const weatherParams = {
    longitude,
    latitude,
    WEATHER_VISUAL_CROSSING_API_KEY: process.env
      .WEATHER_VISUAL_CROSSING_API_KEY as ENV_TYPES["WEATHER_VISUAL_CROSSING_API_KEY"],
  };

  const [dataOne = data1, dataTwo = data2] = await Promise.all([
    getWeatherLocation({
      ...weatherParams,
      date: firstDate!,
    }),
    getWeatherLocation({
      ...weatherParams,
      date: secondDate!,
    }),
  ]);

  return { dataOne, dataTwo };
};

export default function RemixLoader() {
  const { dataOne, dataTwo } = useLoaderData<typeof loader>();
  const shouldRender = dataOne && dataTwo;

  return (
    <main className="tw-full tw-flex tw-flex-col tw-justify-center tw-pt-6">
      <div className="tw-flex tw-w-full tw-justify-center">
        {!shouldRender ? (
          <h1>No data / Incomplete information</h1>
        ) : (
          <section className=" tw-flex tw-flex-col tw-gap-5 tw-w-[1050px] tw-h-[500px]">
            <StackChart conditionOne={dataOne} conditionTwo={dataTwo} />
          </section>
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
