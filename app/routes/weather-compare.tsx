import { LoaderFunction, LoaderFunctionArgs, defer } from "@remix-run/node";
import { Link, useLoaderData, Await } from "@remix-run/react";
import OpenAI from "openai";
import { Suspense } from "react";

import "react-json-pretty/themes/monikai.css";

import { getWeatherLocation } from "~/api/weather.api";
import { SVG } from "~/components/chartcustomizedcursor";
import { MarkdownComponent } from "~/components/MarkdownComponent";
import { StackChart } from "~/components/stackChart";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Header } from "~/components/ui/header";
import { ScrollArea } from "~/components/ui/scroll-area";
import WeatherCompareTable from "~/components/WeatherCompareTable";
import { chatgptPrompt } from "~/constants";
import d1 from "~/temp-data/data1.json";
import d2 from "~/temp-data/data2.json";
import { ENV_TYPES, QUERY_PARAMS_ENUM } from "~/types/location.types";
import { formatMmDdYyToDateString } from "~/utils";

function DialogCompareSummary({ content }: { content: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Comparison Summary</Button>
      </DialogTrigger>
      <DialogContent className="tw-w-[700px] tw-h-[90vh]">
        <ScrollArea>
          <MarkdownComponent content={content} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

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
  if (!firstDate || !secondDate) {
    // TODO: redirect to home page
    return { firstDate: "", secondDate: "" };
  }

  try {
    const [dataOne, dataTwo] = await Promise.all(
      [firstDate, secondDate].map((date) =>
        getWeatherLocation({
          longitude,
          latitude,
          WEATHER_VISUAL_CROSSING_API_KEY: process.env
            .WEATHER_VISUAL_CROSSING_API_KEY as ENV_TYPES["WEATHER_VISUAL_CROSSING_API_KEY"],
          date: date!,
        }),
      ),
    );

    const firstWeatherData = dataOne ?? d1;
    const secondWeatherData = dataTwo ?? d2;

    const openAiPromise = new OpenAI({
      apiKey: process.env["OPENAI_API_KEY"],
    });

    const response = openAiPromise.chat.completions
      .create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `${chatgptPrompt(
              formatMmDdYyToDateString(firstDate),
              formatMmDdYyToDateString(secondDate),
            )}
        first weather data: ${JSON.stringify(firstWeatherData)}
        second weather data: ${JSON.stringify(secondWeatherData)}`,
          },
        ],
      })
      .then((response) => {
        return response.choices[0].message.content;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Error fetching OpenAI response:", error);
        return null;
      });

    return defer({ dataOne: d1, dataTwo: d2, content: response });
  } catch (error) {
    return defer({ dataOne: d1, dataTwo: d2, content: "" });
  }
};

export default function RemixLoader() {
  const { dataOne, dataTwo, content } = useLoaderData<typeof loader>();
  const shouldRender = dataOne && dataTwo;

  return (
    <>
      <Header
        heading={
          <Link to="/" className="tw-flex tw-items-center tw-gap-2">
            <SVG />
            <span className="tw-text-indigo-900">Weather Compare</span>
          </Link>
        }
        summarySlot={
          <aside className="tw-flex tw-justify-center tw-items-center">
            <Suspense fallback={<Button variant="outline">Loading...</Button>}>
              <Await
                resolve={content}
                errorElement={
                  <div className="tw-text-sm tw-text-red-400">
                    Error loading comparison.
                  </div>
                }
              >
                {(resolvedContent) => {
                  return resolvedContent ? (
                    <DialogCompareSummary content={resolvedContent} />
                  ) : null;
                }}
              </Await>
            </Suspense>
          </aside>
        }
      />
      <section className="tw-flex tw-flex-row tw-justify-center tw-items-center tw-mt-16 tw-w-screen">
        <main className="tw-full tw-flex tw-flex-col tw-justify-center tw-pt-6 tw-mt-16">
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
      </section>
    </>
  );
}
