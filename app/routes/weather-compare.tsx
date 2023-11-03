import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getWeatherLocation } from "~/api/weather.api";

import "react-json-pretty/themes/monikai.css";

import { ENV_TYPES, WeatherData } from "~/types/location.types";
import LineGraph from "~/components/linegraph";
import data1 from "~/temp-data/data1.json";
import data2 from "~/temp-data/data2.json";

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

export default function RemixLoader() {
  const { dataOne, dataTwo } = useLoaderData<typeof loader>();

  return (
    <main className=" tw-flex tw-full tw-justify-center">
      <div className="tw-flex">
        {!dataOne && !dataTwo ? (
          <h1>No data / Incomplete information</h1>
        ) : (
          <section className=" tw-flex tw-flex-col tw-gap-5">
            <LineGraph data={dataOne} />
            <LineGraph data={dataTwo} />
          </section>
        )}
      </div>
    </main>
  );
}
