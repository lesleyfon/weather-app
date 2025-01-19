import {
  json,
  redirect,
  type ActionFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Link,
  useActionData,
  useSearchParams,
  Form,
  useFetcher,
} from "@remix-run/react";
import posthog from "posthog-js";
import { useMemo } from "react";

import { getGeocode } from "~/api/weather.api";
import { SVG } from "~/components/chartcustomizedcursor";
import DatePickerComponent from "~/components/datepicker";
import FormError from "~/components/form-errors";
import LocationAutoComplete from "~/components/locationautocomplete";
import { Button } from "~/components/ui/button";
import { Header } from "~/components/ui/header";
import { ENV_TYPES, QUERY_PARAMS_ENUM, DateType } from "~/types/location.types";
import { setURLParamsAsDefaultDate, canNavigateWithAllParams } from "~/utils";

// THIS IS THE ACTION FOR THE FORM. WILL BE USE AS A FALLBACK IF JS IS DISABLED.
export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const location = form.get("location") as string;

  const url = new URL(request.url);

  const firstDate = url.searchParams.get(
    QUERY_PARAMS_ENUM.FIRST_DATE,
  ) as string;
  const secondDate = url.searchParams.get(
    QUERY_PARAMS_ENUM.SECOND_DATE,
  ) as string;

  const queryParams = new URLSearchParams();
  const errors: Record<string, string> = {};
  if (!location) {
    errors.location = "Location is required";
  }
  if (!firstDate || !secondDate) {
    errors.date = "Both dates are required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  // if the user has already submitted the form, redirect to the weather-compare page
  if (
    url.searchParams.has(QUERY_PARAMS_ENUM.LONGITUDE) &&
    url.searchParams.has(QUERY_PARAMS_ENUM.LATITUDE)
  ) {
    return redirect(`/weather-compare${url.search}`);
  }

  const response = await getGeocode({
    input: location,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as ENV_TYPES["GOOGLE_API_KEY"],
  });

  const responseData = response?.results[0]?.geometry?.location;

  if (responseData) {
    const { lng, lat } = responseData;
    queryParams.set("longitude", lng.toString());
    queryParams.set("latitude", lat.toString());

    if (firstDate) queryParams.set(QUERY_PARAMS_ENUM.FIRST_DATE, firstDate);
    if (secondDate) queryParams.set(QUERY_PARAMS_ENUM.SECOND_DATE, secondDate);
  }

  return redirect(`/weather-compare?${queryParams.toString()}`);
};

export const meta: MetaFunction = () => {
  return [
    { title: "Weather Comparison Tool" },
    {
      name: "description",
      content: "Compare weather conditions between two dates",
    },
  ];
};

function Index() {
  const actionData = useActionData<typeof action>();

  const preFetcher = useFetcher();
  const [searchParams] = useSearchParams();

  const firstDate = searchParams.get(QUERY_PARAMS_ENUM.FIRST_DATE);
  const secondDate = searchParams.get(QUERY_PARAMS_ENUM.SECOND_DATE);

  const { defaultFirstDate, defaultSecondDate } = useMemo(
    () => setURLParamsAsDefaultDate({ firstDate, secondDate }),
    [firstDate, secondDate],
  );

  const canNavigate = useMemo(canNavigateWithAllParams, [searchParams]);

  const trackButtonClick = () => {
    posthog.capture("button_clicked");
  };
  return (
    <>
      <Header
        heading={
          <Link to="/" className="tw-flex tw-items-center tw-gap-2">
            <SVG />
            <span className="tw-text-indigo-900">Weather Compare</span>
          </Link>
        }
      />
      <main className="tw-container tw-flex tw-flex-col tw-mt-7 md:tw-mt-36  tw-m-auto tw-items-center tw-h-screen tw-max-w-6xl tw-w-full">
        <h1 className="tw-text-center tw-text-2xl tw-font-bold tw-text-indigo-900">
          Compare Weather Between Two Dates
        </h1>
        <p className="tw-text-center tw-text-lg tw-text-indigo-900 tw-my-4 ">
          Enter a location and two dates to compare the weather between them.
        </p>
        <Form
          method="post"
          className="tw-grid tw-grid-rows-[repeat(4_1fr)] tw-grid-cols-[repeat(1,100%)]  md:tw-grid-rows-[1] md:tw-grid-cols-[1fr_1fr_1fr_82px] tw-gap-2 tw-justify-center tw-items-center tw-w-full tw-px-4"
        >
          <LocationAutoComplete />

          <DatePickerComponent
            dateType={DateType.FIRST}
            defaultDate={defaultFirstDate}
          />
          <DatePickerComponent
            dateType={DateType.SECOND}
            defaultDate={defaultSecondDate}
          />
          {canNavigate ? (
            <Link
              to={`/weather-compare${window.location.search}`}
              prefetch="intent"
              className="tw-bg-indigo-950 tw-text-white tw-h-[52px] tw-flex tw-items-center tw-justify-center tw-rounded-md"
              onClick={trackButtonClick}
              onMouseOver={() => {
                preFetcher.load(`/weather-compare${window.location.search}`);
              }}
            >
              Submit
            </Link>
          ) : (
            <Button
              type="submit"
              className="tw-bg-indigo-950 tw-text-white tw-h-[52px]"
              onClick={trackButtonClick}
            >
              Submit
            </Button>
          )}
        </Form>
        <FormError errors={actionData?.errors ?? {}} />
      </main>
    </>
  );
}

export default Index;
