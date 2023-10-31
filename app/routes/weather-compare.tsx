import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getWeatherLocation } from "~/utils";

import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

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

  const weatherParams = { longitude, latitude };

  const dataOne = await getWeatherLocation({
    ...weatherParams,
    date: firstDate!,
  });
  const dataTwo = await getWeatherLocation({
    ...weatherParams,
    date: secondDate!,
  });

  return { dataOne, dataTwo };
};

export default function RemixLoader() {
  const { dataOne, dataTwo } = useLoaderData<typeof loader>();

  return (
    <>
      <div className=" tw-flex">
        {!dataOne && !dataTwo ? (
          <h1>No data / Incomplete information</h1>
        ) : (
          <>
            {/* Add a raw button */}
            <JSONPretty id="json-pretty-first" data={dataOne}></JSONPretty>
            <JSONPretty id="json-pretty-second" data={dataTwo}></JSONPretty>
          </>
        )}
      </div>
    </>
  );
}
